package com.sistemaacademico.sistema_academico.repository;

import com.sistemaacademico.sistema_academico.model.Curso;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CursoRepository extends JpaRepository<Curso, Long> {
    List<Curso> findByDocenteId(Long docenteId);
    List<Curso> findByPeriodoId(Long periodoId);
}
