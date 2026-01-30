#!/bin/bash

# Script de configuración de seguridad para Coontrasures
# S.O. soportados: Ubuntu 20.04+, Debian 10+
# Ejecutar con sudo

if [ "$EUID" -ne 0 ]; then
  echo "Por favor, ejecute este script como root (sudo ./setup_security.sh)"
  exit
fi

echo "--- Iniciando configuración básica de seguridad ---"

# 1. Configurar UFW (Firewall)
echo "[1/3] Configurando Firewall..."
ufw default deny incoming
ufw default allow outgoing

# IMPORTANTE: Permitir SSH (puerto 22)
echo "Permitiendo acceso SSH (puerto 22)..."
ufw allow ssh

# Permitir HTTP y HTTPS
echo "Permitiendo acceso HTTP (80) y HTTPS (443)..."
ufw allow 'Nginx Full'

# Activar firewall
echo "Activando UFW..."
ufw --force enable

# Ver estado
ufw status verbose

# 2. Configurar Fail2Ban para SSH (opcional, recomendado para evitar ataques de fuerza bruta)
echo "[2/3] Instalando y configurando Fail2Ban..."
apt-get install -y fail2ban

# Copiar configuración por defecto para personalización local
cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Reiniciar servicio para aplicar cambios
systemctl restart fail2ban
systemctl enable fail2ban

# 3. Recomendaciones finales
echo "[3/3] Configuración de seguridad completada."
echo "IMPORTANTE: Asegúrate de probar el acceso SSH en una nueva terminal antes de cerrar la sesión actual para verificar que no te hayas bloqueado accidentalmente."
