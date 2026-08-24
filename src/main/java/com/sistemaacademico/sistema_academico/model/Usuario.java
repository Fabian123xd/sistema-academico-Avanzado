package com.sistemaacademico.sistema_academico.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Tabla centralizada de perfiles. Todos los usuarios de la plataforma
 * (administradores, docentes y estudiantes) viven aqui y se diferencian
 * por el campo "rol". Docente y Estudiante son extensiones 1-a-1 que
 * agregan datos propios de cada rol.
 */
@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombres;

    private String apellidos;

    @Column(unique = true, nullable = false)
    private String email;

    /** Codigo de acceso (ej. A2342384, D45645646, U345345345). Alternativa al email para iniciar sesion. */
    @Column(unique = true, length = 30)
    private String codigo;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Rol rol;

    @Column(nullable = false)
    private boolean activo = true;

    private LocalDateTime fechaCreacion = LocalDateTime.now();
}
