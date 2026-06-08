from __future__ import annotations

import os
import time
from datetime import datetime
from pathlib import Path

from .config import Config


class FlomoDownloadError(RuntimeError):
    pass


class FlomoDownloader:
    def __init__(self, project_root: Path, config: Config) -> None:
        self.project_root = project_root
        self.config = config

    def download(self, interactive_prompt: bool = True) -> Path:
        local_browsers = self.project_root / ".ms-playwright"
        if "PLAYWRIGHT_BROWSERS_PATH" not in os.environ and local_browsers.exists():
            os.environ["PLAYWRIGHT_BROWSERS_PATH"] = str(local_browsers)

        try:
            from playwright.sync_api import TimeoutError as PlaywrightTimeoutError
            from playwright.sync_api import sync_playwright
        except ImportError as exc:
            raise FlomoDownloadError("Playwright is not installed. Run 安装依赖.bat first.") from exc

        download_dir = self.project_root / self.config.download_dir
        profile_dir = self.project_root / self.config.browser_profile_dir
        download_dir.mkdir(parents=True, exist_ok=True)
        profile_dir.mkdir(parents=True, exist_ok=True)

        timeout_ms = max(30, self.config.export_timeout_seconds) * 1000
        with sync_playwright() as playwright:
            context = playwright.chromium.launch_persistent_context(
                str(profile_dir),
                headless=False,
                accept_downloads=True,
                downloads_path=str(download_dir),
            )
            page = context.pages[0] if context.pages else context.new_page()
            page.goto(self.config.flomo_login_url, wait_until="domcontentloaded", timeout=timeout_ms)

            print("")
            print(f"Browser opened for flomo login: {self.config.flomo_login_url}")
            if interactive_prompt:
                print("If this is your first run, log in to flomo in the browser window.")
                input("After login succeeds, press Enter here...")
                self._open_export_page(page, timeout_ms)
            else:
                print("If this is your first run, log in to flomo in the browser window.")
                print("After login succeeds, I will open the export page automatically.")
                if not self._wait_for_login_then_open_export(page, timeout_ms):
                    context.close()
                    raise FlomoDownloadError("Timed out waiting for flomo login.")

            downloaded = self._try_click_export_until_download(page, timeout_ms)
            if downloaded is None:
                print("")
                print("Automatic export click did not start a download.")
                print("Please trigger flomo export/download in the browser. I will wait for the ZIP download.")
                try:
                    downloaded = page.wait_for_event("download", timeout=timeout_ms)
                except PlaywrightTimeoutError as exc:
                    context.close()
                    raise FlomoDownloadError("Timed out waiting for flomo ZIP download.") from exc

            filename = downloaded.suggested_filename or f"flomo-{datetime.now():%Y%m%d-%H%M%S}.zip"
            if not filename.lower().endswith(".zip"):
                filename = f"{Path(filename).stem}.zip"
            target = download_dir / f"{datetime.now():%Y%m%d-%H%M%S}_{filename}"
            downloaded.save_as(str(target))
            context.close()
            return target

    def _open_export_page(self, page, timeout_ms: int) -> None:
        page.goto(self.config.flomo_export_url, wait_until="domcontentloaded", timeout=timeout_ms)
        try:
            page.wait_for_load_state("networkidle", timeout=10000)
        except Exception:
            pass
        print(f"Opened flomo export page: {self.config.flomo_export_url}")

    def _wait_for_login_then_open_export(self, page, timeout_ms: int) -> bool:
        deadline = time.monotonic() + timeout_ms / 1000
        while time.monotonic() < deadline:
            current_url = page.url.lower()
            if "/login" not in current_url:
                self._open_export_page(page, timeout_ms)
                return True
            time.sleep(2)
        return False

    def _try_click_export_until_download(self, page, timeout_ms: int):
        deadline = time.monotonic() + timeout_ms / 1000
        next_log_at = 0.0
        while time.monotonic() < deadline:
            if time.monotonic() >= next_log_at:
                print(f"Looking for flomo export button on: {page.url}")
                next_log_at = time.monotonic() + 15
            downloaded = self._try_click_export(page)
            if downloaded is not None:
                return downloaded
            time.sleep(2)
        return None

    def _try_click_export(self, page):
        exact_button_labels = [
            "导出",
            "Export All",
            "Start to export",
            "Download",
            "Export",
            "开始导出",
            "下载",
            "确认",
            "确定",
        ]
        text_labels = [
            "导出所有数据（as HTML）",
            "导出所有数据",
            "Export all data (as HTML)",
            "Export all data",
            "导出全部",
            "Export data",
            "导出",
        ]
        for label in exact_button_labels:
            downloaded = self._click_label_and_expect_download(page, label, prefer_button=True)
            if downloaded is not None:
                return downloaded
        for label in text_labels:
            downloaded = self._click_label_and_expect_download(page, label, prefer_button=False)
            if downloaded is not None:
                return downloaded
        try:
            page.keyboard.press("Escape")
        except Exception:
            pass
        return None

    def _click_label_and_expect_download(self, page, label: str, prefer_button: bool):
        locators = []
        if prefer_button:
            locators.append(page.get_by_role("button", name=label, exact=False))
        locators.append(page.get_by_text(label, exact=False))
        for locator in locators:
            try:
                if locator.count() == 0:
                    continue
                target = locator.first
                with page.expect_download(timeout=3000) as download_info:
                    target.click(timeout=3000)
                return download_info.value
            except Exception:
                continue
        return None
