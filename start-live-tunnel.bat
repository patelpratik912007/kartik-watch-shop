@echo off
title Kartik Watch Shop — Instant Live Public Tunnel
echo ========================================================
echo    Kartik Watch Shop — Instant Public Live Sharing
echo ========================================================
echo.
echo This tool makes your local Kartik Watch Shop website LIVE
echo on the internet with a public HTTPS link in seconds!
echo.
echo [1/2] Checking if local server is running on port 5000...
curl -s http://127.0.0.1:5000/api/health >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [INFO] Starting local boutique server first...
    start /b "" cmd /c "%~dp0start-server.bat"
    timeout /t 3 /nobreak >nul
)

echo [2/2] Generating public live HTTPS link...
echo.
echo ========================================================
echo Share the URL below with anyone or open it on your phone:
echo ========================================================
echo.

npx -y localtunnel --port 5000
pause
