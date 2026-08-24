package com.sistemaacademico.sistema_academico.controller;

import com.sistemaacademico.sistema_academico.dto.AsistenciaRequest;
import com.sistemaacademico.sistema_academico.dto.CalificarEntregaRequest;
import com.sistemaacademico.sistema_academico.dto.NotaRequest;
import com.sistemaacademico.sistema_academico.model.*;
import com.sistemaacademico.sistema_academico.security.UsuarioDetails;
import com.sistemaacademico.sistema_academico.service.AcademicoService;
import com.sistemaacademico.sistema_academico.service.DocenteService;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/** Vistas y acciones propias del rol Docente. */
@RestController
@RequestMapping("/api/docente")
public class DocenteController {

    private final DocenteService docenteService;
    private final AcademicoService academicoService;

    public DocenteController(DocenteService docenteService, AcademicoService academicoService) {
        this.docenteService = docenteService;
        this.academicoService = academicoService;
    }

    private Long docenteId(UsuarioDetails principal) {
        return academicoService.docentePorUsuarioEmail(principal.getUsername()).getId();
    }

    @GetMapping("/cursos")
    public List<Curso> misCursos(@AuthenticationPrincipal UsuarioDetails principal) {
        return academicoService.listarCursosPorDocente(docenteId(principal));
    }

    @GetMapping("/cursos/{id}/matriculas")
    public List<Matricula> matriculasDeCurso(@PathVariable Long id, @AuthenticationPrincipal UsuarioDetails principal) {
        academicoService.verificarCursoDeDocente(id, docenteId(principal));
        return academicoService.matriculasDeCurso(id);
    }

    // ---- Notas ----
    @PostMapping("/notas")
    public Nota registrarNota(@RequestBody NotaRequest req, @AuthenticationPrincipal UsuarioDetails principal) {
        return docenteService.registrarNota(req, docenteId(principal));
    }

    @GetMapping("/cursos/{id}/notas")
    public List<Nota> notasDeCurso(@PathVariable Long id, @AuthenticationPrincipal UsuarioDetails principal) {
        return docenteService.notasDeCurso(id, docenteId(principal));
    }

    // ---- Asistencia ----
    @PostMapping("/asistencia")
    public Asistencia registrarAsistencia(@RequestBody AsistenciaRequest req, @AuthenticationPrincipal UsuarioDetails principal) {
        return docenteService.registrarAsistencia(req, docenteId(principal));
    }

    @GetMapping("/cursos/{id}/asistencia")
    public List<Asistencia> asistenciaDeCurso(@PathVariable Long id, @AuthenticationPrincipal UsuarioDetails principal) {
        return docenteService.asistenciaDeCurso(id, docenteId(principal));
    }

    // ---- Material de estudio ----
    @PostMapping("/cursos/{id}/materiales")
    public Material subirMaterial(@PathVariable Long id, @RequestBody Material material, @AuthenticationPrincipal UsuarioDetails principal) {
        return docenteService.subirMaterial(id, material, docenteId(principal));
    }

    @GetMapping("/cursos/{id}/materiales")
    public List<Material> materialesDeCurso(@PathVariable Long id) {
        return docenteService.materialesDeCurso(id);
    }

    // ---- Evaluaciones (tareas / examenes) ----
    @PostMapping("/cursos/{id}/evaluaciones")
    public Evaluacion crearEvaluacion(@PathVariable Long id, @RequestBody Evaluacion evaluacion, @AuthenticationPrincipal UsuarioDetails principal) {
        return docenteService.crearEvaluacion(id, evaluacion, docenteId(principal));
    }

    @GetMapping("/cursos/{id}/evaluaciones")
    public List<Evaluacion> evaluacionesDeCurso(@PathVariable Long id) {
        return docenteService.evaluacionesDeCurso(id);
    }

    @GetMapping("/evaluaciones/{id}/entregas")
    public List<Entrega> entregasDeEvaluacion(@PathVariable Long id, @AuthenticationPrincipal UsuarioDetails principal) {
        return docenteService.entregasDeEvaluacion(id, docenteId(principal));
    }

    @PatchMapping("/entregas/{id}/calificar")
    public Entrega calificarEntrega(@PathVariable Long id, @RequestBody CalificarEntregaRequest req, @AuthenticationPrincipal UsuarioDetails principal) {
        return docenteService.calificarEntrega(id, req, docenteId(principal));
    }
}
