package com.sistemaacademico.sistema_academico.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/** Usado por el administrador para crear docentes o estudiantes. */
public record CrearUsuarioRequest(
        @NotBlank String nombres,
        @NotBlank String apellidos,
        @Email @NotBlank String email,
        @NotBlank String password,
        // Codigo de acceso opcional (ej. D45645646 / U345345345). Si se omite, se autogenera.
        String codigo,
        // Docente: especialidad, telefono | Estudiante: fechaNacimiento (yyyy-MM-dd), telefono
        String especialidad,
        String telefono,
        String fechaNacimiento
) {}
