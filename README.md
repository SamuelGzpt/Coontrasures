# COONTRASURES

Plataforma web oficial para la Cooperativa de Transportadores Cootransures. Este proyecto consiste en una aplicación web moderna (React) y un servidor backend (Node.js) para la gestión de información, servicios y reportes de la cooperativa.

## 🚀 Características

- **Landing Page Interactiva**: Diseño moderno con animaciones suaves utilizando GSAP.
- **Gestión de Servicios**: Visualización de servicios de transporte (Empresarial, Turístico, Escolar).
- **Noticias**: Sección de novedades y actualizaciones.
- **Panel Administrativo**: Login seguro para administradores.
- **Carga de Reportes**: Sistema seguro para subir archivos PDF de reportes (balance social, estados financieros, etc.).
- **Backend API**: Servidor Express con conexión a base de datos PostgreSQL.

## 🛠️ Tecnologías Utilizadas

### Frontend (Cliente)
- **React 19**: Biblioteca de interfaz de usuario.
- **TypeScript**: Tipado estático para mayor robustez.
- **Vite**: Entorno de desarrollo y build tool rápido.
- **GSAP**: Animaciones avanzadas.
- **CSS Modules / Variables**: Estilizado personalizado.
- **React Router**: Navegación SPA.

### Backend (Servidor)
- **Node.js & Express**: API RESTful.
- **PostgreSQL**: Base de datos relacional.
- **Multer**: Manejo de subida de archivos.
- **Helmet & Rate Limit**: Seguridad básica.

## 📋 Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu sistema:
- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- [PostgreSQL](https://www.postgresql.org/)

## 📦 Instalación

Puedes usar el script automático o instalar manualmente.

### Opción 1: Instalación Automática (Windows)
Ejecuta el archivo `install_dependencies.bat` haciendo doble clic o desde la terminal. Instalará las dependencias tanto del cliente como del servidor.

### Opción 2: Instalación Manual

1. **Clonar el repositorio**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd Coontrasures
   ```

2. **Instalar dependencias del Cliente**
   ```bash
   npm install
   ```

3. **Instalar dependencias del Servidor**
   ```bash
   cd server
   npm install
   cd ..
   ```

## ⚙️ Configuración (Backend)

El servidor requiere variables de entorno para conectar con la base de datos y configurar la seguridad.

1. Ve a la carpeta `server`.
2. Crea una copia del archivo `.env.example` y renómbralo a `.env`.
3. Edita el archivo `.env` con tus credenciales de PostgreSQL:

   ```env
   PORT=3000
   ADMIN_PASSWORD=admin123  # Contraseña para subir reportes
   DB_USER=postgres         # Tu usuario de Postgres
   DB_PASSWORD=tu_password  # Tu contraseña de Postgres
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=cootransures_db
   ```

4. Asegúrate de crear la base de datos `cootransures_db` en tu PostgreSQL antes de iniciar el servidor.

## ▶️ Ejecución

Para ejecutar el proyecto, necesitarás dos terminales (una para el frontend y otra para el backend).

### Terminal 1: Servidor Backend
```bash
cd server
node index.js
```
_El servidor correrá en http://localhost:3000_

### Terminal 2: Cliente Frontend
```bash
npm run dev
```
_La aplicación web correrá en http://localhost:5173 (o el puerto que indique Vite)_

## 📂 Estructura del Proyecto

```
Coontrasures/
├── public/              # Archivos estáticos
├── src/                 # Código fuente del Frontend
│   ├── components/      # Componentes React reutilizables
│   ├── pages/           # Páginas principales
│   ├── styles/          # Estilos globales
│   └── main.tsx         # Punto de entrada
├── server/              # Código del Backend
│   ├── db/              # Configuración de base de datos
│   ├── uploads/         # Carpeta donde se guardan los reportes
│   └── index.js         # Archivo principal del servidor
├── package.json         # Dependencias del Frontend
└── README.md            # Documentación
```

## 📄 Licencia

Este proyecto es para uso exclusivo de Cootransures.
