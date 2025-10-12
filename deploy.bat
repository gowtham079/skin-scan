@echo off
REM Skin Scan Deployment Script for Windows
REM This script helps deploy the Skin Scan application to various platforms

echo 🏥 Skin Scan Deployment Script
echo ================================

REM Function to deploy with Docker
:deploy_docker
echo 🐳 Deploying with Docker...
docker build -t skin-scan .
docker run -d -p 5000:5000 --name skin-scan-app skin-scan
echo ✅ Docker deployment completed!
echo Your app is running at: http://localhost:5000
goto :end

REM Function to show Render instructions
:deploy_render
echo 🎨 Render Deployment Instructions:
echo.
echo To deploy to Render:
echo 1. Go to https://render.com
echo 2. Connect your GitHub repository
echo 3. Create a new Web Service
echo 4. Use these settings:
echo    - Build Command: pip install -r requirements.txt
echo    - Start Command: gunicorn app:app
echo    - Environment: Python 3
echo 5. Add environment variables from env.example
echo 6. Deploy!
echo.
echo ✅ Render deployment instructions provided!
goto :end

REM Function to show Railway instructions
:deploy_railway
echo 🚂 Railway Deployment Instructions:
echo.
echo To deploy to Railway:
echo 1. Go to https://railway.app
echo 2. Connect your GitHub repository
echo 3. Create a new project
echo 4. Add environment variables from env.example
echo 5. Deploy!
echo.
echo ✅ Railway deployment instructions provided!
goto :end

REM Main menu
:menu
echo.
echo Select deployment option:
echo 1) Railway (Recommended - Free tier available)
echo 2) Render (Free tier available)
echo 3) Docker (Local deployment)
echo 4) Exit
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto deploy_railway
if "%choice%"=="2" goto deploy_render
if "%choice%"=="3" goto deploy_docker
if "%choice%"=="4" goto :end
echo Invalid option. Please try again.
goto menu

:end
echo.
echo Goodbye! 👋
pause

