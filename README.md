# GymApp - Sistema de Gestión de Socios y Pagos

GymApp es una aplicación web full-stack diseñada para optimizar la administración de socios, el control de estados de membresía (activos/inactivos) y el registro histórico de pagos en gimnasios o clubes.

## 🚀 Arquitectura del Proyecto

El sistema está desarrollado bajo una arquitectura desacoplada, separando la lógica del servidor de la interfaz de usuario, y utilizando tipado estricto con TypeScript para garantizar la robustez del código.

```text
GymApp/
├── backend/            # Servidor REST API (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── controllers/# Lógica de control (Autenticación, Socios, Pagos)
│   │   ├── middleware/ # Validación de JWT y seguridad
│   │   ├── models/     # Modelos de datos de Mongoose (MongoDB)
│   │   └── routes/     # Enrutadores de la API
└── frontend/           # Interfaz de Usuario (React + Vite + TypeScript)
    └── src/
        ├── components/ # Componentes visuales modulares y reutilizables
        ├── services/   # Clientes de API centralizados (Axios)
        └── utils/      # Funciones de utilidad (Cálculo de fechas y formatos)
```
## 🛠️ Tecnologías Utilizadas
Backend
Node.js & Express con TypeScript.

MongoDB junto a Mongoose como ODM para el modelado de datos.

JSON Web Tokens (JWT) para la autenticación segura de usuarios.

BcryptJS para el hash y resguardo de contraseñas.

Frontend
React 18 (Vite) con TypeScript.

Tailwind CSS para un diseño de interfaz responsivo, limpio y moderno.

Axios para la gestión centralizada de peticiones HTTP.

## 💻 Configuración e Instalación
Prerrequisitos
Tener instalado Node.js (versión v18 o superior recomendada).

Una instancia de MongoDB (local o en MongoDB Atlas).

### 1. Clonar el repositorio
   
git clone [https://github.com/tu-usuario/GymApp.git](https://github.com/tu-usuario/GymApp.git)
cd GymApp
3. Configurar el Backend
Navegá a la carpeta del servidor:

### 2. Configurar el backend
Navegá a la carpeta del servidor:
cd backend

Instalá las dependencias:
npm install

Creá un archivo .env en la raíz de la carpeta backend y configurá las siguientes variables de entorno:

Fragmento de código
PORT=5000
MONGO_URI=tu_conexion_a_mongodb
JWT_SECRET=tu_clave_secreta_super_segura
Iniciá el servidor en modo desarrollo:

Iniciá el servidor en modo desarrollo:
npm run dev

### 3. Configurar el Frontend
Abrí una nueva terminal y navegá a la carpeta del cliente:
cd ../frontend

Instalá las dependencias:
npm install

Iniciá el entorno local de Vite:
npm run dev

Abrí tu navegador en http://localhost:5173.

## 📌 Funcionalidades Clave
Autenticación Protegida: Login seguro de administradores mediante persistencia de Tokens JWT.

Dashboard de Métricas: Panel superior interactivo con cálculo automático de Socios Totales, Activos, Inactivos y Porcentaje de Actividad en tiempo real.

CRUD Completo de Socios: Registro, modificación, listado y eliminación de miembros con validación de datos.

Control Inteligente de Períodos: El sistema evalúa de forma automatizada las fechas de pago para determinar si el socio se encuentra al día o con la cuota vencida (mostrando alertas visuales cromáticas).

Historial de Pagos: Registro modularizado de aportes con desglose detallado de montos y meses de cobertura aplicados.
