from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime


@dataclass(slots=True)
class Memo:
    id: str
    html: str
    text: str
    title: str
    source_path: str
    index: int
    created: datetime
    updated: datetime | None = None
    tags: list[str] = field(default_factory=list)


@dataclass(slots=True)
class SyncSummary:
    created: int = 0
    updated: int = 0
    skipped: int = 0
    duplicate_archives: int = 0
    failed: int = 0
    archives: int = 0
    memo_count: int = 0

    def extend(self, other: "SyncSummary") -> None:
        self.created += other.created
        self.updated += other.updated
        self.skipped += other.skipped
        self.duplicate_archives += other.duplicate_archives
        self.failed += other.failed
        self.archives += other.archives
        self.memo_count += other.memo_count
