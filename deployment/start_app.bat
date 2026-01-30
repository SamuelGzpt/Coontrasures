@echo off
REM Script de arranque rápido para Windows Server
REM Asegúrate de haber instalado Node.js y Git primero con install_dependencies.ps1

echo --- Iniciando Setup de Coontrasures ---

REM 1. Configurar Frontend
cd ..
echo [1/4] Instalando dependencias del Frontend...
call npm install

echo [2/4] Construyendo Frontend (Vite Build)...
call npm run build

if exist "dist" (
    echo [OK] Carpeta 'dist' creada correctamente.
) else (
    echo [ERROR] La carpeta 'dist' no se creo. Revisa errores de compilacion.
    pause
    exit /b 1
)

REM 2. Configurar Backend
cd server
echo [3/4] Instalando dependencias del Servidor...
call npm install

if not exist ".env" (
    echo [ADVERTENCIA] No existe el archivo .env. Creando uno desde .env.example...
    copy .env.example .env
    echo [ALEER] RECUERDA EDITAR EL ARCHIVO .env CON TUS CREDENCIALES DE DB ANTES DE CONTINUAR.
    timeout /t 5
)

REM 3. Arrancar PM2
echo [4/4] Arrancando Servidor con PM2...

REM Verificar si PM2 esta instalado
call pm2 -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] PM2 no esta instalado. Ejecuta 'npm install -g pm2' primero.
    pause
    exit /b 1
)

call pm2 delete coontrasures-api 2>nul
call pm2 start index.js --name "coontrasures-api"

echo --- SETUP COMPLETADO ---
echo Estado de PM2:
call pm2 status
echo Usa 'pm2 logs' para ver logs en tiempo real.
pause
