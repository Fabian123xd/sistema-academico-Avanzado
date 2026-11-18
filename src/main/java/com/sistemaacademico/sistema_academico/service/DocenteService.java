package com.sistemaacademico.sistema_academico.service;

import com.sistemaacademico.sistema_academico.dto.AsistenciaRequest;
import com.sistemaacademico.sistema_academico.dto.CalificarEntregaRequest;
import com.sistemaacademico.sistema_academico.dto.NotaRequest;
import com.sistemaacademico.sistema_academico.exception.ApiException;
import com.sistemaacademico.sistema_academico.model.*;
import com.sistemaacademico.sistema_academico.repository.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
    private final CriterioEvaluacionRepository criterioRepository;

    public DocenteService(MatriculaRepository matriculaRepository, NotaRepository notaRepository,
                           AsistenciaRepository asistenciaRepository, MaterialRepository materialRepository,
                           EvaluacionRepository evaluacionRepository, EntregaRepository entregaRepository,
                           CursoRepository cursoRepository, AcademicoService academicoService,
                           CriterioEvaluacionRepository criterioRepository) {
        this.matriculaRepository = matriculaRepository;
        this.notaRepository = notaRepository;
        this.asistenciaRepository = asistenciaRepository;
        this.materialRepository = materialRepository;
        this.evaluacionRepository = evaluacionRepository;
        this.entregaRepository = entregaRepository;
        this.cursoRepository = cursoRepository;
        this.academicoService = academicoService;
        this.criterioRepository = criterioRepository;
    }

    // ---- Criterios y Ponderaciones de Evaluación ----
    public List<CriterioEvaluacion> listarCriteriosDeCurso(Long cursoId, Long docenteId) {
        academicoService.verificarCursoDeDocente(cursoId, docenteId);
        List<CriterioEvaluacion> lista = criterioRepository.findByCursoIdOrderByOrdenAsc(cursoId);
        if (lista.isEmpty()) {
            return inicializarCriteriosEstandar(cursoId, docenteId);
        }
        return lista;
    }

    public List<CriterioEvaluacion> listarCriteriosDeCursoPublico(Long cursoId) {
        return criterioRepository.findByCursoIdOrderByOrdenAsc(cursoId);
    }

    @Transactional
    public CriterioEvaluacion crearCriterio(Long cursoId, CriterioEvaluacion criterio, Long docenteId) {
        academicoService.verificarCursoDeDocente(cursoId, docenteId);
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new ApiException("Curso no encontrado", HttpStatus.NOT_FOUND));

        List<CriterioEvaluacion> actuales = criterioRepository.findByCursoIdOrderByOrdenAsc(cursoId);
        int sumaActual = actuales.stream().mapToInt(CriterioEvaluacion::getPorcentaje).sum();
        if (sumaActual + criterio.getPorcentaje() > 100) {
            throw new ApiException(
                    "La suma de porcentajes no puede superar el 100%. Porcentaje actual: " + sumaActual + "%, intentando agregar: " + criterio.getPorcentaje() + "%",
                    HttpStatus.BAD_REQUEST
            );
        }

        criterio.setCurso(curso);
        criterio.setOrden(actuales.size() + 1);
        return criterioRepository.save(criterio);
    }

    @Transactional
    public void eliminarCriterio(Long criterioId, Long docenteId) {
        CriterioEvaluacion criterio = criterioRepository.findById(criterioId)
                .orElseThrow(() -> new ApiException("Criterio no encontrado", HttpStatus.NOT_FOUND));
        academicoService.verificarCursoDeDocente(criterio.getCurso().getId(), docenteId);
        criterioRepository.delete(criterio);
    }

    @Transactional
    public List<CriterioEvaluacion> inicializarCriteriosEstandar(Long cursoId, Long docenteId) {
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new ApiException("Curso no encontrado", HttpStatus.NOT_FOUND));

        CriterioEvaluacion c1 = new CriterioEvaluacion(null, curso, "PC", "Prácticas Calificadas", 30, 1);
        CriterioEvaluacion c2 = new CriterioEvaluacion(null, curso, "EP", "Examen Parcial", 30, 2);
        CriterioEvaluacion c3 = new CriterioEvaluacion(null, curso, "EF", "Examen Final", 40, 3);
        return criterioRepository.saveAll(List.of(c1, c2, c3));
    }

    // ---- Notas ----
    @Transactional
    public Nota registrarNota(NotaRequest req, Long docenteId) {
        Matricula matricula = matriculaRepository.findById(req.matriculaId())
                .orElseThrow(() -> new ApiException("Matricula no encontrada", HttpStatus.NOT_FOUND));
        academicoService.verificarCursoDeDocente(matricula.getCurso().getId(), docenteId);

        if (req.valor() != null && (req.valor() < 0 || req.valor() > 20)) {
            throw new ApiException("La calificación debe estar en la escala de 0 a 20", HttpStatus.BAD_REQUEST);
        }

        Nota nota = new Nota();
        nota.setMatricula(matricula);
        nota.setValor(req.valor());
        nota.setComentario(req.comentario());

        if (req.criterioId() != null) {
            CriterioEvaluacion criterio = criterioRepository.findById(req.criterioId())
                    .orElseThrow(() -> new ApiException("Criterio de evaluación no encontrado", HttpStatus.NOT_FOUND));
            nota.setCriterio(criterio);
            nota.setConcepto(req.concepto() != null && !req.concepto().isBlank() ? req.concepto() : criterio.getNombre());
        } else {
            nota.setConcepto(req.concepto());
        }

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

    // ---- Acta de Calificaciones y Promedios Ponderados ----
    public Map<String, Object> obtenerActaCurso(Long cursoId, Long docenteId) {
        academicoService.verificarCursoDeDocente(cursoId, docenteId);
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new ApiException("Curso no encontrado", HttpStatus.NOT_FOUND));

        List<CriterioEvaluacion> criterios = criterioRepository.findByCursoIdOrderByOrdenAsc(cursoId);
        if (criterios.isEmpty()) {
            criterios = inicializarCriteriosEstandar(cursoId, docenteId);
        }

        List<Matricula> matriculas = matriculaRepository.findByCursoId(cursoId);
        List<Long> matriculaIds = matriculas.stream().map(Matricula::getId).toList();
        List<Nota> todasLasNotas = matriculaIds.isEmpty() ? List.of() : notaRepository.findByMatriculaIdIn(matriculaIds);

        List<Map<String, Object>> filas = new ArrayList<>();
        boolean actaCerrada = false;
        LocalDateTime fechaCierre = null;

        for (Matricula m : matriculas) {
            Map<String, Object> fila = new HashMap<>();
            fila.put("matriculaId", m.getId());
            fila.put("estudianteId", m.getEstudiante().getId());
            fila.put("estudianteCodigo", m.getEstudiante().getUsuario() != null ? m.getEstudiante().getUsuario().getCodigo() : "—");
            fila.put("estudianteNombre", m.getEstudiante().getUsuario() != null 
                    ? m.getEstudiante().getUsuario().getNombres() + " " + m.getEstudiante().getUsuario().getApellidos()
                    : "—");
            fila.put("estado", m.getEstado().name());
            fila.put("promedioFinal", m.getPromedioFinal());
            fila.put("fechaCierre", m.getFechaCierre());

            if (m.getFechaCierre() != null) {
                actaCerrada = true;
                fechaCierre = m.getFechaCierre();
            }

            List<Nota> notasAlumno = todasLasNotas.stream()
                    .filter(n -> n.getMatricula().getId().equals(m.getId()))
                    .toList();

            Map<String, Double> notasPorCriterio = new HashMap<>();
            double sumaPonderada = 0.0;

            for (CriterioEvaluacion c : criterios) {
                List<Nota> notasCriterio = notasAlumno.stream()
                        .filter(n -> (n.getCriterio() != null && n.getCriterio().getId().equals(c.getId()))
                                || (n.getCriterio() == null && n.getConcepto() != null && n.getConcepto().toLowerCase().contains(c.getCodigo().toLowerCase())))
                        .toList();

                if (!notasCriterio.isEmpty()) {
                    double promedioCriterio = notasCriterio.stream()
                            .mapToDouble(Nota::getValor)
                            .average()
                            .orElse(0.0);
                    promedioCriterio = Math.round(promedioCriterio * 10.0) / 10.0;
                    notasPorCriterio.put(c.getCodigo(), promedioCriterio);
                    sumaPonderada += promedioCriterio * (c.getPorcentaje() / 100.0);
                } else {
                    notasPorCriterio.put(c.getCodigo(), null);
                }
            }

            fila.put("notasPorCriterio", notasPorCriterio);

            double promedioCalculado = Math.round(sumaPonderada * 10.0) / 10.0;
            fila.put("promedioCalculado", promedioCalculado);
            filas.add(fila);
        }

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("cursoId", curso.getId());
        respuesta.put("cursoNombre", curso.getNombre());
        respuesta.put("cursoCodigo", curso.getCodigo());
        respuesta.put("criterios", criterios);
        respuesta.put("filas", filas);
        respuesta.put("actaCerrada", actaCerrada);
        respuesta.put("fechaCierre", fechaCierre);
        return respuesta;
    }

    @Transactional
    public Map<String, Object> cerrarActaCurso(Long cursoId, Long docenteId) {
        academicoService.verificarCursoDeDocente(cursoId, docenteId);
        Map<String, Object> acta = obtenerActaCurso(cursoId, docenteId);
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> filas = (List<Map<String, Object>>) acta.get("filas");

        LocalDateTime ahora = LocalDateTime.now();

        for (Map<String, Object> fila : filas) {
            Long matriculaId = (Long) fila.get("matriculaId");
            Double promedio = (Double) fila.get("promedioCalculado");

            Matricula matricula = matriculaRepository.findById(matriculaId)
                    .orElseThrow(() -> new ApiException("Matricula no encontrada", HttpStatus.NOT_FOUND));

            if (matricula.getEstado() != EstadoMatricula.RETIRADO) {
                matricula.setPromedioFinal(promedio != null ? promedio : 0.0);
                matricula.setEstado((promedio != null && promedio >= 10.5) ? EstadoMatricula.APROBADO : EstadoMatricula.DESAPROBADO);
                matricula.setFechaCierre(ahora);
                matriculaRepository.save(matricula);
            }
        }

        return obtenerActaCurso(cursoId, docenteId);
    }
}
