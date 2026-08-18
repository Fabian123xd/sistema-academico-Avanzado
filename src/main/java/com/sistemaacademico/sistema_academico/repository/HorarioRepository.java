package com.sistemaacademico.sistema_academico.repository;

import com.sistemaacademico.sistema_academico.model.Horario;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HorarioRepository extends JpaRepository<Horario, Long> {
    List<Horario> findByCursoId(Long cursoId);
    List<Horario> findByCursoIdIn(List<Long> cursoIds);
}
