package com.sistemaacademico.sistema_academico.dto;

import jakarta.validation.constraints.NotBlank;

/** identificador puede ser el email o el codigo de acceso (ej. A2342384, D45645646, U345345345). */
public record LoginRequest(
        @NotBlank String identificador,
        @NotBlank String password
) {}
