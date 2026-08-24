package com.sistemaacademico.sistema_academico.dto;

public record AsistenciaRequest(
        Long matriculaId,
        String fecha, // yyyy-MM-dd
        String estado, // PRESENTE, AUSENTE, TARDANZA, JUSTIFICADO
        String observacion
) {}
