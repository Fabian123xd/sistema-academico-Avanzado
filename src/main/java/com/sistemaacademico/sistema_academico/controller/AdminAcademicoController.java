package com.sistemaacademico.sistema_academico.controller;

import com.sistemaacademico.sistema_academico.dto.MatricularRequest;
import com.sistemaacademico.sistema_academico.model.Curso;
import com.sistemaacademico.sistema_academico.model.Horario;
import com.sistemaacademico.sistema_academico.model.Matricula;
import com.sistemaacademico.sistema_academico.model.PeriodoAcademico;
import com.sistemaacademico.sistema_academico.service.AcademicoService;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

/** El administrador gestiona periodos academicos, cursos, horarios y matriculas. */
@RestController
@RequestMapping("/api/admin")
public class AdminAcademicoController {

    private final AcademicoService academicoService;

    public AdminAcademicoController(AcademicoService academicoService) {
        this.academicoService = academicoService;
    }

    // ---- Periodos ----
    @PostMapping("/periodos")
    public PeriodoAcademico crearPeriodo(@RequestBody PeriodoAcademico periodo) {
        return academicoService.crearPeriodo(periodo);
    }

    @GetMapping("/periodos")
    public List<PeriodoAcademico> listarPeriodos() {
        return academicoService.listarPeriodos();
    }

    // ---- Cursos ----
    public record CursoRequest(String codigo, String nombre, Integer creditos, Long docenteId, Long periodoId) {}

    @PostMapping("/cursos")
    public Curso crearCurso(@RequestBody CursoRequest req) {
        Curso curso = new Curso();
        curso.setCodigo(req.codigo());
        curso.setNombre(req.nombre());
        curso.setCreditos(req.creditos());
        return academicoService.crearCurso(curso, req.docenteId(), req.periodoId());
    }

    @GetMapping("/cursos")
    public List<Curso> listarCursos() {
        return academicoService.listarCursos();
    }

    @PatchMapping("/cursos/{id}/docente")
    public Curso asignarDocente(@PathVariable Long id, @RequestParam Long docenteId) {
        return academicoService.asignarDocente(id, docenteId);
    }

    // ---- Horarios ----
    @PostMapping("/cursos/{id}/horarios")
    public Horario crearHorario(@PathVariable Long id, @RequestBody Horario horario) {
        return academicoService.crearHorario(id, horario);
    }

    // ---- Matriculas ----
    @PostMapping("/matriculas")
    public Matricula matricular(@RequestBody MatricularRequest req) {
        return academicoService.matricular(req);
    }

    @GetMapping("/cursos/{id}/matriculas")
    public List<Matricula> matriculasDeCurso(@PathVariable Long id) {
        return academicoService.matriculasDeCurso(id);
    }
}
