package com.sistemaacademico.sistema_academico.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "cursos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Curso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String codigo;

    private String nombre;

    private Integer creditos;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "docente_id")
    private Docente docente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "periodo_id")
    private PeriodoAcademico periodo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "carrera_id")
    private Carrera carrera;

    @Column(nullable = false)
    private Integer ciclo = 1;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoCurso tipo = TipoCurso.OBLIGATORIO;

    @Column(name = "capacidad_maxima", nullable = false)
    private Integer capacidadMaxima = 30;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "curso_prerrequisitos",
        joinColumns = @JoinColumn(name = "curso_id"),
        inverseJoinColumns = @JoinColumn(name = "prerrequisito_id")
    )
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private Set<Curso> prerrequisitos = new HashSet<>();
}
