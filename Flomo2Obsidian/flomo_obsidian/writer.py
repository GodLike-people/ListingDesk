from __future__ import annotations

import posixpath
import re
import zipfile
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urlparse

import yaml
from bs4 import BeautifulSoup
from markdownify import markdownify as html_to_markdown

from .config import Config
from .models import Memo
from .state import SyncState
from .utils import (
    extension_for_asset,
    possible_zip_asset_paths,
    relative_markdown_path,
    safe_filename,
    sha256_bytes,
    sha256_text,
    unique_path,
)


@dataclass(slots=True)
class WriteResult:
    action: str
    path: Path
    content_hash: str


class MarkdownWriter:
    def __init__(self, config: Config, state: SyncState) -> None:
        self.config = config
        self.state = state

    def write(self, memo: Memo, archive: zipfile.ZipFile) -> WriteResult:
        note_dir = self._note_dir(memo)
        attachment_dir = self._attachment_dir(memo)
        note_dir.mkdir(parents=True, exist_ok=True)
        attachment_dir.mkdir(parents=True, exist_ok=True)

        previous = self.state.get_memo(memo.id)
        target_path = self._target_path(memo, note_dir, previous)
        body, asset_hashes = self._render_body(memo, archive, note_dir, attachment_dir)
        content_hash = sha256_text("\n".join([body, *memo.tags, *asset_hashes]))
        document = self._document(memo, body, content_hash)
        rel_path = target_path.relative_to(self.config.vault_path).as_posix()

        if previous and previous.get("content_hash") == content_hash and target_path.exists():
            return WriteResult("skipped", target_path, content_hash)

        action = "updated" if previous and target_path.exists() else "created"
        target_path.write_text(document, encoding="utf-8")
        self.state.set_memo(
            memo.id,
            {
                "path": rel_path,
                "content_hash": content_hash,
                "created": memo.created.isoformat(timespec="seconds"),
                "updated": memo.updated.isoformat(timespec="seconds") if memo.updated else None,
                "tags": memo.tags,
            },
        )
        return WriteResult(action, target_path, content_hash)

    def _note_dir(self, memo: Memo) -> Path:
        return self.config.vault_path / self.config.notes_root / f"{memo.created:%Y}" / f"{memo.created:%m}"

    def _attachment_dir(self, memo: Memo) -> Path:
        return self.config.vault_path / self.config.attachment_root / f"{memo.created:%Y}" / f"{memo.created:%m}"

    def _target_path(self, memo: Memo, note_dir: Path, previous: dict | None) -> Path:
        if previous and previous.get("path"):
            return self.config.vault_path / previous["path"]
        stamp = f"{memo.created:%Y-%m-%d_%H%M%S}"
        slug = safe_filename(memo.title, max_length=44)
        filename = f"{stamp}_{slug}_{sha256_text(memo.id)[:12]}.md"
        return unique_path(note_dir / filename)

    def _render_body(
        self,
        memo: Memo,
        archive: zipfile.ZipFile,
        note_dir: Path,
        attachment_dir: Path,
    ) -> tuple[str, list[str]]:
        soup = self._body_soup(memo)
        asset_hashes: list[str] = []
        for mark in soup.find_all("mark"):
            mark.replace_with(f"=={mark.get_text('', strip=False)}==")
        for image_index, image in enumerate(soup.find_all("img"), start=1):
            src = image.get("src")
            if not src:
                continue
            asset = self._copy_asset(src, memo, archive, note_dir, attachment_dir, image_index)
            if not asset:
                continue
            markdown_src, asset_hash = asset
            image["src"] = markdown_src
            asset_hashes.append(asset_hash)
        markdown = html_to_markdown(str(soup), heading_style="ATX", bullets="-")
        markdown = self._clean_markdown(markdown)
        return markdown or memo.text, asset_hashes

    def _body_soup(self, memo: Memo) -> BeautifulSoup:
        raw = BeautifulSoup(memo.html, "html.parser")
        content = raw.find(class_=lambda value: value and "content" in str(value).lower())
        files = raw.find(class_=lambda value: value and "files" in str(value).lower())
        if not content:
            return raw
        parts = [str(content)]
        if files:
            parts.extend(str(image) for image in files.find_all("img"))
        return BeautifulSoup("\n".join(parts), "html.parser")

    def _copy_asset(
        self,
        src: str,
        memo: Memo,
        archive: zipfile.ZipFile,
        note_dir: Path,
        attachment_dir: Path,
        image_index: int,
    ) -> tuple[str, str] | None:
        parsed = urlparse(src)
        if parsed.scheme in {"http", "https", "data"}:
            return None
        name = self._find_archive_asset(archive, memo.source_path, src)
        if not name:
            return None
        data = archive.read(name)
        digest = sha256_bytes(data)
        suffix = extension_for_asset(name)
        base = safe_filename(Path(posixpath.basename(name)).stem, max_length=32)
        filename = f"{sha256_text(memo.id)[:12]}_{image_index:02d}_{base}{suffix}"
        target = attachment_dir / filename
        if not target.exists() or sha256_bytes(target.read_bytes()) != digest:
            target.write_bytes(data)
        return relative_markdown_path(target, note_dir), digest

    def _find_archive_asset(self, archive: zipfile.ZipFile, source_path: str, src: str) -> str | None:
        names = set(archive.namelist())
        candidates = possible_zip_asset_paths(source_path, src)
        for candidate in candidates:
            if candidate in names:
                return candidate
        basename = posixpath.basename(candidates[-1]) if candidates else posixpath.basename(src)
        if not basename:
            return None
        matches = [name for name in names if posixpath.basename(name) == basename]
        return matches[0] if len(matches) == 1 else None

    def _document(self, memo: Memo, body: str, content_hash: str) -> str:
        frontmatter = {
            "flomo_id": memo.id,
            "created": memo.created.isoformat(timespec="seconds"),
            "updated": memo.updated.isoformat(timespec="seconds") if memo.updated else None,
            "content_hash": content_hash,
        }
        if memo.tags:
            frontmatter["tags"] = memo.tags
        yaml_text = yaml.safe_dump(frontmatter, allow_unicode=True, sort_keys=False).strip()
        return f"---\n{yaml_text}\n---\n\n{body.rstrip()}\n"

    def _clean_markdown(self, markdown: str) -> str:
        markdown = markdown.replace("\r\n", "\n").replace("\r", "\n")
        markdown = re.sub(r"\n{3,}", "\n\n", markdown)
        markdown = re.sub(r"[ \t]+\n", "\n", markdown)
        return markdown.strip()
