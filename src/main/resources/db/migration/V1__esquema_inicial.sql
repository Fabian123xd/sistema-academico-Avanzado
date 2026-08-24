-- ============================================================
-- Sistema Academico Avanzado - Esquema inicial
-- Base de datos centralizada: tabla usuarios (perfiles) + rol,
-- con tablas docentes/estudiantes extendiendo 1-a-1.
-- El codigo de acceso (login) vive en usuarios.codigo para
-- cualquier rol (administrador, docente o estudiante).
-- ============================================================

CREATE TABLE usuarios (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombres         VARCHAR(120) NOT NULL,
    apellidos       VARCHAR(120) NOT NULL,
    email           VARCHAR(180) NOT NULL UNIQUE,
    codigo          VARCHAR(30)  UNIQUE,
    password        VARCHAR(255) NOT NULL,
    rol             VARCHAR(20)  NOT NULL,
    activo          BOOLEAN      NOT NULL DEFAULT TRUE,
    fecha_creacion  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE docentes (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id      BIGINT NOT NULL UNIQUE,
    especialidad    VARCHAR(150),
    telefono        VARCHAR(30),
    CONSTRAINT fk_docentes_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE estudiantes (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id          BIGINT NOT NULL UNIQUE,
    fecha_nacimiento    DATE,
    telefono            VARCHAR(30),
    CONSTRAINT fk_estudiantes_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE periodos_academicos (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(30) NOT NULL UNIQUE,
    fecha_inicio    DATE,
    fecha_fin       DATE,
    activo          BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE cursos (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo      VARCHAR(30) NOT NULL UNIQUE,
    nombre      VARCHAR(150) NOT NULL,
    creditos    INT,
    docente_id  BIGINT,
    periodo_id  BIGINT,
    CONSTRAINT fk_cursos_docente FOREIGN KEY (docente_id) REFERENCES docentes(id) ON DELETE SET NULL,
    CONSTRAINT fk_cursos_periodo FOREIGN KEY (periodo_id) REFERENCES periodos_academicos(id) ON DELETE SET NULL
);

CREATE TABLE matriculas (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    estudiante_id       BIGINT NOT NULL,
    curso_id            BIGINT NOT NULL,
    fecha_matricula     DATE NOT NULL DEFAULT (CURRENT_DATE),
    estado              VARCHAR(20) NOT NULL DEFAULT 'INSCRITO',
    CONSTRAINT fk_matriculas_estudiante FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE,
    CONSTRAINT fk_matriculas_curso FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE,
    CONSTRAINT uq_matricula_estudiante_curso UNIQUE (estudiante_id, curso_id)
);

CREATE TABLE horarios (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    curso_id        BIGINT NOT NULL,
    dia_semana      VARCHAR(15) NOT NULL,
    hora_inicio     TIME NOT NULL,
    hora_fin        TIME NOT NULL,
    aula            VARCHAR(30),
    CONSTRAINT fk_horarios_curso FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE
);

CREATE TABLE notas (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    matricula_id    BIGINT NOT NULL,
    concepto        VARCHAR(120),
    valor           DOUBLE,
    comentario      VARCHAR(500),
    fecha           DATE NOT NULL DEFAULT (CURRENT_DATE),
    CONSTRAINT fk_notas_matricula FOREIGN KEY (matricula_id) REFERENCES matriculas(id) ON DELETE CASCADE
);

CREATE TABLE asistencias (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    matricula_id    BIGINT NOT NULL,
    fecha           DATE NOT NULL,
    estado          VARCHAR(20) NOT NULL,
    observacion     VARCHAR(300),
    CONSTRAINT fk_asistencias_matricula FOREIGN KEY (matricula_id) REFERENCES matriculas(id) ON DELETE CASCADE,
    CONSTRAINT uq_asistencia_matricula_fecha UNIQUE (matricula_id, fecha)
);

CREATE TABLE materiales (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    curso_id        BIGINT NOT NULL,
    titulo          VARCHAR(150) NOT NULL,
    descripcion     VARCHAR(500),
    url_archivo     VARCHAR(400),
    fecha_subida    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_materiales_curso FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE
);

CREATE TABLE evaluaciones (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    curso_id        BIGINT NOT NULL,
    titulo          VARCHAR(150) NOT NULL,
    descripcion     VARCHAR(2000),
    tipo            VARCHAR(20) NOT NULL,
    fecha_entrega   DATETIME,
    puntaje_maximo  DOUBLE DEFAULT 20,
    CONSTRAINT fk_evaluaciones_curso FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE
);

CREATE TABLE entregas (
    id                      BIGINT AUTO_INCREMENT PRIMARY KEY,
    evaluacion_id           BIGINT NOT NULL,
    estudiante_id           BIGINT NOT NULL,
    contenido               VARCHAR(4000),
    fecha_entrega           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    nota                    DOUBLE,
    comentario_docente      VARCHAR(500),
    CONSTRAINT fk_entregas_evaluacion FOREIGN KEY (evaluacion_id) REFERENCES evaluaciones(id) ON DELETE CASCADE,
    CONSTRAINT fk_entregas_estudiante FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE,
    CONSTRAINT uq_entrega_evaluacion_estudiante UNIQUE (evaluacion_id, estudiante_id)
);

-- ============================================================
-- Usuarios semilla: uno por cada rol, con codigo y password
-- propios (password mostrado abajo, hash en bcrypt).
--   Administrador -> codigo A2342384 / password Admin#2026
--   Docente       -> codigo D45645646 / password Docente#2026
--   Estudiante    -> codigo U345345345 / password Estudiante#2026
-- Cambiar estas contraseñas en un entorno real.
-- ============================================================
INSERT INTO usuarios (nombres, apellidos, email, codigo, password, rol, activo) VALUES
('Admin', 'General', 'admin@sistema-academico.edu', 'A2342384',
 '$2b$10$7CCmonuj3W.gwaB9pKbfbeyJDaIWlQ5KM1jQUA5x4RJw/DCU3m6qC', 'ADMINISTRADOR', TRUE),
('Carlos', 'Ramirez', 'docente.demo@sistema-academico.edu', 'D45645646',
 '$2b$10$jkEdenylLTdmQHuaFh0iUuC6hQbzTfpU05xnVBXXv.EblwnNa4nW6', 'DOCENTE', TRUE),
('Maria', 'Torres', 'estudiante.demo@sistema-academico.edu', 'U345345345',
 '$2b$10$0sY0TJ2HKsosDKgptGQlWuce4FkF7TU4Aw2HOUU10iVoAnrJZRX9q', 'ESTUDIANTE', TRUE);

INSERT INTO docentes (usuario_id, especialidad, telefono)
SELECT id, 'Ciencias de la Computacion', '999888777' FROM usuarios WHERE codigo = 'D45645646';

INSERT INTO estudiantes (usuario_id, fecha_nacimiento, telefono)
SELECT id, '2005-03-14', '999111222' FROM usuarios WHERE codigo = 'U345345345';

-- ---- Datos de ejemplo para poder probar los 3 roles de inmediato ----
INSERT INTO periodos_academicos (nombre, fecha_inicio, fecha_fin, activo)
VALUES ('2026-I', '2026-03-01', '2026-07-15', TRUE);

INSERT INTO cursos (codigo, nombre, creditos, docente_id, periodo_id)
SELECT 'PROG101', 'Introduccion a la Programacion', 4, d.id, p.id
FROM docentes d, periodos_academicos p
WHERE d.usuario_id = (SELECT id FROM usuarios WHERE codigo = 'D45645646')
  AND p.nombre = '2026-I';

INSERT INTO horarios (curso_id, dia_semana, hora_inicio, hora_fin, aula)
SELECT c.id, 'LUNES', '08:00:00', '10:00:00', 'Lab 301'
FROM cursos c WHERE c.codigo = 'PROG101';

INSERT INTO matriculas (estudiante_id, curso_id, fecha_matricula, estado)
SELECT e.id, c.id, CURRENT_DATE, 'INSCRITO'
FROM estudiantes e, cursos c
WHERE e.usuario_id = (SELECT id FROM usuarios WHERE codigo = 'U345345345')
  AND c.codigo = 'PROG101';
