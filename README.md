# Sistema Académico Avanzado

Plataforma académica con **3 roles**: Administrador, Docente y Estudiante,
sobre una base de datos centralizada (una sola tabla `usuarios` / perfiles,
diferenciados por el campo `rol`).

## Arquitectura

- **Backend**: Spring Boot 3 + Spring Security (JWT) + Spring Data JPA + MySQL + Flyway.
- **Frontend**: React + Vite + React Router (rutas protegidas por rol) + React Bootstrap.

### Modelo de datos (resumen)

- `usuarios`: tabla central de perfiles (nombres, email, password, **rol**, activo).
- `docentes` / `estudiantes`: extensiones 1-a-1 de `usuarios` con datos propios de cada rol.
- `periodos_academicos`, `cursos` (con docente y periodo asignados), `horarios`.
- `matriculas`: relación estudiante–curso.
- `notas`, `asistencias`: ligadas a la matrícula.
- `materiales`: material de estudio subido por el docente.
- `evaluaciones` (tareas/exámenes) y `entregas` de los estudiantes.

### Roles y permisos

| Rol            | Puede hacer |
|----------------|-------------|
| **Administrador** | Crear/editar/desactivar docentes y estudiantes, crear cursos y periodos, asignar docentes a cursos, matricular estudiantes. |
| **Docente**       | Ver sus cursos asignados, registrar notas y asistencia, subir material, crear evaluaciones (tareas/exámenes) y calificar entregas. |
| **Estudiante**    | Ver su horario, sus notas por curso, entregar tareas, rendir exámenes en línea y revisar su historial académico. |

La seguridad se aplica tanto a nivel de rutas HTTP (`/api/admin/**`, `/api/docente/**`,
`/api/estudiante/**` protegidas por rol) como a nivel de datos: un docente solo puede
operar sobre cursos que tiene asignados, y un estudiante solo sobre sus propias matrículas.

## Cómo ejecutar

### 1. Base de datos

Crea (o deja que Flyway cree) la base `sistema_academico` en MySQL. Ajusta las
credenciales en `src/main/resources/application.properties` si es necesario.

### 2. Backend

```bash
./mvnw spring-boot:run
```

Al arrancar, Flyway crea el esquema y **siembra un usuario de cada rol**, listos para
probar la plataforma de inmediato. El login acepta tanto el **email** como el **código**:

| Rol         | Código        | Password         | Email                                  |
|-------------|---------------|------------------|-----------------------------------------|
| Administrador | `A2342384`  | `Admin#2026`     | admin@sistema-academico.edu             |
| Docente       | `D45645646` | `Docente#2026`   | docente.demo@sistema-academico.edu      |
| Estudiante    | `U345345345`| `Estudiante#2026`| estudiante.demo@sistema-academico.edu   |

Además se crea un periodo (`2026-I`), un curso (`PROG101`) asignado al docente demo,
con un horario y con el estudiante demo ya matriculado, para que puedas probar los
3 roles de inmediato sin tener que dar de alta nada manualmente.

⚠️ Cambia estas contraseñas en un entorno real. El administrador puede crear más
docentes/estudiantes desde su panel, y opcionalmente definir su propio código de
acceso (si lo deja vacío, se autogenera).

El backend queda disponible en `http://localhost:8082`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Disponible en `http://localhost:5173`.

## Flujo típico

1. El administrador inicia sesión y crea periodos académicos, cursos, docentes y estudiantes
   (los docentes y estudiantes comparten la tabla de usuarios, solo cambia el rol).
2. El administrador asigna un docente a cada curso y matricula estudiantes.
3. El docente entra a su panel, ve sus cursos, registra notas/asistencia, sube material
   y crea tareas o exámenes.
4. El estudiante entra a su panel, ve su horario y notas, entrega tareas/exámenes y
   revisa su historial académico.

## Notas de diseño

- Las contraseñas se almacenan con **BCrypt**.
- La autenticación usa **JWT** (`Authorization: Bearer <token>`), sin sesiones en servidor.
- `spring.jpa.open-in-view=true` se deja activo intencionalmente para simplificar la
  serialización de relaciones `LAZY` en las respuestas JSON de este proyecto académico;
  en un sistema de mayor escala se recomienda mapear a DTOs explícitos.
