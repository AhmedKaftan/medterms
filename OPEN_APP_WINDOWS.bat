@echo off
setlocal
if not exist "%~dp0index.html" (
  echo index.html was not found. Extract the whole ZIP first.
  pause
  exit /b 1
)
start "" "%~dp0index.html"
