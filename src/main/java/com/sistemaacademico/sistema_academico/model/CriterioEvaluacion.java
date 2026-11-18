package com.sistemaacademico.sistema_academico.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "criterios_evaluacion", uniqueConstraints = @UniqueConstraint(columnNames = {"curso_id", "codigo"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CriterioEvaluacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curso_id", nullable = false)
    @JsonIgnore
    private Curso curso;

    @Column(nullable = false, length = 30)
    private String codigo;

    @Column(nullable = false, length = 120)
    private String nombre;

    @Column(nullable = false)
    private Integer porcentaje;

    @Column(nullable = false)
    private Integer orden = 1;
}
