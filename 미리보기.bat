@echo off
rem LEVEL 0 site preview - double click this file.
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0preview-server.ps1"
if errorlevel 1 pause
