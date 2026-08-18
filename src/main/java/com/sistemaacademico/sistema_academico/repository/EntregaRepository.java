package com.sistemaacademico.sistema_academico.repository;

import com.sistemaacademico.sistema_academico.model.Entrega;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EntregaRepository extends JpaRepository<Entrega, Long> {
    List<Entrega> findByEvaluacionId(Long evaluacionId);
    List<Entrega> findByEstudianteId(Long estudianteId);
    Optional<Entrega> findByEvaluacionIdAndEstudianteId(Long evaluacionId, Long estudianteId);
}
