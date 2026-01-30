# Guía de Despliegue en Windows Server - Coontrasures

Esta guía explica cómo configurar el servidor Windows para ejecutar la aplicación Coontrasures.

Oficialmente soportamos **Windows Server 2019/2022**.

## 1. Requisitos Previos

Antes de ejecutar cualquier script, asegúrate de tener instalado:
- **PowerShell 5.1** o superior (viene instalado por defecto).
- **Acceso de Administrador** al servidor.

## 2. Instalación de Software Base

Hemos preparado un script de PowerShell para automatizar la descarga e instalación de Node.js, Git y PostgreSQL usando `winget` (el gestor de paquetes de Windows).

1. Abre PowerShell como Administrador.
2. Navega a la carpeta `deployment`.
3. Ejecuta:
   ```powershell
   Set-ExecutionPolicy RemoteSigned -Scope Process
   .\install_dependencies.ps1
   ```

*Nota: Si `winget` no está disponible en tu versión de Windows Server, el script te dará los enlaces para descargar los instaladores manualmente.*

## 3. Configuración de Base de Datos (PostgreSQL)

1. Abre **pgAdmin** o la herramienta SQL que prefieras (instalada con Postgres).
2. Conéctate al servidor local (`localhost`).
3. Crea la base de datos y usuario:
   ```sql
   CREATE DATABASE cootransures_db;
   CREATE USER admin_cootransures WITH PASSWORD 'tu_password_segura';
   GRANT ALL PRIVILEGES ON DATABASE cootransures_db TO admin_cootransures;
   ```
4. Ejecuta el archivo SQL de inicialización ubicado en `server/db/init.sql`.

## 4. Configurar la Aplicación

1. Ve a la carpeta `server` del proyecto.
2. Copia `.env.example` a `.env` y edítalo con tus datos de conexión a la base de datos.
3. Ejecuta el script de inicio para instalar dependencias y compilar:
   ```cmd
   cd deployment
   start_app.bat
   ```
   **Este script:**
   - Instala las dependencias (`npm install`).
   - Compila el frontend (`npm run build`).
   - Inicia el servidor backend usando PM2 para que corra en segundo plano siempre.

## 5. Exponer al Público (Reverse Proxy con IIS)

La forma recomendada de publicar Node.js en Windows Server es usar **IIS** como Proxy Inverso.

1. **Instalar IIS**:
   - Abrir "Server Manager" > "Add Roles and Features".
   - Seleccionar "Web Server (IIS)".
   - Asegurarse de instalar **WebSocket Protocol** (en Application Development).

2. **Instalar URL Rewrite Module y Application Request Routing (ARR)**:
   - Descarga e instala [URL Rewrite Module 2.1](https://www.iis.net/downloads/microsoft/url-rewrite).
   - Descarga e instala [Application Request Routing 3.0](https://www.iis.net/downloads/microsoft/application-request-routing).
   - **IMPORTANTE**: Después de instalar ARR, abre IIS Manager, haz clic en el nombre del servidor, ve a "Application Request Routing Cache" > "Server Proxy Settings" (a la derecha) > marca "Enable proxy".

3. **Crear el Sitio Web**:
   - En IIS Manager, crea un nuevo sitio (Add Website).
   - Nombre: `Coontrasures`.
   - Ruta física: La carpeta `C:\ruta\a\Coontrasures\server`.
   - Binding: http en puerto 80.
   - Hostname: `tu-dominio.com`.

4. **Configurar web.config**:
   - Hemos incluido un archivo `web.config` en la carpeta `deployment`.
   - Copia este archivo `web.config` a la carpeta raíz del sitio en IIS (`C:\ruta\a\Coontrasures\server`).
   - Este archivo le dice a IIS que todas las peticiones deben ser enviadas a `http://localhost:3000` (donde corre tu Node.js).
   
## 6. Seguridad (Firewall y HTTPS)

1. **Abrir Puertos**:
   Ejecuta el script de firewall para permitir tráfico Web y bloquear el puerto directo de Node (3000) desde fuera:
   ```powershell
   .\setup_firewall.ps1
   ```

2. **Certificado SSL (HTTPS)**:
   - Descarga [win-acme](https://www.win-acme.com/). es la versión de "Certbot" para Windows.
   - Ejecuta `wacs.exe`.
   - Presiona `N` (Create new certificate).
   - Selecciona el sitio web que creaste en IIS.
   - Sigue los pasos y él automáticamente configurará HTTPS y la renovación automática.

---

## Comandos Útiles

- **Ver logs**: `pm2 logs`
- **Reiniciar App**: `pm2 restart coontrasures-api`
- **Estado**: `pm2 status`
