@echo off
echo Starting MyMomentum Development Environment...

REM 啟動Docker Desktop
echo Starting Docker Desktop...
start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"

REM 等待Docker啟動
echo Waiting for Docker to start...
timeout /t 15 /nobreak >nul

REM 啟動PostgreSQL容器
echo Starting PostgreSQL container...
docker start mymomentum-postgres

REM 等待資料庫啟動
timeout /t 5 /nobreak >nul

REM 啟動後端
echo Starting Backend...
start "Backend" cmd /k "cd /d C:\BausensLaw\MyMomentum\backend\mymomentum && mvn spring-boot:run -Dspring.profiles.active=local"

REM 等待後端啟動
timeout /t 10 /nobreak >nul

REM 啟動前端
echo Starting Frontend...
start "Frontend" cmd /k "cd /d C:\BausensLaw\MyMomentum\frontend && npm start"

echo.
echo All services are starting...
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo.
pause
