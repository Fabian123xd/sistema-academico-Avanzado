package com.sistemaacademico.sistema_academico.model;

import jakarta.persistence.*;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "horarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Horario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curso_id")
    private Curso curso;

    /** LUNES, MARTES, MIERCOLES, JUEVES, VIERNES, SABADO, DOMINGO */
    private String diaSemana;

    private LocalTime horaInicio;

    private LocalTime horaFin;

    private String aula;
}
