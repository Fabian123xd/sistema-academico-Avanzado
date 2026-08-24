package com.sistemaacademico.sistema_academico.dto;

public record LoginResponse(
        String token,
        Long usuarioId,
        String nombreCompleto,
        String email,
        String codigo,
        String rol
) {}
