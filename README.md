# Munisig GIS Mono-Repo

> [!NOTE]
> 🇪🇸 **Español**: Si quieres leer este documento en español, [haz click aquí](#versión-en-español).

This project is a Geographic Information System (GIS) composed of a NestJS backend (with PostGIS) and a React frontend (Vite).

## Prerequisites

-   **Node.js** (v18 or higher)
-   **Docker** and **Docker Compose** (for PostgreSQL + PostGIS database)

## Initial Setup

1.  **Clone/Navigate to the repository**:
    Make sure you are in the root folder `munisig-mono-repo`.

2.  **Start the Database**:
    The project uses Docker to spin up PostgreSQL with spatial extensions.
    ```bash
    docker-compose up -d
    ```
    *This will start a Postgres container on port 5432.*

3.  **Install Dependencies**:
    Run these commands from the root to install libraries for both projects:
    ```bash
    # Backend
    cd backend
    npm install
    
    # Frontend
    cd ../frontend
    npm install
    ```

## Running the Application

For development, you will need two open terminals:

### 1. Backend (API)
In the `backend` folder:
```bash
npm run start:dev
```
*   The API will be available at: `http://localhost:3000`
*   Swagger/OpenAPI (if configured): `http://localhost:3000/api`

### 2. Frontend (App)
In the `frontend` folder:
```bash
npm run dev
```
*   The application will open at: `http://localhost:5173`

## Load Test Data (Seed)

The project includes a script to create an admin user and test data.
**Ensure the Backend is running** before executing it.

In a new terminal, from the `backend` folder:
```bash
node seed.js
```
This will create:
*   User: `admin` / `password123`
*   A test territory (Central Park).

## Running Tests

### Backend (NestJS)
The backend has unit tests and e2e (end-to-end) tests configured.
From the `backend` folder:

*   **Unit Tests**:
    ```bash
    npm run test
    ```
*   **E2E Tests**:
    ```bash
    npm run test:e2e
    ```
*   **Coverage**:
    ```bash
    npm run test:cov
    ```

### Frontend (React)
Currently, the frontend does not have a test runner (like Vitest or Jest) configured by default.
However, you can run the linter to check code quality:

*   **Linting**:
    From the `frontend` folder:
    ```bash
    npm run lint
    ```

## Project Structure

*   `/backend` - REST API with NestJS, TypeORM, and GIS support.
*   `/frontend` - React application with Leaflet for maps.
*   `docker-compose.yml` - Service definitions (Database).

---

# Versión en Español

# Munisig GIS Mono-Repo

Este proyecto es un Sistema de Información Geográfica (GIS) compuesto por un backend en NestJS (con PostGIS) y un frontend en React (Vite).

## Requisitos Previos

-   **Node.js** (v18 o superior)
-   **Docker** y **Docker Compose** (para la base de datos PostgreSQL + PostGIS)

## Configuración Inicial

1.  **Clonar/Ubicarse en el repositorio**:
    Asegúrate de estar en la carpeta raíz `munisig-mono-repo`.

2.  **Iniciar la Base de Datos**:
    El proyecto usa Docker para levantar PostgreSQL con extensiones espaciales.
    ```bash
    docker-compose up -d
    ```
    *Esto levantará un contenedor con Postgres en el puerto 5432.*

3.  **Instalar Dependencias**:
    Ejecuta estos comandos desde la raíz para instalar las librerías de ambos proyectos:
    ```bash
    # Backend
    cd backend
    npm install
    
    # Frontend
    cd ../frontend
    npm install
    ```

## Ejecutar la Aplicación

Para desarrollar, necesitarás dos terminales abiertas:

### 1. Backend (API)
En la carpeta `backend`:
```bash
npm run start:dev
```
*   La API estará disponible en: `http://localhost:3000`
*   Swagger/OpenAPI (si está configurado): `http://localhost:3000/api`

### 2. Frontend (App)
En la carpeta `frontend`:
```bash
npm run dev
```
*   La aplicación abrirá en: `http://localhost:5173`

## Cargar Datos de Prueba (Seed)

El proyecto incluye un script para crear un usuario administrador y datos de prueba.
**Asegúrate de que el Backend esté corriendo** antes de ejecutarlo.

En una nueva terminal, desde la carpeta `backend`:
```bash
node seed.js
```
Esto creará:
*   Usuario: `admin` / `password123`
*   Un territorio de prueba (Central Park).

## Ejecutar Tests

### Backend (NestJS)
El backend tiene configurados tests unitarios y tests e2e (end-to-end).
Desde la carpeta `backend`:

*   **Tests Unitarios**:
    ```bash
    npm run test
    ```
*   **Tests E2E**:
    ```bash
    npm run test:e2e
    ```
*   **Coverage (Cobertura)**:
    ```bash
    npm run test:cov
    ```

### Frontend (React)
Actualmente el frontend no tiene un runner de tests (como Vitest o Jest) configurado por defecto.
Sin embargo, puedes ejecutar el linter para revisar la calidad del código:

*   **Linting**:
    Desde la carpeta `frontend`:
    ```bash
    npm run lint
    ```

## Estructura del Proyecto

*   `/backend` - API REST con NestJS, TypeORM y soporte GIS.
*   `/frontend` - Aplicación React con Leaflet para mapas.
*   `docker-compose.yml` - Definición de servicios (Base de datos).
