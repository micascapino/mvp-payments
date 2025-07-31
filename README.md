# MVP Payments Challenge - Transaction Management API

Este proyecto es una API REST construida con NestJS para la gestión de transferencias.

## 🚀 Tecnologías Utilizadas

- **NestJS**: Framework Node.js para construir aplicaciones del lado del servidor
- **TypeORM**: ORM para la gestión de base de datos
- **PostgreSQL**: Base de datos relacional
- **JWT**: JSON Web Tokens para autenticación
- **Swagger**: Documentación de la API

## 📋 Prerrequisitos

- Node.js
- npm o yarn
- PostgreSQL

## 🔧 Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/micascapino/mvp-payments.git
cd mvp-payments
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
DATABASE_URL=
PORT=3000
JWT_SECRET=your-secret-key
```
Los valores de dichas variables fueron compartidas por HackerRank

4. Iniciar el servidor:
```bash
npm run start
```

## 📚 Documentación de la API

La documentación completa de la API está disponible a través de Swagger UI en:
```
http://localhost:3000/api
```

### Endpoints Principales

#### Autenticación
- `POST /auth/register`: Registrar un nuevo cliente
- `POST /auth/token`: Autenticación y obtención de token JWT

#### Cuentas
- `POST /accounts`: Creación de cuentas (solo disponible para admin)
- `GET /accounts/me`: Obtener datos de mi cuenta

#### Transacciones
- `GET /transactions/me`: Obtener transacciones de mi usuario
- `POST /transactions`: Crear una nueva transacción

## 📦 Estructura del Proyecto

```
src/
├── app.module.ts
├── core/
│   ├── config/
│   ├── entities/
│   ├── repositories/
│   └── security/
│       ├── decorators/
│       ├── guards/
│       └── strategies/
├── database/
│   └── migrations/
├── modules/
│   ├── accounts/
│   │   ├── getMyAccount/
│   │   └── newAccount/
│   ├── auth/
│   │   ├── registerClient/
│   │   └── validateToken/
│   └── transactions/
│       ├── getMyTransactions/
│       └── newTransaction/
├── services/
├── shared/
│   ├── errors/
│   ├── models/
│   └── services/
└── main.ts
```
