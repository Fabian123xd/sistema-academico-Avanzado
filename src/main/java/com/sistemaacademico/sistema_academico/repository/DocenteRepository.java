package com.sistemaacademico.sistema_academico.repository;

import com.sistemaacademico.sistema_academico.model.Docente;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocenteRepository extends JpaRepository<Docente, Long> {
    Optional<Docente> findByUsuarioId(Long usuarioId);
    Optional<Docente> findByUsuarioEmail(String email);
}
