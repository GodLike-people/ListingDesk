from __future__ import annotations

import re
import zipfile
from datetime import datetime
from pathlib import Path

from bs4 import BeautifulSoup, Tag

from .models import Memo
from .utils import extract_datetimes, parse_datetime, sha256_text, short_title


TAG_PATTERN = re.compile(r"(?<!\w)#([\w\-/\u4e00-\u9fff]+)")


class FlomoZipParser:
    def parse(self, zip_path: Path) -> list[Memo]:
        with zipfile.ZipFile(zip_path) as archive:
            html_names = sorted(
                name
                for name in archive.namelist()
                if name.lower().endswith((".html", ".htm")) and not name.endswith("/")
            )
            memos: list[Memo] = []
            for html_name in html_names:
                raw = archive.read(html_name)
                html = raw.decode("utf-8", errors="replace")
                fallback_date = self._zip_datetime(archive, html_name)
                memos.extend(self._parse_html(html, html_name, fallback_date))
        return _dedupe_memos(memos)

    def _parse_html(self, html: str, source_path: str, fallback_date: datetime) -> list[Memo]:
        soup = BeautifulSoup(html, "html.parser")
        candidates = self._memo_candidates(soup)
        memos: list[Memo] = []
        for index, candidate in enumerate(candidates, start=1):
            full_text = candidate.get_text("\n", strip=True)
            content_node = self._content_node(candidate)
            text = content_node.get_text("\n", strip=True) if content_node else full_text
            if not text:
                continue
            created, updated = self._extract_dates(candidate, full_text, fallback_date)
            raw_id = self._extract_id(candidate)
            if raw_id:
                memo_id = raw_id
            else:
                memo_id = sha256_text(f"{source_path}#{index}")[:24]
            title = short_title(text, memo_id[:12])
            tags = self._extract_tags(content_node or candidate, text)
            memos.append(
                Memo(
                    id=memo_id,
                    html=str(candidate),
                    text=text,
                    title=title,
                    source_path=source_path,
                    index=index,
                    created=created,
                    updated=updated,
                    tags=tags,
                )
            )
        return memos

    def _memo_candidates(self, soup: BeautifulSoup) -> list[Tag]:
        flomo_export_cards = [
            node
            for node in soup.select(".memo")
            if isinstance(node, Tag) and self._looks_like_flomo_export_card(node)
        ]
        if flomo_export_cards:
            return flomo_export_cards

        selectors = [
            "[data-memo-id]",
            "[data-slug]",
            "[data-id]",
            "article",
            ".memo-item",
            ".memo-card",
            ".note-item",
        ]
        candidates: list[Tag] = []
        for selector in selectors:
            for node in soup.select(selector):
                if isinstance(node, Tag) and node not in candidates:
                    candidates.append(node)
        for node in soup.find_all(True):
            if not isinstance(node, Tag):
                continue
            marker = " ".join(
                str(value)
                for value in [
                    node.get("class", ""),
                    node.get("id", ""),
                    node.get("role", ""),
                    node.get("data-type", ""),
                ]
            ).lower()
            if any(token in marker for token in ("memo-item", "memo-card", "note-item")) and node not in candidates:
                candidates.append(node)
        if not candidates:
            body = soup.body or soup
            return [body] if isinstance(body, Tag) else []
        candidate_ids = {id(node) for node in candidates}
        filtered = [
            node
            for node in candidates
            if not any(id(parent) in candidate_ids for parent in node.parents if isinstance(parent, Tag))
        ]
        return filtered or candidates

    def _looks_like_flomo_export_card(self, node: Tag) -> bool:
        classes = set(node.get("class") or [])
        if "memo" not in classes:
            return False
        return bool(node.find(class_="time") and self._content_node(node))

    def _content_node(self, node: Tag) -> Tag | None:
        content = node.find(class_=lambda value: value and "content" in str(value).lower())
        return content if isinstance(content, Tag) else None

    def _extract_id(self, node: Tag) -> str | None:
        for attr in ("data-memo-id", "data-slug", "data-id", "id"):
            value = node.get(attr)
            if value:
                return str(value).strip()
        for link in node.find_all("a", href=True):
            href = str(link["href"])
            match = re.search(r"/memo/([^/?#]+)", href)
            if match:
                return match.group(1)
        return None

    def _extract_dates(self, node: Tag, text: str, fallback: datetime) -> tuple[datetime, datetime | None]:
        dates: list[datetime] = []
        for time_node in node.find_all("time"):
            for attr in ("datetime", "title"):
                self._append_date(dates, parse_datetime(time_node.get(attr)))
            self._append_date(dates, parse_datetime(time_node.get_text(" ", strip=True)))
        for time_node in node.find_all(class_=lambda value: value and "time" in str(value).lower()):
            self._append_date(dates, parse_datetime(time_node.get_text(" ", strip=True)))
        for attr in ("data-created-at", "data-created", "data-updated-at", "data-updated"):
            self._append_date(dates, parse_datetime(node.get(attr)))
        for parsed in extract_datetimes(text):
            self._append_date(dates, parsed)
        if not dates:
            return fallback, None
        return dates[0], dates[1] if len(dates) > 1 else None

    def _append_date(self, dates: list[datetime], parsed: datetime | None) -> None:
        if not parsed:
            return
        if parsed in dates:
            return
        if parsed.hour == parsed.minute == parsed.second == 0:
            if any(existing.date() == parsed.date() for existing in dates):
                return
        for index, existing in enumerate(dates):
            if existing.date() == parsed.date() and existing.hour == existing.minute == existing.second == 0:
                dates[index] = parsed
                return
        dates.append(parsed)

    def _extract_tags(self, node: Tag, text: str) -> list[str]:
        tags: list[str] = []
        for tag_node in node.find_all(class_=lambda value: value and "tag" in str(value).lower()):
            value = tag_node.get_text(" ", strip=True).lstrip("#")
            if value and value not in tags:
                tags.append(value)
        for match in TAG_PATTERN.finditer(text):
            value = match.group(1).strip("/")
            if value and value not in tags:
                tags.append(value)
        return tags

    def _zip_datetime(self, archive: zipfile.ZipFile, name: str) -> datetime:
        info = archive.getinfo(name)
        return datetime(*info.date_time)


def _dedupe_memos(memos: list[Memo]) -> list[Memo]:
    seen: set[str] = set()
    output: list[Memo] = []
    for memo in memos:
        if memo.id in seen:
            continue
        seen.add(memo.id)
        output.append(memo)
    return output
