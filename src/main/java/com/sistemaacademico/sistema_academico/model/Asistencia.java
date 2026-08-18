package com.sistemaacademico.sistema_academico.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "asistencias", uniqueConstraints = @UniqueConstraint(columnNames = {"matricula_id", "fecha"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Asistencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "matricula_id")
    private Matricula matricula;

    private LocalDate fecha = LocalDate.now();

    @Enumerated(EnumType.STRING)
    private EstadoAsistencia estado;

    private String observacion;
}
