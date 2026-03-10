# Guía de Despliegue: Coontrasures en Windows Server 2016

Esta guía detalla el proceso paso a paso para desplegar la aplicación **Coontrasures** (Frontend en React, Backend en Node.js, Base de datos PostgreSQL) en un entorno de producción usando **IIS (Internet Information Services)** en Windows Server 2016.

---

## 🛑 CHECKLIST RÁPIDO: QUÉ DESCARGAR E INSTALAR PRIMERO
*(Haz esto apenas abras AnyDesk en tu servidor virgen)*

- [ ] **Node.js (LTS):** Descargar desde [nodejs.org](https://nodejs.org).
- [ ] **PostgreSQL (v15 o superior):** Descargar el instalador para Windows desde [postgresql.org](https://www.postgresql.org/download/windows/).
- [ ] **pgAdmin 4 o DBeaver:** (Suele venir con PostgreSQL) Para ver la base de datos visualmente.
- [ ] **Git para Windows:** Descargar desde [git-scm.com](https://git-scm.com/download/win).
- [ ] **IIS (Internet Information Services):** Este ya viene en Windows Server, solo hay que activarlo (explicado abajo).
- [ ] **IIS URL Rewrite Module 2.1:** Descargar desde [Microsoft](https://www.iis.net/downloads/microsoft/url-rewrite).

---

## FASE 1: Preparativos y Software Necesario (Vía AnyDesk)

Antes de mover los archivos, instala las siguientes herramientas en tu Windows Server 2016:

1. **PostgreSQL (v15 o superior):**
   - Descarga el instalador de Windows desde la página oficial.
   - Durante la instalación, te pedirá una contraseña para el superusuario `postgres`. **Anótala y guárdala**.
   - Se recomienda instalar la herramienta **pgAdmin 4** (suele venir incluida) para manejar la base de datos visualmente.
2. **Node.js (Versión LTS):**
   - Descarga e instala la versión recomendada (LTS) desde `nodejs.org`. Esto instalará Node y `npm`.
3. **Git para Windows:**
   - Descarga e instala Git desde `git-scm.com` para clonar tu repositorio fácilmente.
4. **IIS URL Rewrite Module 2.1:**
   - Descárgalo desde la página oficial de Microsoft. Es fundamental para que el archivo `web.config` funcione correctamente y redirija la API y el Frontend.

---

## FASE 2: Configuración de la Base de Datos (PostgreSQL)

1. Abre **pgAdmin 4** en tu servidor.
2. Conéctate ingresando la contraseña del usuario `postgres` que creaste en la Fase 1.
3. Haz clic derecho en "Databases" -> "Create" -> "Database...".
4. Nombra la base de datos como: **`cootransures_db`**.
5. Ejecuta tus scripts SQL para crear las tablas necesarias de tu proyecto dentro de esta base de datos.

---

## FASE 3: Llevar el Código y Configurar el Backend (Node.js)

1. Abre **PowerShell** y crea una carpeta para tu web, por ejemplo en la unidad C:
   ```powershell
   cd C:\
   mkdir SitiosWeb
   cd SitiosWeb
   ```
2. Clona tu proyecto:
   ```powershell
   git clone https://tu-repo/coontrasures.git
   ```
3. Entra a la carpeta del servidor e instala las dependencias de Node:
   ```powershell
   cd C:\SitiosWeb\coontrasures\server
   npm install
   ```
4. **Crea el archivo `.env`:**
   Asegúrate de tener un archivo `.env` en `C:\SitiosWeb\coontrasures\server\.env` con tus credenciales:
   ```env
   DB_USER=postgres
   DB_PASSWORD=TU_CONTRASEÑA_DE_POSTGRES
   DB_HOST=localhost
   DB_NAME=cootransures_db
   DB_PORT=5432
   ```
5. **Instalar PM2 para mantener vivo el backend 24/7:**
   ```powershell
   npm install -g pm2
   npm install -g pm2-windows-startup
   pm2-startup install
   ```
6. **Encender el backend:**
   Asumiendo que el archivo de arranque es `index.js` o `server.js`:
   ```powershell
   pm2 start index.js --name "Coontrasures-API"
   pm2 save
   ```

---

## FASE 4: Compilar el Frontend (React)

El frontend no se ejecuta en Node.js en producción, se debe compilar en archivos estáticos (HTML, CSS, JS) para que IIS los sirva a máxima velocidad.

1. En PowerShell, ve a la carpeta raíz de tu proyecto:
   ```powershell
   cd C:\SitiosWeb\coontrasures
   npm install
   npm run build
   ```
2. Al terminar, se creará una carpeta llamada **`dist`** o **`build`**. Esa carpeta contiene tu página final.

---

## FASE 5: Activar y Configurar IIS

### Paso A: Activar IIS en Windows Server
1. Abre **Server Manager**.
2. Ve a **Add roles and features**.
3. Avanza hasta **Server Roles** y marca **"Web Server (IIS)"**. Instálalo.

### Paso B: Configurar la carpeta y el `web.config`
1. Ve a la carpeta `deployment` de tu proyecto (`C:\SitiosWeb\coontrasures\deployment`).
2. Copia el archivo **`web.config`**.
3. Pégalo **dentro** de tu carpeta compilada del frontend (`C:\SitiosWeb\coontrasures\dist` o la carpeta `build`).

### Paso C: Crear el sitio en IIS
1. Abre el programa **Internet Information Services (IIS) Manager**.
2. En el panel izquierdo, despliega tu servidor de Windows, haz clic derecho en **Sites** -> **Add Website...**
3. Llena los datos:
   - **Site name:** `Coontrasures`
   - **Physical path:** Selecciona tu carpeta compilada (`C:\SitiosWeb\coontrasures\dist`).
   - **Binding:** Deja el puerto 80 por ahora (luego puedes agregar el puerto 443 con tu certificado SSL).
4. Dale a **OK**.

### Paso D: Dar permisos de carpeta a IIS
1. Ve con el explorador de archivos a tu carpeta compilada (`C:\SitiosWeb\coontrasures\dist`).
2. Clic derecho -> **Propiedades** -> Pestaña **Seguridad** -> **Editar** -> **Agregar**.
3. Escribe **`IIS_IUSRS`** y presiona OK.
4. Asegúrate de marcar la casilla "Permitir" para "Lectura y ejecución". Acepta todo.

---

## FASE 6: Reglas de Firewall

Para que el servidor sea accesible desde el exterior (Internet):

1. Abre el menú inicio y busca **Windows Defender Firewall with Advanced Security**.
2. En el panel izquierdo clic en **Inbound Rules** (Reglas de entrada).
3. En el panel derecho clic en **New Rule...** (Nueva regla).
4. Elige **Port** (Puerto) -> Next.
5. Elige **TCP** y en *Specific local ports* escribe: `80, 443` -> Next.
6. Elige **Allow the connection** -> Next hasta llegar al Nombre.
7. Nómbralo como **"Puertos IIS Web"** y finaliza.

---

✅ **¡Felicidades! Tu aplicación Coontrasures ya está en línea.**
Todas las peticiones a la API o subida de imágenes serán manejadas inteligentemente por tu archivo `web.config` redirigiendo el tráfico hacia tu backend de Node.js mediante el proxy inverso configurado.

## Mantenimiento a futuro

Cuando realices actualizaciones en tu computadora y quieras subirlas al servidor:
1. Conéctate por AnyDesk al servidor.
2. Abre PowerShell y ve a la carpeta del proyecto.
3. `git pull origin main` (para descargar los cambios).
4. `npm run build` (para actualizar el frontend visual).
5. `pm2 restart Coontrasures-API` (para reiniciar el backend y aplicar los cambios del servidor).
