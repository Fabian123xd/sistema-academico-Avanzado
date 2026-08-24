package com.sistemaacademico.sistema_academico.repository;

import com.sistemaacademico.sistema_academico.model.Asistencia;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {
    List<Asistencia> findByMatriculaId(Long matriculaId);
    List<Asistencia> findByMatriculaCursoId(Long cursoId);
}
