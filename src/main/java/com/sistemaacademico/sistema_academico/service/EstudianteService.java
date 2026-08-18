package com.sistemaacademico.sistema_academico.service;

import com.sistemaacademico.sistema_academico.dto.EntregaRequest;
import com.sistemaacademico.sistema_academico.exception.ApiException;
import com.sistemaacademico.sistema_academico.model.*;
import com.sistemaacademico.sistema_academico.repository.*;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Funciones propias del rol Estudiante: horario, notas, entregas, examenes e historial. */
@Service
public class EstudianteService {

    private final MatriculaRepository matriculaRepository;
    private final NotaRepository notaRepository;
    private final AsistenciaRepository asistenciaRepository;
    private final HorarioRepository horarioRepository;
    private final EvaluacionRepository evaluacionRepository;
    private final EntregaRepository entregaRepository;
    private final EstudianteRepository estudianteRepository;

    public EstudianteService(MatriculaRepository matriculaRepository, NotaRepository notaRepository,
                              AsistenciaRepository asistenciaRepository, HorarioRepository horarioRepository,
                              EvaluacionRepository evaluacionRepository, EntregaRepository entregaRepository,
                              EstudianteRepository estudianteRepository) {
        this.matriculaRepository = matriculaRepository;
        this.notaRepository = notaRepository;
        this.asistenciaRepository = asistenciaRepository;
        this.horarioRepository = horarioRepository;
        this.evaluacionRepository = evaluacionRepository;
        this.entregaRepository = entregaRepository;
        this.estudianteRepository = estudianteRepository;
    }

    public List<Matricula> misCursos(Long estudianteId) {
        return matriculaRepository.findByEstudianteId(estudianteId);
    }

    public List<Horario> miHorario(Long estudianteId) {
        List<Long> cursoIds = misCursos(estudianteId).stream().map(m -> m.getCurso().getId()).toList();
        return horarioRepository.findByCursoIdIn(cursoIds);
    }

    public List<Nota> misNotas(Long estudianteId) {
        List<Long> matriculaIds = misCursos(estudianteId).stream().map(Matricula::getId).toList();
        return notaRepository.findByMatriculaIdIn(matriculaIds);
    }

    /** Historial academico: matriculas con su estado, util para cursos completados/retirados. */
    public List<Matricula> historial(Long estudianteId) {
        return matriculaRepository.findByEstudianteId(estudianteId);
    }

    public List<Evaluacion> evaluacionesDisponibles(Long estudianteId) {
        List<Long> cursoIds = misCursos(estudianteId).stream().map(m -> m.getCurso().getId()).toList();
        return evaluacionRepository.findByCursoIdIn(cursoIds);
    }

    @Transactional
    public Entrega entregar(EntregaRequest req, Long estudianteId) {
        entregaRepository.findByEvaluacionIdAndEstudianteId(req.evaluacionId(), estudianteId).ifPresent(e -> {
            throw new ApiException("Ya registraste una entrega para esta evaluacion", HttpStatus.CONFLICT);
        });
        Evaluacion evaluacion = evaluacionRepository.findById(req.evaluacionId())
                .orElseThrow(() -> new ApiException("Evaluacion no encontrada", HttpStatus.NOT_FOUND));

        boolean matriculado = matriculaRepository.findByEstudianteId(estudianteId).stream()
                .anyMatch(m -> m.getCurso().getId().equals(evaluacion.getCurso().getId()));
        if (!matriculado) {
            throw new ApiException("No estas matriculado en el curso de esta evaluacion", HttpStatus.FORBIDDEN);
        }

        Estudiante estudiante = estudianteRepository.getReferenceById(estudianteId);

        Entrega entrega = new Entrega();
        entrega.setEvaluacion(evaluacion);
        entrega.setEstudiante(estudiante);
        entrega.setContenido(req.contenido());
        return entregaRepository.save(entrega);
    }

    public List<Entrega> misEntregas(Long estudianteId) {
        return entregaRepository.findByEstudianteId(estudianteId);
    }
}
