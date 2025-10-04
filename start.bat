@echo off
echo Starting LocalStore E-commerce Application...
echo.

echo Installing dependencies...
echo.

echo Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Installing frontend dependencies...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo Seeding database with sample products...
cd ..\backend
call npm run seed
if errorlevel 1 (
    echo Warning: Failed to seed database. Make sure MongoDB is running.
)

echo.
echo Starting servers...
echo Backend will run on http://localhost:5000
echo Frontend will run on http://localhost:3000
echo.

start "Backend Server" cmd /k "cd /d %~dp0backend && npm run dev"
timeout /t 3 /nobreak > nul
start "Frontend Server" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both servers are starting...
echo Check the opened terminal windows for status.
echo.
pause
