@echo off
title Push SkinAI Mobile to GitHub
echo ========================================================
echo Pushing SkinAI Mobile App to your GitHub
echo ========================================================
echo.

set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/Shameerburney/skin-ai-mobile.git): "

if "%REPO_URL%"=="" (
    echo No URL entered. Aborting.
    pause
    exit /b
)

cd /d "%~dp0"
git branch -M main
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git push -u origin main

echo.
echo ========================================================
echo Done! Check your GitHub repository.
echo ========================================================
pause
