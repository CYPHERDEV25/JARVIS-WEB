@echo off
if /i "%~1"=="_silent" shift
title Fix JARVIS PostgreSQL Permissions
cd /d "%~dp0.."

echo.
echo  Fixing PostgreSQL public schema permissions...
echo.

docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running. Start Docker Desktop first.
    pause
    exit /b 1
)

docker compose up -d postgres
timeout /t 5 /nobreak >nul

docker exec jarvis_postgres psql -U jarvis -d jarvis -c "ALTER SCHEMA public OWNER TO jarvis;"
docker exec jarvis_postgres psql -U jarvis -d jarvis -c "GRANT ALL ON SCHEMA public TO jarvis;"
docker exec jarvis_postgres psql -U jarvis -d jarvis -c "GRANT CREATE ON SCHEMA public TO jarvis;"
docker exec jarvis_postgres psql -U jarvis -d jarvis -c "GRANT ALL ON SCHEMA public TO PUBLIC;"
docker exec jarvis_postgres psql -U jarvis -d jarvis -c "GRANT CREATE ON SCHEMA public TO PUBLIC;"

if errorlevel 1 (
    echo.
    echo [WARN] Fix failed. Reset database with:
    echo   docker compose down -v
    echo   docker compose up -d postgres
    echo   Then run this script again.
    pause
    exit /b 1
)

echo.
echo [OK] PostgreSQL permissions fixed.
echo     Restart the backend: scripts\run-backend.bat
echo.
if /i not "%~1"=="_silent" pause
