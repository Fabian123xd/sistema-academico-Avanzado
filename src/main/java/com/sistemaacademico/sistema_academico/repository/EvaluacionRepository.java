package com.sistemaacademico.sistema_academico.repository;

import com.sistemaacademico.sistema_academico.model.Evaluacion;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EvaluacionRepository extends JpaRepository<Evaluacion, Long> {
    List<Evaluacion> findByCursoId(Long cursoId);
    List<Evaluacion> findByCursoIdIn(List<Long> cursoIds);
}
