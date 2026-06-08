from __future__ import annotations

import contextlib
import json
import threading
import traceback
from dataclasses import asdict, dataclass, field
from datetime import datetime
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

from .config import Config, config_path, ensure_project_dirs, load_config, save_config
from .state import SyncState
from .sync import SyncEngine


PROJECT_ROOT = Path.cwd()
HOST = "127.0.0.1"
PORT = 8765


@dataclass
class Job:
    id: int
    status: str = "running"
    started_at: str = field(default_factory=lambda: datetime.now().isoformat(timespec="seconds"))
    finished_at: str | None = None
    logs: list[str] = field(default_factory=list)
    summary: dict[str, Any] | None = None

    def write(self, text: str) -> int:
        if text:
            self.logs.append(text)
        return len(text)

    def flush(self) -> None:
        return None


JOBS: dict[int, Job] = {}
JOB_LOCK = threading.Lock()
NEXT_JOB_ID = 1


def main() -> int:
    ensure_runtime_dirs()
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"Flomo2Obsidian web console: http://{HOST}:{PORT}")
    print("Press Ctrl+C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("")
        print("Stopped.")
    finally:
        server.server_close()
    return 0


def ensure_runtime_dirs() -> None:
    (PROJECT_ROOT / "imports").mkdir(parents=True, exist_ok=True)
    (PROJECT_ROOT / "downloads").mkdir(parents=True, exist_ok=True)
    (PROJECT_ROOT / "logs").mkdir(parents=True, exist_ok=True)


class Handler(BaseHTTPRequestHandler):
    server_version = "FlomoObsidianWeb/0.1"

    def do_GET(self) -> None:
        if self.path == "/" or self.path.startswith("/?"):
            self.send_html(WEB_HTML)
            return
        if self.path == "/api/status":
            self.send_json(status_payload())
            return
        if self.path.startswith("/api/job/"):
            job_id = int(self.path.rsplit("/", 1)[-1])
            with JOB_LOCK:
                job = JOBS.get(job_id)
            if not job:
                self.send_json({"error": "Job not found"}, HTTPStatus.NOT_FOUND)
                return
            self.send_json(job_payload(job))
            return
        self.send_json({"error": "Not found"}, HTTPStatus.NOT_FOUND)

    def do_POST(self) -> None:
        if self.path == "/api/config":
            payload = self.read_json()
            vault_path = Path(str(payload.get("vault_path", "")).strip().strip('"'))
            if not str(vault_path):
                self.send_json({"error": "Obsidian vault path is required"}, HTTPStatus.BAD_REQUEST)
                return
            config = load_existing_or_default(vault_path)
            config.vault_path = vault_path
            save_config(PROJECT_ROOT, config)
            ensure_project_dirs(PROJECT_ROOT, config)
            self.send_json({"ok": True, "status": status_payload()})
            return
        if self.path == "/api/sync":
            payload = self.read_json()
            mode = payload.get("mode", "manual")
            force = bool(payload.get("force", False))
            auto_download = mode == "auto"
            job = start_sync_job(auto_download=auto_download, force=force)
            self.send_json(job_payload(job), HTTPStatus.ACCEPTED)
            return
        self.send_json({"error": "Not found"}, HTTPStatus.NOT_FOUND)

    def log_message(self, format: str, *args: object) -> None:
        return None

    def read_json(self) -> dict[str, Any]:
        length = int(self.headers.get("Content-Length", "0"))
        if length <= 0:
            return {}
        raw = self.rfile.read(length).decode("utf-8")
        return json.loads(raw) if raw else {}

    def send_html(self, body: str) -> None:
        encoded = body.encode("utf-8")
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)

    def send_json(self, payload: dict[str, Any], status: HTTPStatus = HTTPStatus.OK) -> None:
        encoded = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)


def load_existing_or_default(vault_path: Path) -> Config:
    if config_path(PROJECT_ROOT).exists():
        return load_config(PROJECT_ROOT, interactive=False)
    return Config(vault_path=vault_path)


def status_payload() -> dict[str, Any]:
    config_exists = config_path(PROJECT_ROOT).exists()
    config: Config | None = None
    if config_exists:
        try:
            config = load_config(PROJECT_ROOT, interactive=False)
        except Exception:
            config = None
    import_dir = PROJECT_ROOT / (config.import_dir if config else "imports")
    download_dir = PROJECT_ROOT / (config.download_dir if config else "downloads")
    state_path = PROJECT_ROOT / "state.json"
    state_data: dict[str, Any] = {}
    if state_path.exists():
        try:
            state_data = SyncState.load(PROJECT_ROOT).data
        except Exception:
            state_data = {}
    return {
        "project_root": str(PROJECT_ROOT),
        "config_exists": config_exists,
        "vault_path": str(config.vault_path) if config else "",
        "notes_root": config.notes_root if config else "Flomo",
        "import_dir": str(import_dir),
        "download_dir": str(download_dir),
        "manual_zips": [path.name for path in sorted(import_dir.glob("*.zip"))] if import_dir.exists() else [],
        "memo_count": len(state_data.get("memos", {})),
        "archive_count": len(state_data.get("processed_archives", {})),
        "last_successful_sync": state_data.get("last_successful_sync"),
    }


def start_sync_job(auto_download: bool, force: bool) -> Job:
    global NEXT_JOB_ID
    with JOB_LOCK:
        running = next((job for job in JOBS.values() if job.status == "running"), None)
        if running:
            return running
        job = Job(id=NEXT_JOB_ID)
        NEXT_JOB_ID += 1
        JOBS[job.id] = job
    thread = threading.Thread(target=run_sync_job, args=(job, auto_download, force), daemon=True)
    thread.start()
    return job


def run_sync_job(job: Job, auto_download: bool, force: bool) -> None:
    try:
        with contextlib.redirect_stdout(job), contextlib.redirect_stderr(job):
            print(f"Started sync at {job.started_at}")
            config = load_config(PROJECT_ROOT, interactive=False)
            ensure_project_dirs(PROJECT_ROOT, config)
            state = SyncState.load(PROJECT_ROOT)
            engine = SyncEngine(PROJECT_ROOT, config, state)
            summary = engine.sync(
                auto_download=auto_download,
                force=force,
                interactive_download=False,
            )
            job.summary = asdict(summary)
            print("")
            print("Sync summary")
            print(f"  Archives processed: {summary.archives}")
            print(f"  Duplicate archives skipped: {summary.duplicate_archives}")
            print(f"  Memos parsed: {summary.memo_count}")
            print(f"  Created: {summary.created}")
            print(f"  Updated: {summary.updated}")
            print(f"  Unchanged: {summary.skipped}")
            print(f"  Failed: {summary.failed}")
            job.status = "failed" if summary.failed else "finished"
    except Exception:
        job.status = "failed"
        job.write(traceback.format_exc())
    finally:
        job.finished_at = datetime.now().isoformat(timespec="seconds")


def job_payload(job: Job) -> dict[str, Any]:
    return {
        "id": job.id,
        "status": job.status,
        "started_at": job.started_at,
        "finished_at": job.finished_at,
        "logs": "".join(job.logs),
        "summary": job.summary,
    }


WEB_HTML = r"""<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Flomo2Obsidian</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f7f7f4;
      --panel: #ffffff;
      --text: #202124;
      --muted: #656d76;
      --line: #d8d9d2;
      --accent: #0f766e;
      --accent-strong: #115e59;
      --warn: #9a3412;
      --ok: #166534;
      --shadow: 0 12px 32px rgba(32, 33, 36, 0.08);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      background: var(--bg);
      color: var(--text);
      font: 14px/1.5 "Segoe UI", "Microsoft YaHei", system-ui, sans-serif;
      letter-spacing: 0;
    }
    main {
      width: min(1120px, calc(100vw - 32px));
      margin: 0 auto;
      padding: 28px 0 36px;
    }
    header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 18px;
      margin-bottom: 20px;
    }
    h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 720;
    }
    .subtle { color: var(--muted); }
    .layout {
      display: grid;
      grid-template-columns: minmax(0, 0.9fr) minmax(420px, 1.1fr);
      gap: 18px;
      align-items: start;
    }
    section {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      box-shadow: var(--shadow);
    }
    .section-inner { padding: 18px; }
    h2 {
      margin: 0 0 12px;
      font-size: 16px;
      font-weight: 680;
    }
    label {
      display: block;
      margin-bottom: 7px;
      color: var(--muted);
      font-size: 13px;
    }
    input[type="text"] {
      width: 100%;
      height: 38px;
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 0 10px;
      color: var(--text);
      background: #fff;
      font: inherit;
    }
    input[type="checkbox"] { transform: translateY(1px); }
    .row {
      display: flex;
      gap: 10px;
      align-items: center;
      flex-wrap: wrap;
    }
    .stack { display: grid; gap: 14px; }
    button, a.button {
      min-height: 36px;
      border: 1px solid transparent;
      border-radius: 6px;
      padding: 0 13px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      background: var(--accent);
      color: #fff;
      font: inherit;
      font-weight: 620;
      text-decoration: none;
      cursor: pointer;
      white-space: nowrap;
    }
    button.secondary, a.button.secondary {
      background: #fff;
      color: var(--text);
      border-color: var(--line);
    }
    button:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
    .status-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }
    .metric {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 12px;
      min-height: 72px;
      background: #fbfbf8;
    }
    .metric b {
      display: block;
      font-size: 20px;
      margin-top: 4px;
      overflow-wrap: anywhere;
    }
    .path {
      padding: 10px;
      border: 1px dashed var(--line);
      border-radius: 6px;
      background: #fbfbf8;
      color: var(--muted);
      overflow-wrap: anywhere;
      font-family: Consolas, "Cascadia Mono", monospace;
      font-size: 12px;
    }
    .notice {
      border-left: 3px solid var(--accent);
      background: #eef7f5;
      padding: 10px 12px;
      color: #164e4a;
      border-radius: 4px;
    }
    .log {
      min-height: 390px;
      max-height: 58vh;
      overflow: auto;
      margin: 0;
      padding: 14px;
      border-radius: 8px;
      background: #181a1b;
      color: #e8eaed;
      font: 12px/1.55 Consolas, "Cascadia Mono", monospace;
      white-space: pre-wrap;
    }
    .pill {
      display: inline-flex;
      align-items: center;
      min-height: 24px;
      padding: 0 8px;
      border-radius: 999px;
      border: 1px solid var(--line);
      background: #fff;
      color: var(--muted);
      font-size: 12px;
    }
    .pill.ok { color: var(--ok); border-color: #bbd7bd; background: #f0f8ef; }
    .pill.warn { color: var(--warn); border-color: #f0c7a8; background: #fff7ed; }
    @media (max-width: 880px) {
      main { width: min(100vw - 20px, 680px); padding-top: 18px; }
      header { align-items: flex-start; flex-direction: column; }
      .layout { grid-template-columns: 1fr; }
      .status-grid { grid-template-columns: 1fr; }
      .log { min-height: 300px; }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <div>
        <h1>Flomo2Obsidian</h1>
        <div class="subtle">本地同步控制台</div>
      </div>
      <span id="runState" class="pill">读取状态中</span>
    </header>

    <div class="layout">
      <div class="stack">
        <section>
          <div class="section-inner stack">
            <h2>Obsidian 设置</h2>
            <div>
              <label for="vaultPath">Obsidian 笔记库文件夹路径</label>
              <input id="vaultPath" type="text" placeholder="例如 D:\Notes\MyVault" />
            </div>
            <div class="row">
              <button id="saveConfig">保存设置</button>
              <button id="refresh" class="secondary">刷新状态</button>
            </div>
            <div class="path" id="projectPath"></div>
          </div>
        </section>

        <section>
          <div class="section-inner stack">
            <h2>同步</h2>
            <div class="notice">
              自动同步会先打开 https://v.flomoapp.com/login，登录后进入 /mine?source=export 找导出按钮。手动 ZIP 同步会处理 imports 和 downloads 里的 ZIP。
            </div>
            <div class="row">
              <button id="autoSync">自动打开 flomo 并同步</button>
              <button id="manualSync" class="secondary">同步本地 ZIP</button>
            </div>
            <label class="row">
              <input id="force" type="checkbox" />
              重新处理已见过的 ZIP，但 memo 未变化仍不会重复写入
            </label>
            <div>
              <label>手动 ZIP 放这里，也会读取 downloads</label>
              <div class="path" id="importPath"></div>
            </div>
          </div>
        </section>

        <section>
          <div class="section-inner stack">
            <h2>当前状态</h2>
            <div class="status-grid">
              <div class="metric"><span class="subtle">已同步 memo</span><b id="memoCount">0</b></div>
              <div class="metric"><span class="subtle">已处理 ZIP</span><b id="archiveCount">0</b></div>
              <div class="metric"><span class="subtle">imports ZIP</span><b id="zipCount">0</b></div>
              <div class="metric"><span class="subtle">上次成功</span><b id="lastSync">-</b></div>
            </div>
          </div>
        </section>
      </div>

      <section>
        <div class="section-inner stack">
          <div class="row" style="justify-content: space-between">
            <h2 style="margin:0">运行日志</h2>
            <span id="jobState" class="pill">空闲</span>
          </div>
          <pre class="log" id="log">等待操作...</pre>
        </div>
      </section>
    </div>
  </main>

  <script>
    const $ = (id) => document.getElementById(id);
    let currentJob = null;
    let polling = null;

    async function api(path, options = {}) {
      const response = await fetch(path, {
        headers: { "Content-Type": "application/json" },
        ...options,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "请求失败");
      return data;
    }

    async function refreshStatus() {
      const status = await api("/api/status");
      $("vaultPath").value = status.vault_path || $("vaultPath").value;
      $("projectPath").textContent = "项目目录: " + status.project_root;
      $("importPath").textContent = status.import_dir;
      $("memoCount").textContent = status.memo_count;
      $("archiveCount").textContent = status.archive_count;
      $("zipCount").textContent = status.manual_zips.length;
      $("lastSync").textContent = status.last_successful_sync || "-";
      $("runState").textContent = status.config_exists ? "已配置" : "需要设置 Obsidian 路径";
      $("runState").className = status.config_exists ? "pill ok" : "pill warn";
    }

    async function saveConfig() {
      const vaultPath = $("vaultPath").value.trim();
      if (!vaultPath) {
        alert("先填 Obsidian 笔记库路径");
        return;
      }
      await api("/api/config", {
        method: "POST",
        body: JSON.stringify({ vault_path: vaultPath }),
      });
      await refreshStatus();
      $("log").textContent = "设置已保存。\n";
    }

    async function startSync(mode) {
      await saveConfig();
      const data = await api("/api/sync", {
        method: "POST",
        body: JSON.stringify({ mode, force: $("force").checked }),
      });
      currentJob = data.id;
      $("log").textContent = data.logs || "任务已启动...\n";
      pollJob();
      if (polling) clearInterval(polling);
      polling = setInterval(pollJob, 1500);
    }

    async function pollJob() {
      if (!currentJob) return;
      const job = await api("/api/job/" + currentJob);
      $("jobState").textContent = job.status;
      $("jobState").className = job.status === "finished" ? "pill ok" : job.status === "failed" ? "pill warn" : "pill";
      $("log").textContent = job.logs || "";
      $("log").scrollTop = $("log").scrollHeight;
      if (job.status !== "running") {
        clearInterval(polling);
        polling = null;
        await refreshStatus();
      }
    }

    $("saveConfig").addEventListener("click", () => saveConfig().catch((error) => alert(error.message)));
    $("refresh").addEventListener("click", () => refreshStatus().catch((error) => alert(error.message)));
    $("manualSync").addEventListener("click", () => startSync("manual").catch((error) => alert(error.message)));
    $("autoSync").addEventListener("click", () => startSync("auto").catch((error) => alert(error.message)));

    refreshStatus().catch((error) => {
      $("runState").textContent = "读取失败";
      $("runState").className = "pill warn";
      $("log").textContent = error.message;
    });
  </script>
</body>
</html>
"""


if __name__ == "__main__":
    raise SystemExit(main())
