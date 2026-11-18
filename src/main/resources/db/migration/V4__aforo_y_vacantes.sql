-- ============================================================
-- Migracion V4: Control de Aforo y Vacantes por Curso
-- ============================================================

ALTER TABLE cursos ADD COLUMN capacidad_maxima INT NOT NULL DEFAULT 30;
