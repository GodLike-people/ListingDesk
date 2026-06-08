from __future__ import annotations

import zipfile
from pathlib import Path

from flomo_obsidian.config import Config
from flomo_obsidian.state import SyncState
from flomo_obsidian.sync import SyncEngine
from flomo_obsidian.utils import safe_filename


def write_sample_zip(path: Path, body: str) -> None:
    html = f"""
    <html><body>
      <div class="memo" data-memo-id="memo-1">
        <div class="time">2026-06-08 10:30:00</div>
        <div class="content">
          <p>{body}</p>
          <p>#idea #中文标签</p>
        </div>
        <div class="files">
          <img src="assets/photo.png" />
        </div>
      </div>
    </body></html>
    """
    with zipfile.ZipFile(path, "w") as archive:
        archive.writestr("index.html", html)
        archive.writestr("assets/photo.png", b"fake-image")


def make_engine(tmp_path: Path) -> SyncEngine:
    project = tmp_path / "project"
    vault = tmp_path / "vault"
    project.mkdir()
    vault.mkdir()
    config = Config(vault_path=vault)
    state = SyncState(project / "state.json")
    return SyncEngine(project, config, state)


def test_sync_writes_markdown_and_attachment(tmp_path: Path) -> None:
    zip_path = tmp_path / "flomo.zip"
    write_sample_zip(zip_path, "Hello <mark>important</mark> memo")
    engine = make_engine(tmp_path)

    summary = engine.sync_zip(zip_path)

    assert summary.created == 1
    notes = list((tmp_path / "vault" / "Flomo" / "2026" / "06").glob("*.md"))
    assert len(notes) == 1
    content = notes[0].read_text(encoding="utf-8")
    assert "flomo_id: memo-1" in content
    assert "==important==" in content
    assert "#idea" in content
    assert "tags:" in content
    assert "source:" not in content
    assert "2026-06-08 10:30:00" not in content.split("---", 2)[-1]
    assert "../_attachments/2026/06/" in content
    attachments = list((tmp_path / "vault" / "Flomo" / "_attachments" / "2026" / "06").glob("*.png"))
    assert len(attachments) == 1


def test_force_reprocess_is_idempotent_at_memo_level(tmp_path: Path) -> None:
    zip_path = tmp_path / "flomo.zip"
    write_sample_zip(zip_path, "Same memo")
    engine = make_engine(tmp_path)

    first = engine.sync_zip(zip_path)
    second = engine.sync_zip(zip_path, force=True)

    assert first.created == 1
    assert second.created == 0
    assert second.updated == 0
    assert second.skipped == 1


def test_changed_memo_updates_original_file(tmp_path: Path) -> None:
    zip_path = tmp_path / "flomo.zip"
    write_sample_zip(zip_path, "Original memo")
    engine = make_engine(tmp_path)
    engine.sync_zip(zip_path)
    original = next((tmp_path / "vault" / "Flomo" / "2026" / "06").glob("*.md"))

    write_sample_zip(zip_path, "Edited memo")
    summary = engine.sync_zip(zip_path, force=True)

    notes = list((tmp_path / "vault" / "Flomo" / "2026" / "06").glob("*.md"))
    assert summary.updated == 1
    assert notes == [original]
    assert "Edited memo" in original.read_text(encoding="utf-8")


def test_duplicate_archive_skips_by_default(tmp_path: Path) -> None:
    zip_path = tmp_path / "flomo.zip"
    write_sample_zip(zip_path, "Same archive")
    engine = make_engine(tmp_path)
    engine.sync_zip(zip_path)

    summary = engine.sync_zip(zip_path)

    assert summary.duplicate_archives == 1
    assert summary.created == 0
    assert summary.updated == 0


def test_safe_filename_handles_windows_invalid_chars() -> None:
    assert safe_filename('a<b>c:d"e/f\\g|h?i*j') == "a-b-c-d-e-f-g-h-i-j"


def test_flomo_export_html_splits_each_memo(tmp_path: Path) -> None:
    zip_path = tmp_path / "flomo.zip"
    html = """
    <html><body>
      <div class="flomo">
        <div class="memos">
          <div class="memo">
            <div class="time">2026-06-08 12:02:19</div>
            <div class="content"><p>First memo #first</p></div>
            <div class="files"></div>
          </div>
          <div class="memo">
            <div class="time">2026-06-08 09:10:49</div>
            <div class="content"><p>Second memo without tag</p></div>
            <div class="files"></div>
          </div>
        </div>
      </div>
    </body></html>
    """
    with zipfile.ZipFile(zip_path, "w") as archive:
        archive.writestr("flomo/export.html", html)
    engine = make_engine(tmp_path)

    summary = engine.sync_zip(zip_path)

    assert summary.created == 2
    notes = sorted((tmp_path / "vault" / "Flomo" / "2026" / "06").glob("*.md"))
    assert len(notes) == 2
    contents = [note.read_text(encoding="utf-8") for note in notes]
    with_tag = next(content for content in contents if "#first" in content)
    without_tag = next(content for content in contents if "Second memo without tag" in content)
    assert "#first" in with_tag
    assert "tags:" in with_tag
    assert "source:" not in with_tag
    assert "Second memo without tag" in without_tag
    assert "tags:" not in without_tag
