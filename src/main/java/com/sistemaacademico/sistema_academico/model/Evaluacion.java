package com.sistemaacademico.sistema_academico.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "evaluaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Evaluacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curso_id")
    private Curso curso;

    private String titulo;

    @Column(length = 2000)
    private String descripcion;

    @Enumerated(EnumType.STRING)
    private TipoEvaluacion tipo;

    private LocalDateTime fechaEntrega;

    private Double puntajeMaximo = 20.0;
}
