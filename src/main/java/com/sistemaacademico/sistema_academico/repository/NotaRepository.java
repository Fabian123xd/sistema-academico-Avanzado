package com.sistemaacademico.sistema_academico.repository;

import com.sistemaacademico.sistema_academico.model.Nota;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotaRepository extends JpaRepository<Nota, Long> {
    List<Nota> findByMatriculaId(Long matriculaId);
    List<Nota> findByMatriculaIdIn(List<Long> matriculaIds);
}
