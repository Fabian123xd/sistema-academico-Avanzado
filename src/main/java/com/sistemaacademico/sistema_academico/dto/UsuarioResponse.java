package com.sistemaacademico.sistema_academico.dto;

public record UsuarioResponse(
        Long id,
        String nombres,
        String apellidos,
        String email,
        String rol,
        boolean activo,
        String codigo // codigo de acceso centralizado en Usuario
) {}
