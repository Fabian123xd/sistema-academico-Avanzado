-- ============================================================
-- Migracion V3: Sistema de Prerrequisitos entre Cursos
-- ============================================================

CREATE TABLE curso_prerrequisitos (
    curso_id         BIGINT NOT NULL,
    prerrequisito_id BIGINT NOT NULL,
    PRIMARY KEY (curso_id, prerrequisito_id),
    CONSTRAINT fk_cp_curso FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE,
    CONSTRAINT fk_cp_prerrequisito FOREIGN KEY (prerrequisito_id) REFERENCES cursos(id) ON DELETE CASCADE
);
