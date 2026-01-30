#!/bin/bash

# Script de configuración y arranque de la aplicación Coontrasures
# Ejecutar desde la carpeta deployment

echo "--- Iniciando configuración de la aplicación ---"

# Ir a la raíz del proyecto
cd ..

# 1. Configurar Frontend
echo "[1/4] Instalando dependencias del Frontend..."
npm install

echo "[2/4] Construyendo la aplicación Frontend (Vite Build)..."
npm run build

if [ -d "dist" ]; then
    echo "Build completado. Carpeta 'dist' creada correctamente."
else
    echo "Error: La carpeta 'dist' no se creó. Revisa los errores de compilación."
    exit 1
fi

# 2. Configurar Backend
echo "[3/4] Configurando Backend..."
cd server

echo "Instalando dependencias del servidor..."
npm install

# Verificar si existe el archivo .env
if [ ! -f ".env" ]; then
    echo "ADVERTENCIA: No se encontró el archivo .env en la carpeta server."
    echo "Copiando .env.example a .env (tendrás que editarlo manualmente)..."
    cp .env.example .env
fi

# 3. Arrancar con PM2
echo "[4/4] Iniciando servidor con PM2..."

# Detener proceso anterior si existe
pm2 delete coontrasures-api 2> /dev/null || true

# Iniciar proceso
pm2 start index.js --name "coontrasures-api"

# Guardar lista de procesos para reinicio automático
pm2 save
pm2 startup | tail -n 1 > /tmp/pm2_startup_cmd.sh
chmod +x /tmp/pm2_startup_cmd.sh
# Nota: La linea anterior genera el comando, pero requeriría sudo para ejecutarse.
# El usuario deberá ejecutar el comando que PM2 sugiere manualmente si quiere arranque automático.

echo "--- ¡Aplicación iniciada! ---"
echo "Estado actual de PM2:"
pm2 status

echo ""
echo "NOTA: Para que la app inicie automáticamente al reiniciar el servidor, ejecuta el comando que 'pm2 startup' te sugiera."
