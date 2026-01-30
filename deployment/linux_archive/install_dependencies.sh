#!/bin/bash

# Script de instalación de dependencias para Coontrasures
# S.O. soportados: Ubuntu 20.04+, Debian 10+
# Ejecutar con sudo

if [ "$EUID" -ne 0 ]; then 
  echo "Por favor, ejecute este script como root (sudo ./install_dependencies.sh)"
  exit
fi

echo "--- Iniciando instalación de dependencias ---"

# 1. Actualizar repositorios
echo "[1/6] Actualizando lista de paquetes..."
apt-get update && apt-get upgrade -y

# 2. Instalar herramientas básicas del sistema
echo "[2/6] Instalando curl, git, ufw, build-essential..."
apt-get install -y curl wget git ufw build-essential libssl-dev

# 3. Instalar Node.js (Versión 18.x LTS o 20.x LTS)
# Usando NodeSource
echo "[3/6] Instalando Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Verificar instalación de node y npm
node -v
npm -v

# 4. Instalar PostgreSQL
echo "[4/6] Instalando PostgreSQL..."
apt-get install -y postgresql postgresql-contrib

# Iniciar servicio si no está corriendo
systemctl start postgresql
systemctl enable postgresql

# 5. Instalar Nginx
echo "[5/6] Instalando Nginx..."
apt-get install -y nginx

# 6. Instalar Certbot (para SSL)
echo "[6/6] Instalando Certbot..."
apt-get install -y certbot python3-certbot-nginx

# 7. Instalar PM2 globalmente
echo "[7/7] Instalando PM2 (Process Manager)..."
npm install -g pm2

echo "--- Instalación de dependencias completada exitosamente ---"
echo "Siguiente paso: Configurar la base de datos y la aplicación."
