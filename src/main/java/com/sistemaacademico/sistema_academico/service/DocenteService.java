package com.sistemaacademico.sistema_academico.service;

import com.sistemaacademico.sistema_academico.dto.AsistenciaRequest;
import com.sistemaacademico.sistema_academico.dto.CalificarEntregaRequest;
import com.sistemaacademico.sistema_academico.dto.NotaRequest;
import com.sistemaacademico.sistema_academico.exception.ApiException;
import com.sistemaacademico.sistema_academico.model.*;
import com.sistemaacademico.sistema_academico.repository.*;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Funciones propias del rol Docente: notas, asistencia, material y evaluaciones. */
@Service
public class DocenteService {

    private final MatriculaRepository matriculaRepository;
    private final NotaRepository notaRepository;
    private final AsistenciaRepository asistenciaRepository;
    private final MaterialRepository materialRepository;
    private final EvaluacionRepository evaluacionRepository;
    private final EntregaRepository entregaRepository;
    private final CursoRepository cursoRepository;
    private final AcademicoService academicoService;

    public DocenteService(MatriculaRepository matriculaRepository, NotaRepository notaRepository,
                           AsistenciaRepository asistenciaRepository, MaterialRepository materialRepository,
                           EvaluacionRepository evaluacionRepository, EntregaRepository entregaRepository,
                           CursoRepository cursoRepository, AcademicoService academicoService) {
        this.matriculaRepository = matriculaRepository;
        this.notaRepository = notaRepository;
        this.asistenciaRepository = asistenciaRepository;
        this.materialRepository = materialRepository;
        this.evaluacionRepository = evaluacionRepository;
        this.entregaRepository = entregaRepository;
        this.cursoRepository = cursoRepository;
        this.academicoService = academicoService;
    }

    // ---- Notas ----
    @Transactional
    public Nota registrarNota(NotaRequest req, Long docenteId) {
        Matricula matricula = matriculaRepository.findById(req.matriculaId())
                .orElseThrow(() -> new ApiException("Matricula no encontrada", HttpStatus.NOT_FOUND));
        academicoService.verificarCursoDeDocente(matricula.getCurso().getId(), docenteId);

        Nota nota = new Nota();
        nota.setMatricula(matricula);
        nota.setConcepto(req.concepto());
        nota.setValor(req.valor());
        nota.setComentario(req.comentario());
        return notaRepository.save(nota);
    }

    public List<Nota> notasDeCurso(Long cursoId, Long docenteId) {
        academicoService.verificarCursoDeDocente(cursoId, docenteId);
        List<Long> matriculaIds = matriculaRepository.findByCursoId(cursoId).stream().map(Matricula::getId).toList();
        return notaRepository.findByMatriculaIdIn(matriculaIds);
    }

    // ---- Asistencia ----
    @Transactional
    public Asistencia registrarAsistencia(AsistenciaRequest req, Long docenteId) {
        Matricula matricula = matriculaRepository.findById(req.matriculaId())
                .orElseThrow(() -> new ApiException("Matricula no encontrada", HttpStatus.NOT_FOUND));
        academicoService.verificarCursoDeDocente(matricula.getCurso().getId(), docenteId);

        Asistencia asistencia = new Asistencia();
        asistencia.setMatricula(matricula);
        asistencia.setFecha(req.fecha() != null ? LocalDate.parse(req.fecha()) : LocalDate.now());
        asistencia.setEstado(EstadoAsistencia.valueOf(req.estado()));
        asistencia.setObservacion(req.observacion());
        return asistenciaRepository.save(asistencia);
    }

    public List<Asistencia> asistenciaDeCurso(Long cursoId, Long docenteId) {
        academicoService.verificarCursoDeDocente(cursoId, docenteId);
        return asistenciaRepository.findByMatriculaCursoId(cursoId);
    }

    // ---- Material ----
    @Transactional
    public Material subirMaterial(Long cursoId, Material material, Long docenteId) {
        academicoService.verificarCursoDeDocente(cursoId, docenteId);
        Curso curso = cursoRepository.findById(cursoId).orElseThrow();
        material.setCurso(curso);
        return materialRepository.save(material);
    }

    public List<Material> materialesDeCurso(Long cursoId) {
        return materialRepository.findByCursoId(cursoId);
    }

    // ---- Evaluaciones (tareas / examenes) ----
    @Transactional
    public Evaluacion crearEvaluacion(Long cursoId, Evaluacion evaluacion, Long docenteId) {
        academicoService.verificarCursoDeDocente(cursoId, docenteId);
        Curso curso = cursoRepository.findById(cursoId).orElseThrow();
        evaluacion.setCurso(curso);
        return evaluacionRepository.save(evaluacion);
    }

    public List<Evaluacion> evaluacionesDeCurso(Long cursoId) {
        return evaluacionRepository.findByCursoId(cursoId);
    }

    public List<Entrega> entregasDeEvaluacion(Long evaluacionId, Long docenteId) {
        Evaluacion evaluacion = evaluacionRepository.findById(evaluacionId)
                .orElseThrow(() -> new ApiException("Evaluacion no encontrada", HttpStatus.NOT_FOUND));
        academicoService.verificarCursoDeDocente(evaluacion.getCurso().getId(), docenteId);
        return entregaRepository.findByEvaluacionId(evaluacionId);
    }

    @Transactional
    public Entrega calificarEntrega(Long entregaId, CalificarEntregaRequest req, Long docenteId) {
        Entrega entrega = entregaRepository.findById(entregaId)
                .orElseThrow(() -> new ApiException("Entrega no encontrada", HttpStatus.NOT_FOUND));
        academicoService.verificarCursoDeDocente(entrega.getEvaluacion().getCurso().getId(), docenteId);
        entrega.setNota(req.nota());
        entrega.setComentarioDocente(req.comentarioDocente());
        return entregaRepository.save(entrega);
    }
}
