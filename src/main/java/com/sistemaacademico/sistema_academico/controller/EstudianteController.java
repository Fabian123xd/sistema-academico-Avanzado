package com.sistemaacademico.sistema_academico.controller;

import com.sistemaacademico.sistema_academico.dto.EntregaRequest;
import com.sistemaacademico.sistema_academico.model.*;
import com.sistemaacademico.sistema_academico.security.UsuarioDetails;
import com.sistemaacademico.sistema_academico.service.AcademicoService;
import com.sistemaacademico.sistema_academico.service.EstudianteService;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/** Vistas y acciones propias del rol Estudiante. */
@RestController
@RequestMapping("/api/estudiante")
public class EstudianteController {

    private final EstudianteService estudianteService;
    private final AcademicoService academicoService;

    public EstudianteController(EstudianteService estudianteService, AcademicoService academicoService) {
        this.estudianteService = estudianteService;
        this.academicoService = academicoService;
    }

    private Long estudianteId(UsuarioDetails principal) {
        return academicoService.estudiantePorUsuarioEmail(principal.getUsername()).getId();
    }

    @GetMapping("/cursos")
    public List<Matricula> misCursos(@AuthenticationPrincipal UsuarioDetails principal) {
        return estudianteService.misCursos(estudianteId(principal));
    }

    @GetMapping("/horario")
    public List<Horario> miHorario(@AuthenticationPrincipal UsuarioDetails principal) {
        return estudianteService.miHorario(estudianteId(principal));
    }

    @GetMapping("/notas")
    public List<Nota> misNotas(@AuthenticationPrincipal UsuarioDetails principal) {
        return estudianteService.misNotas(estudianteId(principal));
    }

    @GetMapping("/historial")
    public List<Matricula> historial(@AuthenticationPrincipal UsuarioDetails principal) {
        return estudianteService.historial(estudianteId(principal));
    }

    @GetMapping("/evaluaciones")
    public List<Evaluacion> evaluacionesDisponibles(@AuthenticationPrincipal UsuarioDetails principal) {
        return estudianteService.evaluacionesDisponibles(estudianteId(principal));
    }

    @PostMapping("/entregas")
    public Entrega entregar(@RequestBody EntregaRequest req, @AuthenticationPrincipal UsuarioDetails principal) {
        return estudianteService.entregar(req, estudianteId(principal));
    }

    @GetMapping("/entregas")
    public List<Entrega> misEntregas(@AuthenticationPrincipal UsuarioDetails principal) {
        return estudianteService.misEntregas(estudianteId(principal));
    }
}
