@echo off
setlocal enabledelayedexpansion

REM 設定顏色
color 0A

REM 設定路徑變數
set BACKEND_DIR=C:\BausensLaw\MyMomentum\backend\mymomentum
set FRONTEND_DIR=C:\BausensLaw\MyMomentum\frontend
set DOCKER_DESKTOP_PATH="C:\Program Files\Docker\Docker\Docker Desktop.exe"

echo ========================================
echo MyMomentum Development Environment
echo Smart Startup (Check Running Services)
echo ========================================
echo.

REM 檢查Docker Desktop是否運行
echo [1/6] Checking Docker Desktop...
tasklist /FI "IMAGENAME eq Docker Desktop.exe" 2>NUL | find /I /N "Docker Desktop.exe" >NUL
if %errorlevel%==0 (
    echo [INFO] Docker Desktop is already running
) else (
    echo [INFO] Starting Docker Desktop...
    start "" %DOCKER_DESKTOP_PATH%
    timeout /t 10 /nobreak >nul
)

REM 檢查PostgreSQL容器
echo [2/6] Checking PostgreSQL container...
docker ps --filter "name=mymomentum-postgres" --filter "status=running" --format "{{.Names}}" | findstr "mymomentum-postgres" >nul
if %errorlevel%==0 (
    echo [INFO] PostgreSQL container is already running
) else (
    echo [INFO] Starting PostgreSQL container...
    docker start mymomentum-postgres >nul 2>&1
    if %errorlevel% neq 0 (
        echo [WARNING] Failed to start PostgreSQL container
    ) else (
        echo [SUCCESS] PostgreSQL container started
    )
)

REM 檢查後端端口
echo [3/6] Checking Backend port (8080)...
netstat -an | findstr ":8080" >nul
if %errorlevel%==0 (
    echo [WARNING] Port 8080 is already in use - Backend may already be running
    echo [INFO] Skipping backend startup
    set START_BACKEND=false
) else (
    echo [INFO] Port 8080 is available - Starting backend
    set START_BACKEND=true
)

REM 檢查前端端口
echo [4/6] Checking Frontend port (3000)...
netstat -an | findstr ":3000" >nul
if %errorlevel%==0 (
    echo [WARNING] Port 3000 is already in use - Frontend may already be running
    echo [INFO] Skipping frontend startup
    set START_FRONTEND=false
) else (
    echo [INFO] Port 3000 is available - Starting frontend
    set START_FRONTEND=true
)

REM 檢查前端目錄
if not exist "%FRONTEND_DIR%" (
    echo [WARNING] Frontend directory not found: %FRONTEND_DIR%
    set START_FRONTEND=false
)

REM 啟動後端（如果需要）
if "%START_BACKEND%"=="true" (
    echo [5/6] Starting Backend Server...
    start "MyMomentum Backend" cmd /k "cd /d %BACKEND_DIR% && echo Starting Backend Server... && mvn spring-boot:run -Dspring.profiles.active=local"
    echo [SUCCESS] Backend startup initiated
) else (
    echo [5/6] Backend already running - Skipped
)

REM 等待後端啟動
if "%START_BACKEND%"=="true" (
    echo [INFO] Waiting for backend to initialize...
    timeout /t 15 /nobreak >nul
)

REM 啟動前端（如果需要）
if "%START_FRONTEND%"=="true" (
    echo [6/6] Starting Frontend Server...
    start "MyMomentum Frontend" cmd /k "cd /d %FRONTEND_DIR% && echo Starting Frontend Server... && npm start"
    echo [SUCCESS] Frontend startup initiated
) else (
    echo [6/6] Frontend already running - Skipped
)

echo.
echo ========================================
echo [SUCCESS] Smart startup completed
echo ========================================
echo Docker Desktop: Running
echo PostgreSQL: Running
if "%START_BACKEND%"=="true" (
    echo Backend: Starting (http://localhost:8080)
) else (
    echo Backend: Already running (http://localhost:8080)
)
if "%START_FRONTEND%"=="true" (
    echo Frontend: Starting (http://localhost:3000)
) else (
    echo Frontend: Already running (http://localhost:3000)
)
echo ========================================
echo.
echo Press any key to close this window...
pause >nul
exit /b 0
