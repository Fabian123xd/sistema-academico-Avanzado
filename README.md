# 🎓 Sistema Académico Avanzado — Portal de Gestión Académica

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg?logo=springboot)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-orange.svg?logo=openjdk)](https://www.oracle.com/java/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg?logo=vite)](https://vitejs.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg?logo=mysql)](https://www.mysql.com/)
[![Flyway](https://img.shields.io/badge/Flyway-Migrations-red.svg?logo=flyway)](https://flywaydb.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple.svg?logo=bootstrap)](https://getbootstrap.com/)

Plataforma web integral y moderna para la administración, docencia y seguimiento académico institucional. Conecta en tiempo real la administración académica, la plana docente y la comunidad estudiantil bajo estándares educativos formales: **gestión de carreras y malla curricular por ciclos, sistema estricto de prerrequisitos, control de aforo y cupos, detección algorítmica de cruces de horarios, calificaciones ponderadas configurables (PC, EP, EF), cierre oficial de actas, cálculo automático de Promedio Ponderado Acumulado (PPA) y cuadro de honor con orden de mérito**.

---

## 🚀 Tecnologías

### Backend
* **Lenguaje:** Java 21 (LTS)
* **Framework:** Spring Boot 3.3.4
* **Seguridad:** Spring Security 6 + Autenticación Stateless con Tokens JWT (jjwt 0.12.6)
* **Persistencia:** Spring Data JPA / Hibernate
* **Migraciones de BD:** Flyway Migration (versionado declarativo y automatizado)
* **Utilidades:** Lombok, Bean Validation (Jakarta)

### Frontend
* **Biblioteca:** React 18 (SPA)
* **Empaquetador & Dev Server:** Vite 5
* **Enrutamiento:** React Router DOM v6
* **Diseño & UI:** Bootstrap 5.3 + React-Bootstrap + React Icons (Feather Icons)
* **Cliente HTTP:** Axios con interceptores automáticos de autenticación JWT

### Base de Datos
* **Motor:** MySQL 8.0+
* **Codificación:** UTF-8 (`utf8mb4_unicode_ci`)

---

## 👥 Cuentas de Acceso y Credenciales de Prueba

La base de datos cuenta con usuarios semilla precargados por Flyway para probar de inmediato cada perfil institucional:

| Rol | Correo Electrónico | Código Institucional | Contraseña | Usuario Registrado | Panel de Redirección |
| :--- | :--- | :---: | :---: | :--- | :---: |
| 🛡️ **Administrador** | `admin@sistema-academico.edu` | `A2342384` | `Admin#2026` | Admin General | `/admin` |
| 👨‍🏫 **Docente** | `docente.demo@sistema-academico.edu` | `D45645646` | `Docente#2026` | Prof. Carlos Ramirez | `/docente` |
| 🎓 **Estudiante** | `estudiante.demo@sistema-academico.edu` | `U345345345` | `Estudiante#2026` | Maria Torres | `/estudiante` |

> [!NOTE]  
> El sistema permite iniciar sesión indistintamente ingresando el **Correo Electrónico** o el **Código Institucional**, junto con la contraseña.

---

## 💻 Instalación y Ejecución Local

### Prerrequisitos
* **Java Development Kit (JDK):** Versión 21 o superior instalada y configurada en el `PATH`.
* **Node.js:** Versión 18 o superior y gestor de paquetes `npm`.
* **MySQL Server:** Servicio en ejecución (puerto estándar `3306`).
* **Git:** Para clonar el repositorio.

---

### Paso 1: Configurar la Base de Datos MySQL
Accede a tu cliente MySQL (CLI o MySQL Workbench) y crea la base de datos:

```sql
CREATE DATABASE sistema_academico 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;
```

Verifica la conexión en `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/sistema_academico?useSSL=false&serverTimezone=UTC&createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=root
```
*(Ajusta usuario y contraseña según la configuración de tu MySQL local).*

---

### Paso 2: Ejecutar el Backend (Spring Boot)
Abre una terminal en la raíz del proyecto:

```bash
# En Windows (PowerShell / CMD)
.\mvnw spring-boot:run

# En Linux / macOS
./mvnw spring-boot:run
```
* Las migraciones de **Flyway** se ejecutarán automáticamente creando todas las tablas y sembrando los datos de prueba.
* El servidor backend iniciará en: `http://localhost:8082`

---

### Paso 3: Ejecutar el Frontend (React + Vite)
En una segunda terminal, ingresa a la carpeta `frontend`:

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```
* La aplicación frontend iniciará en: `http://localhost:5173`

---

### Paso 4 (Opcional): Compilar Frontend para Despliegue Unificado
Si deseas servir todo el sistema directamente desde el puerto `8082` de Spring Boot:

```bash
cd frontend
npm run build
```
*(El script copiará los archivos optimizados directamente en `src/main/resources/static/`).*

---

## 📁 Módulos y Funcionalidades del Sistema

```
📦 sistema-academico
├── 🌐 Portal Público & Landing Page (Informativa, niveles educativos y acceso al login)
├── 🛡️ Panel de Administración (/admin)
│   ├── Gestión de Usuarios (Directorio, creación con código autogenerado, suspensión y baja)
│   ├── Malla Curricular y Carreras (Organización por ciclos, cursos obligatorios/electivos)
│   ├── Prerrequisitos Académicos (Configuración de correlatividades y cursos candado)
│   ├── Control de Aforo y Vacantes (Límites máximos de cupo por aula e indicadores en vivo)
│   ├── Matrículas con Validación de Cruces (Detección algorítmica de solapamiento horario)
│   └── Cuadro de Honor y Orden de Mérito (Ranking institucional por PPA y distinciones)
├── 👨‍🏫 Portal del Docente (/docente)
│   ├── Panel de Cursos Asignados (Horarios, nómina de alumnos matriculados)
│   ├── Sistema de Criterios y Ponderaciones (Pesos configurables: PC, EP, EF = 100%)
│   ├── Registro de Evaluaciones Continuas (Escala vigesimal de 0 a 20 con retroalimentación)
│   ├── Cierre de Acta Oficial (Cálculo automático de promedio ponderado, redondeo formal ≥ 10.5)
│   ├── Control de Asistencias (Presente, Ausente, Tardanza, Justificado)
│   └── Aula Virtual (Publicación de materiales educativos y creación de evaluaciones)
└── 🎓 Portal del Estudiante (/estudiante)
    ├── Panel de Rendimiento (Métricas en tiempo real: PPA, Puesto, Créditos y Distinción)
    ├── Horario Semanal (Grilla interactiva de clases y aulas)
    ├── Mis Calificaciones (Desglose de notas por criterio y condición académica oficial)
    ├── Tareas y Evaluaciones (Recepción y entrega virtual de actividades académicas)
    └── Historial Académico (Kárdex con récord de asignaturas, créditos y estados)
```

---

## 🧠 Lógica Académica Avanzada Implementada

### 1. Estructura Curricular y Malla por Ciclos
* Las asignaturas pertenecen a una **Carrera Profesional** (e.g. Ingeniería de Sistemas, Medicina, Administración) o área general.
* Clasificación por **Ciclos Académicos** (Ciclo I, Ciclo II, Ciclo III...) y tipo de materia (`OBLIGATORIO` o `ELECTIVO`).

### 2. Validación Estricta de Prerrequisitos
* Un estudiante **no puede matricularse** en un curso avanzado (por ejemplo *Programación II*) si no ha aprobado previamente todos los cursos prerrequisito asociados (*Programación I*).

### 3. Control de Aforo y Vacantes en Tiempo Real
* Cada curso cuenta con una `capacidad_maxima`. 
* El sistema calcula las vacantes disponibles en tiempo real y bloquea automáticamente nuevas matrículas una vez alcanzado el tope.

### 4. Algoritmo Antisolapamiento de Horarios
* Al matricular, el sistema valida que no existan colisiones horarias entre asignaturas cursadas en el mismo día mediante la regla:
  $$\text{Inicio}_A < \text{Fin}_B \quad\land\quad \text{Inicio}_B < \text{Fin}_A$$
* Si se detecta un cruce, el frontend muestra una alerta preventiva inmediata impidiendo el conflicto de aula.

### 5. Criterios Ponderados y Cierre de Actas Oficiales
* Fórmulas configurables por materia con validación al 100%:
  $$\text{Promedio} = (\text{PC} \times 0.30) + (\text{EP} \times 0.30) + (\text{EF} \times 0.40)$$
* **Regla de Redondeo Oficial:** Promedios con decimal $\ge 10.5$ aprueban automáticamente redondeando a $11$ con estado `APROBADO`. Promedios menores quedan con estado `DESAPROBADO`.

### 6. Promedio Ponderado Acumulado (PPA) y Orden de Mérito
* Cálculo exacto del récord institucional considerando el peso crediticio:
  $$\text{PPA} = \frac{\sum (\text{PromedioFinal}_i \times \text{Créditos}_i)}{\sum \text{Créditos}_i}$$
* Clasificación de honor automática por percentil:
  * ⭐ **Décimo Superior:** Top 10% del alumnado.
  * 🎖️ **Quinto Superior:** Top 20% del alumnado.
  * 🏅 **Tercio Superior:** Top 33.3% del alumnado.
  * 📌 **Regular:** Alumnado con rendimiento estándar.

---

## 🌐 Endpoints Clave de la API REST

### Autenticación
* `POST /api/auth/login` — Autenticación con email/código y contraseña (emite token JWT).
* `GET /api/auth/perfil` — Obtiene los datos del usuario autenticado actual.

### Administración Académica
* `GET /api/admin/carreras` | `POST /api/admin/carreras` — Gestión de carreras profesionales.
* `GET /api/admin/cursos` | `POST /api/admin/cursos` — Gestión curricular y capacidad.
* `POST /api/admin/cursos/{id}/prerrequisitos` — Asignación de prerrequisitos.
* `GET /api/admin/matriculas/validar-cruce` — Validación en tiempo real de cruces de horario.
* `GET /api/admin/cuadro-merito?carreraId={id}` — Cuadro de honor y ranking de mérito institucional.

### Docente
* `GET /api/docente/cursos` — Asignaturas a cargo del docente.
* `GET /api/docente/cursos/{id}/acta` — Consulta de acta de notas con notas por criterio.
* `POST /api/docente/cursos/{id}/cerrar-acta` — Cierre oficial de acta y cálculo de aprobados/desaprobados.
* `POST /api/docente/cursos/{id}/criterios` — Configuración de porcentajes de evaluación.

### Estudiante
* `GET /api/estudiante/cursos` — Mis asignaturas matriculadas del periodo activo.
* `GET /api/estudiante/horario` — Horario semanal de clases.
* `GET /api/estudiante/notas` — Calificaciones detalladas por criterio.
* `GET /api/estudiante/rendimiento` — Métricas de PPA, puesto en la carrera y distinción académica.
* `GET /api/estudiante/historial` — Kárdex académico completo.

---

## 📄 Licencia

Proyecto de Gestión Académica desarrollado con fines académicos e institucionales.  
Todos los derechos reservados © 2026.

## Prueba de integracion continua

Modificaion realizada mediante la demostracion de pipeline