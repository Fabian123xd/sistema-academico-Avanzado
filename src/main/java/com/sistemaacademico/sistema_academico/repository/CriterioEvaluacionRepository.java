package com.sistemaacademico.sistema_academico.repository;

import com.sistemaacademico.sistema_academico.model.CriterioEvaluacion;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CriterioEvaluacionRepository extends JpaRepository<CriterioEvaluacion, Long> {
    List<CriterioEvaluacion> findByCursoIdOrderByOrdenAsc(Long cursoId);
    Optional<CriterioEvaluacion> findByCursoIdAndCodigo(Long cursoId, String codigo);
}
