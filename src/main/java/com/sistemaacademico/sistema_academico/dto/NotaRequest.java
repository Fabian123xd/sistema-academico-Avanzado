package com.sistemaacademico.sistema_academico.dto;

public record NotaRequest(
        Long matriculaId,
        String concepto,
        Double valor,
        String comentario
) {}
