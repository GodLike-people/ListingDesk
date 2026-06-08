@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

echo [Flomo2Obsidian] Creating Python virtual environment...
python -m venv .venv
if errorlevel 1 goto failed

call ".venv\Scripts\activate.bat"
set PLAYWRIGHT_BROWSERS_PATH=%CD%\.ms-playwright

echo [Flomo2Obsidian] Installing dependencies...
python -m pip install --upgrade pip
if errorlevel 1 goto failed
python -m pip install -r requirements.txt
if errorlevel 1 goto failed

echo [Flomo2Obsidian] Installing Playwright Chromium browser...
python -m playwright install chromium
if errorlevel 1 goto failed

echo.
echo Done. You can now double-click 同步Flomo到Obsidian.bat.
pause
exit /b 0

:failed
echo.
echo Installation failed. Please check the error above.
pause
exit /b 1
