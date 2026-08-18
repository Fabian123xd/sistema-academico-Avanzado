package com.sistemaacademico.sistema_academico.repository;

import com.sistemaacademico.sistema_academico.model.Material;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialRepository extends JpaRepository<Material, Long> {
    List<Material> findByCursoId(Long cursoId);
    List<Material> findByCursoIdIn(List<Long> cursoIds);
}
