# Script de Configuración del Firewall para Windows Server
# Requiere permisos de Administrador

Write-Host "--- Configurando Firewall de Windows ---" -ForegroundColor Cyan

# Función para verificar si una regla existe
function Rule-Exists ($RuleName) {
    if (Get-NetFirewallRule -DisplayName $RuleName -ErrorAction SilentlyContinue) {
        return $true
    }
    return $false
}

# 1. Permitir HTTP (Puerto 80)
if (-not (Rule-Exists "Coontrasures-HTTP")) {
    Write-Host "Creando regla: Permitir Puerto 80 (HTTP)..."
    New-NetFirewallRule -DisplayName "Coontrasures-HTTP" -Direction Inbound -LocalPort 80 -Protocol TCP -Action Allow
} else {
    Write-Host "Regla 'Coontrasures-HTTP' ya existe." -ForegroundColor Yellow
}

# 2. Permitir HTTPS (Puerto 443)
if (-not (Rule-Exists "Coontrasures-HTTPS")) {
    Write-Host "Creando regla: Permitir Puerto 443 (HTTPS)..."
    New-NetFirewallRule -DisplayName "Coontrasures-HTTPS" -Direction Inbound -LocalPort 443 -Protocol TCP -Action Allow
} else {
    Write-Host "Regla 'Coontrasures-HTTPS' ya existe." -ForegroundColor Yellow
}

# 3. Bloquear Puerto 3000 (Node.js API) desde fuera
#    Esto es para obligar a pasar por IIS/Nginx.
if (-not (Rule-Exists "Coontrasures-BlockNode")) {
    Write-Host "Creando regla: Bloquear acceso directo a Node.js (Puerto 3000 desde fuera)..."
    New-NetFirewallRule -DisplayName "Coontrasures-BlockNode" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Block
    
    # Permitir localhost (loopback) explícitamente si se usa IIS como proxy local
    # New-NetFirewallRule -DisplayName "Allow-Localhost-Node" -Direction Inbound -LocalAddress "127.0.0.1" -LocalPort 3000 -Protocol TCP -Action Allow
} else {
    Write-Host "Regla 'Coontrasures-BlockNode' ya existe." -ForegroundColor Yellow
}

Write-Host "--- Configuración de Firewall completada ---" -ForegroundColor Green
Write-Host "El puerto 80 y 443 están abiertos. El puerto 3000 está bloqueado desde el exterior."
