# Sistema Académico

Proyecto Spring Boot minimal para gestionar alumnos, cursos, matrículas y notas, con un frontend SPA en React (Vite).

Resumen rápido
- Backend: Spring Boot + Spring Data JPA (MySQL)
- Frontend: React + Vite + React-Bootstrap
- API base: http://localhost:8082/api

Requisitos
- Java 21
- Maven
- Node.js + npm
- MySQL (o ajustar a otra base de datos)

Configurar base de datos
1. Crear la base de datos (MySQL):

```sql
CREATE DATABASE sistema_academico CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

2. Ajustar credenciales en `src/main/resources/application.properties` (usuario/contraseña/host/puerto).

Ejecutar backend (desarrollo)

Desde la raíz del proyecto:

```bash
mvn clean package
mvn spring-boot:run
```

Por defecto la aplicación corre en `http://localhost:8082`.

Ejecutar frontend (desarrollo)

```bash
cd frontend
npm install
npm run dev
# abre http://localhost:3000
```

Servir la SPA desde Spring Boot (build integrado)

El proyecto incluye un `postbuild` en `frontend/package.json` que copia `dist/` a `src/main/resources/static` (requiere `cpx`). Flujo:

```bash
# en frontend
npm run build
# luego (desde la raíz) ejecutar backend
mvn spring-boot:run
# abrir http://localhost:8082
```

Problemas comunes
- Error "Failed to resolve import 'react-icons/fi'": instala `react-icons` en `frontend`:

```bash
cd frontend
npm install react-icons
npm run dev
```

- Si hay errores de dependencias o caché, elimina `node_modules` y `package-lock.json` y reinstala:

```bash
rm -rf node_modules package-lock.json
npm install
```

Endpoints principales

- `GET /api/alumnos` — listar alumnos
- `GET /api/alumnos/{id}` — obtener alumno
- `POST /api/alumnos` — crear alumno
- `PUT /api/alumnos/{id}` — actualizar alumno
- `DELETE /api/alumnos/{id}` — borrar alumno

Análogos para `/api/cursos`, `/api/matriculas` y `/api/notas`.

Prioridad actual y mejoras pendientes

- UI/UX: pulir diseño del portal (colores, banner, iconografía, accesibilidad) — ya hay un dashboard inicial en `frontend/src/components`.
- Frontend: conectar vistas `Cursos` y `Notas` a los endpoints REST y mostrar datos reales.
- Validación cliente: agregar validación y mensajes en formularios (Alumnos CRUD).
- Responsive: mejorar la interacción en móvil (sidebar colapsable).
- Backend: añadir capa `service` y DTOs, validación `@Valid` y manejo de errores.
- Seguridad: Spring Security + JWT y roles `ADMIN/PROFESOR/ALUMNO`.
- Tests: agregar pruebas unitarias y E2E (Playwright / Selenium).
- Deploy: integrar build frontend en pipeline Maven (`frontend-maven-plugin`) para que `mvn package` genere un único JAR con la SPA.

¿Qué puedo hacer ahora?

- Igualar el diseño exactamente al portal UTP (colores, banner e íconos).
- Conectar `Cursos` y `Notas` a la API y mostrar datos.
- Añadir autenticación básica y vistas por rol.
- Añadir validación cliente y mensajes UX.

Si quieres, elijo una de las opciones y la implemento: dime cuál prefieres. 
