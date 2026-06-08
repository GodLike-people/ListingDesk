@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

set PYTHON_EXE=.venv\Scripts\python.exe
if not exist "%PYTHON_EXE%" set PYTHON_EXE=python
set PLAYWRIGHT_BROWSERS_PATH=%CD%\.ms-playwright

echo Starting Flomo2Obsidian web console...
echo Open http://127.0.0.1:8765 in your browser.
"%PYTHON_EXE%" -m flomo_obsidian.web
pause
