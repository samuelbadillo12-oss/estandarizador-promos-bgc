@echo off
title Estandarizador de Promociones BGCPR
cd /d "%~dp0"

echo ==========================================================
echo   Iniciando Estandarizador de Promociones (BGCPR)
echo ==========================================================
echo.

where node >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] Node.js detectado.
    if not exist node_modules (
        echo Instalando dependencias necesarias por primera vez...
        call npm install
    )
    echo Abriendo la aplicacion en tu navegador...
    start http://localhost:5173
    call npm run dev -- --host 127.0.0.1 --port 5173
) else (
    where python >nul 2>nul
    if %errorlevel% equ 0 (
        echo [INFO] Node.js no encontrado. Usando servidor integrado de Python...
        start http://localhost:4173
        python -m http.server 4173 --directory dist
    ) else (
        echo [ERROR] No se encontro Node.js ni Python en esta computadora.
        echo Por favor instala Node.js gratis desde https://nodejs.org
        echo o solicita asistencia al departamento tecnico.
        pause
    )
)

