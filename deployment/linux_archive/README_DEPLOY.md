# Guía de Despliegue - Coontrasures

Esta carpeta contiene todos los scripts y configuraciones necesarios para desplgar la aplicación "Coontrasures" en un servidor Linux (recomendado: **Ubuntu 20.04 LTS** o superior).

## Contenido

1.  **`install_dependencies.sh`**: Instala Node.js, PostgreSQL, Nginx y otras herramientas del sistema.
2.  **`setup_security.sh`**: Configura el firewall (UFW) y herramientas de seguridad básica.
3.  **`setup_app.sh`**: Construye la aplicación frontend, configura el backend y lo arranca con PM2.
4.  **`nginx_app.conf`**: Plantilla de configuración para el servidor web Nginx.

## Requisitos Previos

- Un servidor VPS o dedicado con **Ubuntu 20.04/22.04**.
- Acceso **root** o un usuario con permisos `sudo`.
- Un dominio apuntando a la IP de tu servidor (ej: `cootransures.com`).

## Pasos de Instalación

Sigue estos pasos en orden una vez estés conectado a tu servidor.

### 1. Preparar los archivos

Sube esta carpeta `deployment` y todo el código del proyecto al servidor (puedes usar `scp`, FileZilla, o `git clone` si subes el repo a GitHub/GitLab).

Una vez subido, entra en la carpeta:

```bash
cd ~/Coontrasures/deployment
chmod +x *.sh
```

### 2. Instalar Dependencias del Sistema

Ejecuta el script de instalación. Te pedirá tu contraseña y puede tardar unos minutos.

```bash
sudo ./install_dependencies.sh
```

### 3. Configurar la Base de Datos

El script anterior instaló PostgreSQL. Ahora necesitas crear la base de datos y el usuario.

Cámbiate al usuario `postgres`:
```bash
sudo -u postgres psql
```

Dentro de la consola de postgres, ejecuta (cambia 'tu_password_segura' por una real):

```sql
CREATE DATABASE cootransures_db;
CREATE USER admin_cootransures WITH ENCRYPTED PASSWORD 'tu_password_segura';
GRANT ALL PRIVILEGES ON DATABASE cootransures_db TO admin_cootransures;
\q
```

### 4. Configurar la Aplicación (Variables de Entorno)

Crea el archivo `.env` del servidor con tus credenciales reales:

```bash
cd ../server
cp .env.example .env
nano .env
```
*Asegúrate de poner los datos correctos de la DB y el puerto (por defecto 3000).*
*Ejemplo:*
```
PORT=3000
DB_HOST=localhost
DB_USER=admin_cootransures
DB_PASSWORD=tu_password_segura
DB_NAME=cootransures_db
JWT_SECRET=una_clave_secreta_muy_larga
```

Regresa a la carpeta deployment:
```bash
cd ../deployment
```

### 5. Configurar e Iniciar la Aplicación

Este script instalará las librerías de Node.js, compilará el frontend y arrancará el servidor con PM2.

```bash
./setup_app.sh
```

### 6. Configurar Nginx (Servidor Web)

Edita el archivo de configuración `nginx_app.conf` y reemplaza `TU_DOMINIO.COM` con tu dominio real.

```bash
nano nginx_app.conf
```
*(Cambia `server_name TU_DOMINIO.COM www.TU_DOMINIO.COM;` por tu dominio)*

Luego copia y activa la configuración:

```bash
sudo cp nginx_app.conf /etc/nginx/sites-available/coontrasures
sudo ln -s /etc/nginx/sites-available/coontrasures /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # (Opcional: elimina la configuración por defecto)
sudo nginx -t
sudo systemctl restart nginx
```

### 7. Configurar SSL (HTTPS)

Para tener el candadito verde seguro:

```bash
sudo certbot --nginx -d tu_dominio.com -d www.tu_dominio.com
```

### 8. Configurar Seguridad (Firewall)

Finalmente, bloquea los puertos no deseados:

```bash
sudo ./setup_security.sh
```

---

## Mantenimiento

- **Ver logs del servidor**: `pm2 logs`
- **Reiniciar servidor**: `pm2 restart all`
- **Ver estado**: `pm2 status`
