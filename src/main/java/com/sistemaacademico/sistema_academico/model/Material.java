package com.sistemaacademico.sistema_academico.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "materiales")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curso_id")
    private Curso curso;

    private String titulo;

    private String descripcion;

    /** URL o ruta del recurso subido por el docente */
    private String urlArchivo;

    private LocalDateTime fechaSubida = LocalDateTime.now();
}
