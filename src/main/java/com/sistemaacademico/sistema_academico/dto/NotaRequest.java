package com.sistemaacademico.sistema_academico.dto;

public record NotaRequest(
        Long matriculaId,
        String concepto,
        Double valor,
        String comentario,
        Long criterioId
) {
    public NotaRequest(Long matriculaId, String concepto, Double valor, String comentario) {
        this(matriculaId, concepto, valor, comentario, null);
    }
}
