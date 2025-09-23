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
echo Starting All Services...
echo ========================================
echo.

REM 檢查必要工具
echo [1/6] Checking prerequisites...

REM 檢查Docker Desktop
if not exist %DOCKER_DESKTOP_PATH% (
    echo [ERROR] Docker Desktop not found at: %DOCKER_DESKTOP_PATH%
    echo Please update the DOCKER_DESKTOP_PATH in this script
    goto :error
)

REM 檢查Maven
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Maven is not installed or not in PATH
    goto :error
)

REM 檢查Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    goto :error
)

REM 檢查專案目錄
if not exist "%BACKEND_DIR%" (
    echo [ERROR] Backend directory not found: %BACKEND_DIR%
    goto :error
)

if not exist "%FRONTEND_DIR%" (
    echo [WARNING] Frontend directory not found: %FRONTEND_DIR%
    echo [INFO] Will skip frontend startup
    set START_FRONTEND=false
) else (
    set START_FRONTEND=true
)

echo [SUCCESS] All prerequisites checked
echo.

REM 啟動Docker Desktop
echo [2/6] Starting Docker Desktop...
start "" %DOCKER_DESKTOP_PATH%
echo [INFO] Docker Desktop is starting...
timeout /t 10 /nobreak >nul

REM 等待Docker Desktop完全啟動
echo [3/6] Waiting for Docker Desktop to be ready...
:wait_docker
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Waiting for Docker Desktop to start...
    timeout /t 5 /nobreak >nul
    goto :wait_docker
)
echo [SUCCESS] Docker Desktop is ready

REM 啟動PostgreSQL容器
echo [4/6] Starting PostgreSQL container...
docker start mymomentum-postgres >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Container 'mymomentum-postgres' not found or failed to start
    echo [INFO] You may need to create the container first
) else (
    echo [SUCCESS] PostgreSQL container started
)

REM 等待資料庫啟動
echo [INFO] Waiting for database to be ready...
timeout /t 5 /nobreak >nul

REM 啟動後端
echo [5/6] Starting Backend Server...
start "MyMomentum Backend" cmd /k "cd /d %BACKEND_DIR% && echo Starting Backend Server... && mvn spring-boot:run -Dspring.profiles.active=local"

REM 等待後端啟動
echo [INFO] Waiting for backend to initialize...
timeout /t 15 /nobreak >nul

REM 啟動前端
if "%START_FRONTEND%"=="true" (
    echo [6/6] Starting Frontend Server...
    start "MyMomentum Frontend" cmd /k "cd /d %FRONTEND_DIR% && echo Starting Frontend Server... && npm start"
    echo.
    echo ========================================
    echo [SUCCESS] All services are starting...
    echo ========================================
    echo Docker Desktop: Running
    echo PostgreSQL: Running (mymomentum-postgres)
    echo Backend: http://localhost:8080
    echo Frontend: http://localhost:3000
    echo ========================================
) else (
    echo.
    echo ========================================
    echo [SUCCESS] Backend services are starting...
    echo ========================================
    echo Docker Desktop: Running
    echo PostgreSQL: Running (mymomentum-postgres)
    echo Backend: http://localhost:8080
    echo Frontend: Skipped (directory not found)
    echo ========================================
)

echo.
echo Press any key to close this window...
pause >nul
exit /b 0

:error
echo.
echo ========================================
echo Setup failed. Please check the errors above.
echo ========================================
echo.
echo Common solutions:
echo 1. Install Docker Desktop
echo 2. Install Maven and add to PATH
echo 3. Install Node.js and add to PATH
echo 4. Check directory paths in this script
echo ========================================
pause
exit /b 1
