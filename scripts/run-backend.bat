@echo off
title JARVIS Backend
color 0A
cd /d "%~dp0..\backend"

echo.
echo  ========================================
echo   JARVIS Backend
echo   http://localhost:8000
echo   Docs: http://localhost:8000/docs
echo  ========================================
echo.

REM Use venvJs if you created it, otherwise venv
if exist "venvJs\Scripts\activate.bat" (
    call venvJs\Scripts\activate.bat
) else if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
) else (
    echo [ERROR] No Python venv found.
    echo Create one:  python -m venv venvJs
    echo Then:        pip install -r requirements.txt
    echo.
    pause
    exit /b 1
)

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
if errorlevel 1 (
    echo.
    echo [ERROR] Backend crashed. Read the message above.
    echo Common fix: docker compose up -d postgres
    echo.
)
pause
