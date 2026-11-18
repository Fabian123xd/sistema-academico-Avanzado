package com.sistemaacademico.sistema_academico.repository;

import com.sistemaacademico.sistema_academico.model.Carrera;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarreraRepository extends JpaRepository<Carrera, Long> {
    Optional<Carrera> findByCodigo(String codigo);
    List<Carrera> findByActivoTrue();
}
