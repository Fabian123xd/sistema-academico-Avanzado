package com.sistemaacademico.sistema_academico.repository;

import com.sistemaacademico.sistema_academico.model.Estudiante;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EstudianteRepository extends JpaRepository<Estudiante, Long> {
    Optional<Estudiante> findByUsuarioId(Long usuarioId);
    Optional<Estudiante> findByUsuarioEmail(String email);
    List<Estudiante> findByCarreraId(Long carreraId);
}
