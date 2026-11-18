package com.sistemaacademico.sistema_academico.controller;

import com.sistemaacademico.sistema_academico.dto.MatricularRequest;
import com.sistemaacademico.sistema_academico.model.*;
import com.sistemaacademico.sistema_academico.service.AcademicoService;
import com.sistemaacademico.sistema_academico.service.EstudianteService;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

/** El administrador gestiona carreras, periodos academicos, cursos, horarios y matriculas. */
@RestController
@RequestMapping("/api/admin")
public class AdminAcademicoController {

    private final AcademicoService academicoService;
    private final EstudianteService estudianteService;

    public AdminAcademicoController(AcademicoService academicoService, EstudianteService estudianteService) {
        this.academicoService = academicoService;
        this.estudianteService = estudianteService;
    }

    // ---- Carreras ----
    @PostMapping("/carreras")
    public Carrera crearCarrera(@RequestBody Carrera carrera) {
        return academicoService.crearCarrera(carrera);
    }

    @GetMapping("/carreras")
    public List<Carrera> listarCarreras() {
        return academicoService.listarCarreras();
    }

    @GetMapping("/carreras/{id}")
    public Carrera obtenerCarrera(@PathVariable Long id) {
        return academicoService.obtenerCarrera(id);
    }

    @GetMapping("/carreras/{id}/cursos")
    public List<Curso> listarCursosPorCarrera(@PathVariable Long id, @RequestParam(required = false) Integer ciclo) {
        if (ciclo != null) {
            return academicoService.listarCursosPorCarreraYCiclo(id, ciclo);
        }
        return academicoService.listarCursosPorCarrera(id);
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
    public record CursoRequest(
            String codigo,
            String nombre,
            Integer creditos,
            Long docenteId,
            Long periodoId,
            Long carreraId,
            Integer ciclo,
            String tipo,
            Integer capacidadMaxima
    ) {}

    @PostMapping("/cursos")
    public Curso crearCurso(@RequestBody CursoRequest req) {
        Curso curso = new Curso();
        curso.setCodigo(req.codigo());
        curso.setNombre(req.nombre());
        curso.setCreditos(req.creditos());
        TipoCurso tipo = req.tipo() != null && !req.tipo().isBlank() ? TipoCurso.valueOf(req.tipo()) : TipoCurso.OBLIGATORIO;
        return academicoService.crearCurso(curso, req.docenteId(), req.periodoId(), req.carreraId(), req.ciclo(), tipo, req.capacidadMaxima());
    }

    @GetMapping("/cursos")
    public List<Curso> listarCursos() {
        return academicoService.listarCursos();
    }

    @GetMapping("/cursos/{id}/vacantes")
    public Map<String, Object> obtenerVacantes(@PathVariable Long id) {
        return academicoService.obtenerVacantes(id);
    }

    @PatchMapping("/cursos/{id}/docente")
    public Curso asignarDocente(@PathVariable Long id, @RequestParam Long docenteId) {
        return academicoService.asignarDocente(id, docenteId);
    }

    // ---- Prerrequisitos ----
    @PostMapping("/cursos/{id}/prerrequisitos")
    public Curso asignarPrerrequisito(@PathVariable Long id, @RequestParam Long prerrequisitoId) {
        return academicoService.asignarPrerrequisito(id, prerrequisitoId);
    }

    @DeleteMapping("/cursos/{id}/prerrequisitos/{prerrequisitoId}")
    public Curso eliminarPrerrequisito(@PathVariable Long id, @PathVariable Long prerrequisitoId) {
        return academicoService.eliminarPrerrequisito(id, prerrequisitoId);
    }

    @GetMapping("/cursos/{id}/prerrequisitos")
    public List<Curso> listarPrerrequisitos(@PathVariable Long id) {
        return academicoService.listarPrerrequisitos(id);
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

    @GetMapping("/matriculas/validar-cruce")
    public Map<String, Object> verificarCruceHorario(@RequestParam Long estudianteId, @RequestParam Long cursoId) {
        return academicoService.verificarCruceHorario(estudianteId, cursoId);
    }

    // ---- Cuadro de Merito / Ranking Academico ----
    @GetMapping("/cuadro-merito")
    public List<Map<String, Object>> cuadroMerito(@RequestParam(required = false) Long carreraId) {
        return estudianteService.generarCuadroMerito(carreraId);
    }
}
