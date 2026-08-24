package com.sistemaacademico.sistema_academico.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "entregas", uniqueConstraints = @UniqueConstraint(columnNames = {"evaluacion_id", "estudiante_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Entrega {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluacion_id")
    private Evaluacion evaluacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estudiante_id")
    private Estudiante estudiante;

    @Column(length = 4000)
    private String contenido; // respuesta de examen o enlace/texto de la tarea

    private LocalDateTime fechaEntrega = LocalDateTime.now();

    private Double nota;

    private String comentarioDocente;
}
