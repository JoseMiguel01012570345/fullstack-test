# Mantenimiento de Clientes - React JS

Aplicación web desarrollada en React JS para el mantenimiento de clientes de una institución. Permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre los clientes del sistema.

## 🚀 Características

- **Autenticación**: Sistema de login y registro de usuarios
- **Gestión de Clientes**: CRUD completo para clientes
- **Búsqueda y Filtros**: Búsqueda de clientes por identificación y nombre
- **Interfaz Responsive**: Diseño adaptable a diferentes tamaños de pantalla
- **Material Design**: Interfaz basada en Material UI con tema ejecutivo

## 📋 Requisitos Previos

- Node.js (versión 14 o superior)
- npm (Node Package Manager)

## 🛠️ Instalación

1. Clonar o descargar el repositorio
2. Instalar las dependencias:

```bash
npm install
```

## ▶️ Ejecutar la Aplicación

Para iniciar el servidor de desarrollo:

```bash
npm run start
```

La aplicación se abrirá automáticamente en [http://localhost:3000](http://localhost:3000)

## 📦 Scripts Disponibles

- `npm run start` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run test` - Ejecuta las pruebas
- `npm run eject` - Expone la configuración de Create React App (irreversible)

## 🏗️ Estructura del Proyecto

```
src/
├── api/
│   └── client.js          # Configuración de Axios y endpoints API
├── components/
│   ├── Layout.js          # Componente de layout con sidebar y toolbar
│   └── ProtectedRoute.js  # Componente para rutas protegidas
├── context/
│   └── AuthContext.js     # Context API para manejo de autenticación
├── pages/
│   ├── Login.js           # Página de inicio de sesión
│   ├── Register.js        # Página de registro
│   ├── Home.js            # Página principal
│   ├── ConsultaClientes.js # Listado y búsqueda de clientes
│   ├── MantenimientoCliente.js # Formulario crear/editar cliente
│   └── ErrorPage.js        # Página de error 404
├── App.js                 # Componente principal con rutas
├── index.js               # Punto de entrada de la aplicación
└── theme.js               # Configuración del tema Material UI
```

## 🔌 API Endpoints

La aplicación consume la siguiente API base:
- **Base URL**: `https://pruebarectjs.test-class.com/Api/`
- **Swagger**: `https://pruebarectjs.test-class.com/Api/swagger/index.html`

### Endpoints Utilizados:

- `POST /api/Authenticate/login` - Iniciar sesión
- `POST /api/Authenticate/register` - Registrar usuario
- `POST /api/Cliente/Listado` - Listar clientes (con filtros)
- `GET /api/Cliente/Obtener/{IdCliente}` - Obtener detalle de cliente
- `POST /api/Cliente/Crear` - Crear nuevo cliente
- `POST /api/Cliente/Actualizar` - Actualizar cliente existente
- `DELETE /api/Cliente/Eliminar/{IdCliente}` - Eliminar cliente
- `GET /api/Intereses/Listado` - Listar intereses disponibles

## 🎨 Tecnologías Utilizadas

- **React 17.0.2** - Biblioteca de JavaScript para construir interfaces
- **React Router DOM 5.3.4** - Enrutamiento de la aplicación
- **Material UI 5.16.0** - Biblioteca de componentes React
- **Axios 1.6.0** - Cliente HTTP para peticiones API
- **Context API** - Manejo de estado global (autenticación)

## 📱 Funcionalidades Principales

### Autenticación
- Login con validación de campos requeridos
- Registro con validación de email y contraseña (8-20 caracteres, mayúsculas, minúsculas y números)
- Opción "Recuérdame" para guardar el nombre de usuario
- Manejo de tokens JWT para sesiones

### Gestión de Clientes
- **Crear**: Formulario completo con todos los campos del cliente
- **Listar**: Tabla con información básica de clientes
- **Buscar**: Filtros por identificación y nombre
- **Editar**: Cargar datos existentes y actualizar
- **Eliminar**: Confirmación antes de eliminar
- **Campos del Cliente**:
  - Nombre, Apellidos, Identificación
  - Teléfono Celular, Otro Teléfono
  - Dirección
  - Fecha de Nacimiento, Fecha de Afiliación
  - Sexo (Masculino/Femenino)
  - Reseña Personal
  - Imagen (opcional, base64)
  - Intereses (lista desplegable)

## 🔐 Seguridad

- Rutas protegidas que requieren autenticación
- Tokens JWT almacenados en localStorage
- Interceptores de Axios para agregar tokens automáticamente
- Redirección automática al login si el token expira

## 📝 Notas Importantes

- Todos los campos del cliente son obligatorios excepto la imagen
- Las imágenes se manejan en formato base64
- Los mensajes de éxito/error se muestran mediante Snackbar de Material UI
- La aplicación es un SPA (Single Page Application)

## 👤 Autor

Desarrollado como prueba técnica para Innovasoft S.A.

## 📄 Licencia

Este proyecto es privado y está destinado únicamente para fines de evaluación técnica.
