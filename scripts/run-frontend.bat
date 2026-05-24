@echo off
title JARVIS Frontend
color 0B
cd /d "%~dp0..\frontend"

echo.
echo  ========================================
echo   JARVIS Website
echo   http://localhost:3000
echo  ========================================
echo.

if not exist "node_modules" (
    echo [INFO] Installing npm packages first...
    call npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
)

call npm run dev
if errorlevel 1 (
    echo.
    echo [ERROR] Frontend crashed. Read the message above.
    echo.
)
pause
