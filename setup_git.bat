@echo off
echo 🚀 Skin Scan - Git Setup Script
echo ================================
echo.

echo Step 1: Checking if Git is installed...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed!
    echo.
    echo Please install Git first:
    echo 1. Go to https://git-scm.com/download/win
    echo 2. Download and install Git
    echo 3. Restart this script after installation
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Git is installed!
    git --version
)

echo.
echo Step 2: Initializing Git repository...
git init

echo.
echo Step 3: Adding all files to Git...
git add .

echo.
echo Step 4: Creating initial commit...
git commit -m "Initial commit - Skin Scan AI application"

echo.
echo ✅ Git repository initialized successfully!
echo.
echo Next steps:
echo 1. Create a GitHub account at https://github.com
echo 2. Create a new repository on GitHub
echo 3. Copy the repository URL
echo 4. Run the following commands:
echo    git remote add origin YOUR_REPOSITORY_URL
echo    git push -u origin main
echo.
echo For detailed instructions, see SETUP_GUIDE.md
echo.
pause

