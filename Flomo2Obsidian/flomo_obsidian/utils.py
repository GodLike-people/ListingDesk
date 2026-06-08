from __future__ import annotations

import hashlib
import mimetypes
import posixpath
import re
from datetime import datetime
from pathlib import Path
from urllib.parse import unquote, urlparse


INVALID_FILENAME_CHARS = r'<>:"/\|?*'
DATE_PATTERNS = [
    re.compile(r"(?P<y>\d{4})[-/.](?P<m>\d{1,2})[-/.](?P<d>\d{1,2})[ T](?P<h>\d{1,2}):(?P<mi>\d{1,2})(?::(?P<s>\d{1,2}))?"),
    re.compile(r"(?P<y>\d{4})年(?P<m>\d{1,2})月(?P<d>\d{1,2})日\s*(?P<h>\d{1,2}):(?P<mi>\d{1,2})(?::(?P<s>\d{1,2}))?"),
    re.compile(r"(?P<y>\d{4})[-/.](?P<m>\d{1,2})[-/.](?P<d>\d{1,2})"),
    re.compile(r"(?P<y>\d{4})年(?P<m>\d{1,2})月(?P<d>\d{1,2})日"),
]


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256_text(text: str) -> str:
    return sha256_bytes(text.encode("utf-8"))


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as file:
        for chunk in iter(lambda: file.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def safe_filename(value: str, max_length: int = 60) -> str:
    cleaned = value.strip()
    for char in INVALID_FILENAME_CHARS:
        cleaned = cleaned.replace(char, "-")
    cleaned = re.sub(r"\s+", "-", cleaned)
    cleaned = re.sub(r"-{2,}", "-", cleaned).strip(".- ")
    if not cleaned:
        cleaned = "memo"
    reserved = {"CON", "PRN", "AUX", "NUL", "COM1", "COM2", "COM3", "LPT1", "LPT2", "LPT3"}
    if cleaned.upper() in reserved:
        cleaned = f"{cleaned}-memo"
    return cleaned[:max_length].rstrip(".- ") or "memo"


def short_title(text: str, fallback: str) -> str:
    for line in text.splitlines():
        line = re.sub(r"#([\w\-/\u4e00-\u9fff]+)", "", line).strip()
        line = re.sub(r"\s+", " ", line)
        if line:
            return line[:60]
    return fallback


def parse_datetime(value: str | None) -> datetime | None:
    if not value:
        return None
    raw = value.strip()
    for parser in (datetime.fromisoformat,):
        try:
            return parser(raw.replace("Z", "+00:00")).replace(tzinfo=None)
        except ValueError:
            pass
    for pattern in DATE_PATTERNS:
        match = pattern.search(raw)
        if not match:
            continue
        parts = {key: int(val) for key, val in match.groupdict(default="0").items()}
        return datetime(
            parts["y"],
            parts["m"],
            parts["d"],
            parts.get("h") or 0,
            parts.get("mi") or 0,
            parts.get("s") or 0,
        )
    return None


def extract_datetimes(text: str) -> list[datetime]:
    values: list[datetime] = []
    for pattern in DATE_PATTERNS:
        for match in pattern.finditer(text):
            parsed = parse_datetime(match.group(0))
            if parsed and parsed not in values:
                values.append(parsed)
    return values


def relative_markdown_path(target: Path, start_dir: Path) -> str:
    import os

    return Path(os.path.relpath(target, start_dir)).as_posix()


def strip_url_noise(src: str) -> str:
    parsed = urlparse(src)
    if parsed.scheme in {"http", "https", "data"}:
        return src
    path = parsed.path or src
    return unquote(path).replace("\\", "/")


def possible_zip_asset_paths(source_path: str, src: str) -> list[str]:
    cleaned = strip_url_noise(src).lstrip("/")
    if cleaned.startswith(("http://", "https://", "data:")):
        return []
    source_dir = posixpath.dirname(source_path)
    candidates = [
        posixpath.normpath(posixpath.join(source_dir, cleaned)),
        posixpath.normpath(cleaned),
        posixpath.basename(cleaned),
    ]
    deduped: list[str] = []
    for candidate in candidates:
        if candidate and candidate not in deduped:
            deduped.append(candidate)
    return deduped


def extension_for_asset(name: str, content_type: str | None = None) -> str:
    suffix = Path(urlparse(name).path).suffix.lower()
    if suffix:
        return suffix
    if content_type:
        guessed = mimetypes.guess_extension(content_type)
        if guessed:
            return guessed
    return ".bin"


def unique_path(path: Path) -> Path:
    if not path.exists():
        return path
    stem = path.stem
    suffix = path.suffix
    parent = path.parent
    index = 2
    while True:
        candidate = parent / f"{stem}-{index}{suffix}"
        if not candidate.exists():
            return candidate
        index += 1
