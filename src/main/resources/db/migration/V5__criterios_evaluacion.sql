-- ============================================================
-- Migracion V5: Criterios y Ponderaciones de Evaluacion por Curso
-- ============================================================

CREATE TABLE criterios_evaluacion (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    curso_id        BIGINT NOT NULL,
    codigo          VARCHAR(30) NOT NULL,
    nombre          VARCHAR(120) NOT NULL,
    porcentaje      INT NOT NULL,
    orden           INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_criterios_curso FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE,
    CONSTRAINT uq_criterio_curso_codigo UNIQUE (curso_id, codigo)
);

-- Agregar relacion de criterio en la tabla notas
ALTER TABLE notas ADD COLUMN criterio_id BIGINT NULL;
ALTER TABLE notas ADD CONSTRAINT fk_notas_criterio FOREIGN KEY (criterio_id) REFERENCES criterios_evaluacion(id) ON DELETE SET NULL;

-- Semilla inicial para el curso PROG101: 30% Practicas, 30% Parcial, 40% Final
INSERT INTO criterios_evaluacion (curso_id, codigo, nombre, porcentaje, orden)
SELECT id, 'PC', 'Prácticas Calificadas', 30, 1 FROM cursos WHERE codigo = 'PROG101';

INSERT INTO criterios_evaluacion (curso_id, codigo, nombre, porcentaje, orden)
SELECT id, 'EP', 'Examen Parcial', 30, 2 FROM cursos WHERE codigo = 'PROG101';

INSERT INTO criterios_evaluacion (curso_id, codigo, nombre, porcentaje, orden)
SELECT id, 'EF', 'Examen Final', 40, 3 FROM cursos WHERE codigo = 'PROG101';
