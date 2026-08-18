package com.sistemaacademico.sistema_academico.repository;

import com.sistemaacademico.sistema_academico.model.Rol;
import com.sistemaacademico.sistema_academico.model.Usuario;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByCodigo(String codigo);
    boolean existsByEmail(String email);
    boolean existsByCodigo(String codigo);
    List<Usuario> findByRol(Rol rol);
}
