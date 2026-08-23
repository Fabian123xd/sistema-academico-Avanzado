# Sistema Académico

Proyecto Spring Boot minimal para gestionar alumnos, cursos, matrículas y notas, con un frontend SPA en React (Vite).

## Resumen rápido
- Backend: Spring Boot + Spring Data JPA (MySQL)
- Frontend: React + Vite + React-Bootstrap
- API base: http://localhost:8082/api

## Requisitos
- Java 21
- Maven
- Node.js + npm
- MySQL (o ajustar a otra base de datos)

## Configurar base de datos
Crear la base de datos (MySQL):
```sql
CREATE DATABASE sistema_academico CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

mvn clean package
mvn spring-boot:run
cd frontend
npm install
npm run dev
# abre http://localhost:3000
# en frontend
npm run build
# luego (desde la raíz) ejecutar backend
mvn spring-boot:run
# abrir http://localhost:8082

