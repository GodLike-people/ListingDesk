from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from typing import Any


class SyncState:
    def __init__(self, path: Path, data: dict[str, Any] | None = None) -> None:
        self.path = path
        self.data = data or {
            "version": 1,
            "processed_archives": {},
            "memos": {},
            "last_successful_sync": None,
        }

    @classmethod
    def load(cls, project_root: Path) -> "SyncState":
        path = project_root / "state.json"
        if not path.exists():
            return cls(path)
        with path.open("r", encoding="utf-8") as file:
            data = json.load(file)
        data.setdefault("version", 1)
        data.setdefault("processed_archives", {})
        data.setdefault("memos", {})
        data.setdefault("last_successful_sync", None)
        return cls(path, data)

    def save(self) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        tmp = self.path.with_suffix(".json.tmp")
        with tmp.open("w", encoding="utf-8") as file:
            json.dump(self.data, file, ensure_ascii=False, indent=2)
            file.write("\n")
        tmp.replace(self.path)

    def archive_seen(self, archive_hash: str, parser_version: int) -> bool:
        archive = self.data["processed_archives"].get(archive_hash)
        return bool(archive and archive.get("parser_version") == parser_version)

    def mark_archive(self, archive_hash: str, path: Path, memo_count: int, parser_version: int) -> None:
        self.data["processed_archives"][archive_hash] = {
            "path": str(path),
            "memo_count": memo_count,
            "parser_version": parser_version,
            "processed_at": datetime.now().isoformat(timespec="seconds"),
        }

    def get_memo(self, memo_id: str) -> dict[str, Any] | None:
        return self.data["memos"].get(memo_id)

    def set_memo(self, memo_id: str, payload: dict[str, Any]) -> None:
        self.data["memos"][memo_id] = payload

    def mark_success(self) -> None:
        self.data["last_successful_sync"] = datetime.now().isoformat(timespec="seconds")
