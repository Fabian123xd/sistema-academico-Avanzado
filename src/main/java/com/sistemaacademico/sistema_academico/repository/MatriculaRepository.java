package com.sistemaacademico.sistema_academico.repository;

import com.sistemaacademico.sistema_academico.model.Matricula;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatriculaRepository extends JpaRepository<Matricula, Long> {
    List<Matricula> findByEstudianteId(Long estudianteId);
    List<Matricula> findByCursoId(Long cursoId);
    Optional<Matricula> findByEstudianteIdAndCursoId(Long estudianteId, Long cursoId);
}
