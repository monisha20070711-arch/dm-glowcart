@echo off
echo ===================================================
echo   DM-GLOWCART — Full-Stack E-Commerce Launcher
echo   Tagline: Everyday Essentials, Made Better
echo ===================================================
echo.

echo [1/3] Checking Backend Dependencies...
cd backend
if not exist "node_modules\" (
    echo Installing backend npm packages...
    call npm install
)

echo Seeding MongoDB Database with 50+ Products...
call node seed.js
echo.

echo [2/3] Starting Backend Server on Port 5000...
start cmd /k "title DM-GLOWCART Backend && npm run dev"
echo Backend started in separate window.
echo.

echo [3/3] Checking Frontend Dependencies...
cd ..\frontend
if not exist "node_modules\" (
    echo Installing frontend npm packages (Vite, React, Tailwind)...
    call npm install
)

echo Starting Frontend Server on Port 3000...
start cmd /k "title DM-GLOWCART Frontend && npm run dev"
echo Frontend started in separate window.
echo.

echo ===================================================
echo DM-GLOWCART is running!
echo Open your browser at: http://localhost:3000
echo Admin Login: admin@glowcart.com / Admin@123
echo User Login:  user@glowcart.com / User@123
echo ===================================================
pause
