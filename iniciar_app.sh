#!/usr/bin/env bash

# Estandarizador de Promociones BGCPR - Lanzador Universal
# Este script inicia la aplicación y la abre automáticamente en el navegador.

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

# Asegurar que PATH incluya rutas comunes de Node.js en macOS y Linux
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.npm-global/bin:$HOME/.local/bin:$PATH"

PORT=5173
URL="http://localhost:$PORT"

echo "=========================================================="
echo "  Iniciando Estandarizador de Promociones (BGCPR)"
echo "=========================================================="
echo ""

# Función para abrir el navegador en Mac, Windows o Linux
open_browser() {
  sleep 1.2
  if [[ "$OSTYPE" == "darwin"* ]]; then
    open "$URL"
  elif [[ "$OSTYPE" == "cygwin" || "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    start "$URL"
  elif command -v xdg-open > /dev/null 2>&1; then
    xdg-open "$URL"
  fi
}

# 1. Verificar si ya hay un servidor corriendo en el puerto 5173 o 4173
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo "La aplicación ya está activa en http://localhost:5173"
  echo "Abriendo en tu navegador..."
  URL="http://localhost:5173"
  open_browser &
  exit 0
elif lsof -Pi :4173 -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo "La aplicación ya está activa en http://localhost:4173"
  echo "Abriendo en tu navegador..."
  URL="http://localhost:4173"
  open_browser &
  exit 0
fi

# 2. Intentar con Node.js (Vite Dev Server)
if command -v node > /dev/null 2>&1 && command -v npm > /dev/null 2>&1; then
  echo "[✓] Node.js detectado ($(node -v))."

  # Si falta node_modules, instalar dependencias
  if [ ! -d "node_modules" ]; then
    echo "Instalando paquetes requeridos por primera vez (esto toma unos segundos)..."
    npm install
  fi

  echo "Abriendo la aplicación en tu navegador web..."
  open_browser &
  
  # Ejecutar Vite
  npm run dev -- --host 127.0.0.1 --port $PORT

# 3. Intentar con Python 3 (servir carpeta dist precompilada sin requerir Node)
elif command -v python3 > /dev/null 2>&1; then
  echo "[i] Node.js no encontrado. Usando servidor integrado de Python 3..."
  PORT=4173
  URL="http://localhost:$PORT"

  if [ ! -d "dist" ]; then
    echo "Compilando carpeta de distribución..."
  fi

  echo "Abriendo la aplicación en tu navegador web..."
  open_browser &
  python3 -m http.server $PORT --directory dist

else
  echo "[!] Error: No se encontró Node.js ni Python 3 en esta computadora."
  echo "Por favor contacta al departamento técnico o instala Node.js desde https://nodejs.org"
  read -p "Presiona Enter para cerrar..."
  exit 1
fi
