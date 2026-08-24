package com.sistemaacademico.sistema_academico.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "matriculas", uniqueConstraints = @UniqueConstraint(columnNames = {"estudiante_id", "curso_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Matricula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estudiante_id")
    private Estudiante estudiante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curso_id")
    private Curso curso;

    private LocalDate fechaMatricula = LocalDate.now();

    @Enumerated(EnumType.STRING)
    private EstadoMatricula estado = EstadoMatricula.INSCRITO;
}
