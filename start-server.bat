@echo off
title Kartik Watch Shop — Luxury Horology Boutique
echo ========================================================
echo    Kartik Watch Shop — Luxury Horology Boutique
echo    Python Flask Backend Server
echo ========================================================
echo.

:: Check if Python is available
where python >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Python not found in system PATH!
    echo Please install Python 3.10+ from https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation.
    pause
    exit /b 1
)

:: Ensure .env file exists (copy template if missing)
if not exist "%~dp0.env" (
    if exist "%~dp0.env.example" (
        echo [INFO] Creating .env from .env.example template...
        copy "%~dp0.env.example" "%~dp0.env" >nul
    )
)

:: Setup database (auto MySQL + SQLite fallback)
echo [INFO] Verifying database tables and 31 timepieces catalog...
python "%~dp0backend\setup_db.py"
echo.

:: Start server (Python will automatically open your browser when ready)
echo [INFO] Starting Flask server...
echo ========================================================
echo    Boutique:  http://localhost:5000/
echo    API Base:  http://localhost:5000/api/
echo    Products:  http://localhost:5000/api/products
echo    Health:    http://localhost:5000/api/health
echo ========================================================
echo.
echo Server is launching. Your browser will open automatically once ready!
echo Press Ctrl+C in this window to stop the server anytime.
echo.

python "%~dp0backend\app.py"
pause
