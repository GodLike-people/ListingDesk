from __future__ import annotations

import zipfile
from pathlib import Path

from .config import Config, ensure_project_dirs
from .downloader import FlomoDownloadError, FlomoDownloader
from .models import SyncSummary
from .parser import FlomoZipParser
from .state import SyncState
from .utils import sha256_file
from .writer import MarkdownWriter


class SyncEngine:
    PARSER_VERSION = 2

    def __init__(self, project_root: Path, config: Config, state: SyncState) -> None:
        self.project_root = project_root
        self.config = config
        self.state = state
        self.parser = FlomoZipParser()
        self.writer = MarkdownWriter(config, state)

    def sync(
        self,
        auto_download: bool = True,
        zip_path: Path | None = None,
        force: bool = False,
        interactive_download: bool = True,
    ) -> SyncSummary:
        ensure_project_dirs(self.project_root, self.config)
        archives = self._collect_archives(auto_download, zip_path, interactive_download)
        summary = SyncSummary()
        if not archives:
            print(f"No ZIP files found. Put manual flomo exports in: {self.project_root / self.config.import_dir}")
            return summary
        for archive_path in archives:
            summary.extend(self.sync_zip(archive_path, force=force))
        if summary.archives or summary.duplicate_archives:
            self.state.mark_success()
            self.state.save()
        return summary

    def sync_zip(self, zip_path: Path, force: bool = False) -> SyncSummary:
        summary = SyncSummary(archives=1)
        archive_hash = sha256_file(zip_path)
        if self.state.archive_seen(archive_hash, self.PARSER_VERSION) and not force:
            summary.duplicate_archives = 1
            print(f"Skipping duplicate archive: {zip_path.name}")
            return summary
        try:
            memos = self.parser.parse(zip_path)
            summary.memo_count = len(memos)
            with zipfile.ZipFile(zip_path) as archive:
                for memo in memos:
                    try:
                        result = self.writer.write(memo, archive)
                        if result.action == "created":
                            summary.created += 1
                        elif result.action == "updated":
                            summary.updated += 1
                        else:
                            summary.skipped += 1
                    except Exception as exc:
                        summary.failed += 1
                        print(f"Failed to write memo {memo.id}: {exc}")
            if summary.failed == 0:
                self.state.mark_archive(archive_hash, zip_path, len(memos), self.PARSER_VERSION)
                self.state.save()
        except Exception as exc:
            summary.failed += 1
            print(f"Failed to process archive {zip_path}: {exc}")
        return summary

    def _collect_archives(self, auto_download: bool, zip_path: Path | None, interactive_download: bool) -> list[Path]:
        if zip_path:
            return [zip_path]
        archives: list[Path] = []
        if auto_download:
            try:
                downloaded = FlomoDownloader(self.project_root, self.config).download(
                    interactive_prompt=interactive_download
                )
                print(f"Downloaded flomo export: {downloaded}")
                archives.append(downloaded)
            except FlomoDownloadError as exc:
                print(f"Automatic flomo export failed: {exc}")
                print("Falling back to ZIP files in imports.")
        import_dir = self.project_root / self.config.import_dir
        download_dir = self.project_root / self.config.download_dir
        manual_archives = [
            *sorted(import_dir.glob("*.zip"), key=lambda path: path.stat().st_mtime),
            *sorted(download_dir.glob("*.zip"), key=lambda path: path.stat().st_mtime),
        ]
        for path in manual_archives:
            if path in archives:
                continue
            if not zipfile.is_zipfile(path):
                print(f"Skipping invalid ZIP file: {path}")
                continue
            archives.append(path)
        return archives
