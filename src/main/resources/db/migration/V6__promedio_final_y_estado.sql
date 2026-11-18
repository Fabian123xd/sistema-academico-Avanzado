-- ============================================================
-- Migracion V6: Promedio Final Ponderado y Cierre de Actas
-- ============================================================

ALTER TABLE matriculas ADD COLUMN promedio_final DOUBLE NULL;
ALTER TABLE matriculas ADD COLUMN fecha_cierre DATETIME NULL;
