@echo off
setlocal
cd /d "%~dp0"
title Medical Terminology - Install matching male and female recordings
where powershell.exe >nul 2>nul
if errorlevel 1 (echo PowerShell missing. & pause & exit /b 1)
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0INSTALL_CORRECTED_VOICES_WINDOWS.ps1"
if errorlevel 1 (echo Some recordings could not download. Run this again to resume. & pause & exit /b 1)
echo SUCCESS: The updated recordings have been installed.
pause
