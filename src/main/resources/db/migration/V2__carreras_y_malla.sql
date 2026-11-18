-- ============================================================
-- Migracion V2: Carreras y Malla Curricular por Ciclos
-- ============================================================

CREATE TABLE carreras (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo          VARCHAR(20) NOT NULL UNIQUE,
    nombre          VARCHAR(150) NOT NULL,
    descripcion     VARCHAR(500),
    duracion_ciclos INT NOT NULL DEFAULT 10,
    activo          BOOLEAN NOT NULL DEFAULT TRUE
);

-- Vincular estudiantes a una carrera
ALTER TABLE estudiantes ADD COLUMN carrera_id BIGINT NULL;
ALTER TABLE estudiantes ADD CONSTRAINT fk_estudiantes_carrera FOREIGN KEY (carrera_id) REFERENCES carreras(id) ON DELETE SET NULL;

-- Vincular cursos a una carrera, ciclo y tipo (Obligatorio/Electivo)
ALTER TABLE cursos ADD COLUMN carrera_id BIGINT NULL;
ALTER TABLE cursos ADD COLUMN ciclo INT NOT NULL DEFAULT 1;
ALTER TABLE cursos ADD COLUMN tipo VARCHAR(20) NOT NULL DEFAULT 'OBLIGATORIO';
ALTER TABLE cursos ADD CONSTRAINT fk_cursos_carrera FOREIGN KEY (carrera_id) REFERENCES carreras(id) ON DELETE SET NULL;

-- Datos semilla: Carreras institucionales
INSERT INTO carreras (codigo, nombre, descripcion, duracion_ciclos, activo) VALUES
('ING-SIS', 'Ingeniería de Sistemas e Informática', 'Formación integral en desarrollo de software, arquitectura de sistemas y gestión TI.', 10, TRUE),
('ADM-EMP', 'Administración de Empresas', 'Gestión estratégica, finanzas y dirección de organizaciones.', 10, TRUE);

-- Asociar el curso existente PROG101 a Ingeniería de Sistemas, Ciclo 1, Obligatorio
UPDATE cursos 
SET carrera_id = (SELECT id FROM carreras WHERE codigo = 'ING-SIS'),
    ciclo = 1,
    tipo = 'OBLIGATORIO'
WHERE codigo = 'PROG101';

-- Asociar al estudiante demo existente a la carrera de Ingeniería de Sistemas
UPDATE estudiantes 
SET carrera_id = (SELECT id FROM carreras WHERE codigo = 'ING-SIS')
WHERE usuario_id = (SELECT id FROM usuarios WHERE codigo = 'U345345345');
