# DICRI - Sistema de Control de Evidencias (Frontend)

Aplicación web desarrollada como parte de la Prueba Técnica para la posición de Analista de Sistemas 2 / Frontend Developer. Este sistema permite la gestión, trazabilidad y análisis de evidencias forenses.

## 🚀 Descripción

Este proyecto es el cliente (Frontend) de la solución Fullstack. Provee una interfaz moderna, intuitiva y responsiva para que técnicos y coordinadores gestionen expedientes, registren indicios y visualicen reportes estadísticos.

## 🛠️ Stack Tecnológico

El proyecto fue construido utilizando las mejores prácticas modernas de desarrollo web:

- **Core:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/) (Para un entorno de desarrollo ultra rápido)
- **UI Framework:** [Material UI (MUI)](https://mui.com/) v5/v6
- **Data Fetching:** [Axios](https://axios-http.com/) (Cliente HTTP configurado)
- **Gráficas:** [Recharts](https://recharts.org/) (Visualización de datos)
- **Alertas/UX:** [SweetAlert2](https://sweetalert2.github.io/)
- **Enrutamiento:** [React Router DOM](https://reactrouter.com/)
- **Infraestructura:** Docker + Nginx

## ✨ Funcionalidades Principales

1.  **Autenticación Segura:** Login con manejo de JWT y feedback visual interactivo.
2.  **Dashboard de Expedientes:** Tabla de datos avanzada (`DataGrid`) con búsqueda en servidor, paginación y estados visuales.
3.  **Gestión Maestro-Detalle:** Formulario para crear expedientes y múltiples indicios en una sola transacción visual.
4.  **Flujo de Aprobación:** Interfaz para coordinadores que permite Aprobar o Rechazar expedientes (con justificación obligatoria).
5.  **Reportes Ejecutivos:** Módulo de análisis con filtros de fecha/estado, gráficas de barras y tablas detalladas.

## 📂 Estructura del Proyecto

```text
src/
├── api/            # Configuración de Axios (Cliente HTTP)
├── components/     # Componentes reutilizables (Layout, Navbar)
├── context/        # Contexto global (AuthContext para sesión)
├── interfaces/     # Definiciones de tipos TypeScript (Modelos)
├── pages/          # Vistas principales (Login, Dashboard, Reportes, etc.)
├── main.tsx        # Punto de entrada
└── App.tsx         # Configuración de Rutas y Seguridad
```
