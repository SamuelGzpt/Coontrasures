# Script de Instalación de Dependencias para Windows Server
# Requiere PowerShell v5.1+ y Acceso de Administrador

Write-Host "--- Iniciando Instalación de Dependencias para Coontrasures ---" -ForegroundColor Cyan

# Función para comprobar si un comando existe
function Test-Command ($command) {
    if (Get-Command $command -ErrorAction SilentlyContinue) {
        return $true
    }
    return $false
}

# 1. Verificar Winget (Windows Package Manager)
if (-not (Test-Command "winget")) {
    Write-Host "ADVERTENCIA: Winget no encontrado. Winget viene preinstalado en Windows Server 2022 y versiones recientes de Win10/11." -ForegroundColor Yellow
    Write-Host "Recomendación: Descargue e instale 'App Installer' desde la Microsoft Store o GitHub." -ForegroundColor Yellow
    Write-Host "Enlace: https://github.com/microsoft/winget-cli/releases" -ForegroundColor Blue
    Write-Host "Continuando con la verificación manual..." -ForegroundColor White
} else {
    Write-Host "Winget detectado. Procediendo con la instalación automatizada..." -ForegroundColor Green
    
    # 2. Instalar Node.js LTS
    Write-Host "Instalando Node.js LTS..."
    winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements

    # 3. Instalar Git
    Write-Host "Instalando Git..."
    winget install Git.Git --silent --accept-package-agreements --accept-source-agreements

    # 4. Instalar PostgreSQL (Opcional si ya tienes DB)
    Write-Host "Instalando PostgreSQL..."
    winget install PostgreSQL.PostgreSQL --silent --accept-package-agreements --accept-source-agreements
}

# 5. Instalar PM2 (Process Manager) globalmente
if (Test-Command "npm") {
    Write-Host "Instalando PM2 globalmente..." -ForegroundColor Cyan
    npm install -g pm2 pm2-windows-startup pm2-service-install
    
    # Configurar arranque automático
    Write-Host "Configurando PM2 para iniciar con Windows..."
    pm2-service-install -n PM2
} else {
    Write-Host "ERROR: npm no se encontró en el PATH. Reinicia la terminal después de instalar Node.js y vuelve a ejecutar este script." -ForegroundColor Red
}

Write-Host "--- Proceso Terminado ---" -ForegroundColor Green
Write-Host "Siguiente paso: Configurar la base de datos y ejecutar 'start_app.bat'."
Write-Host "Nota: Si instalaste PostgreSQL, recuerda configurar la contraseña del usuario 'postgres' durante la instalación o primer inicio."
