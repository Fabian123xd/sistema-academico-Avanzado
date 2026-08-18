package com.sistemaacademico.sistema_academico.service;
 
import com.sistemaacademico.sistema_academico.dto.MatricularRequest;
import com.sistemaacademico.sistema_academico.exception.ApiException;
import com.sistemaacademico.sistema_academico.model.*;
import com.sistemaacademico.sistema_academico.repository.*;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
 
/**
 * Operaciones academicas administrativas: periodos, cursos, asignacion de
 * docentes y matriculas de estudiantes. Usado por el Administrador.
 */
@Service
public class AcademicoService {
 
    private final PeriodoAcademicoRepository periodoRepository;
    private final CursoRepository cursoRepository;
    private final DocenteRepository docenteRepository;
    private final EstudianteRepository estudianteRepository;
    private final MatriculaRepository matriculaRepository;
    private final HorarioRepository horarioRepository;
 
    public AcademicoService(PeriodoAcademicoRepository periodoRepository, CursoRepository cursoRepository,
                             DocenteRepository docenteRepository, EstudianteRepository estudianteRepository,
                             MatriculaRepository matriculaRepository, HorarioRepository horarioRepository) {
        this.periodoRepository = periodoRepository;
        this.cursoRepository = cursoRepository;
        this.docenteRepository = docenteRepository;
        this.estudianteRepository = estudianteRepository;
        this.matriculaRepository = matriculaRepository;
        this.horarioRepository = horarioRepository;
    }
 
    // ---- Periodos ----
    public PeriodoAcademico crearPeriodo(PeriodoAcademico periodo) {
        return periodoRepository.save(periodo);
    }
 
    public List<PeriodoAcademico> listarPeriodos() {
        return periodoRepository.findAll();
    }
 
    // ---- Cursos ----
    @Transactional
    public Curso crearCurso(Curso curso, Long docenteId, Long periodoId) {
        if (docenteId != null) {
            Docente docente = docenteRepository.findByUsuarioId(docenteId)
                    .orElseThrow(() -> new ApiException("Docente no encontrado", HttpStatus.NOT_FOUND));
            curso.setDocente(docente);
        }
        if (periodoId != null) {
            PeriodoAcademico periodo = periodoRepository.findById(periodoId)
                    .orElseThrow(() -> new ApiException("Periodo no encontrado", HttpStatus.NOT_FOUND));
            curso.setPeriodo(periodo);
        }
        return cursoRepository.save(curso);
    }
 
    @Transactional
    public Curso asignarDocente(Long cursoId, Long docenteId) {
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new ApiException("Curso no encontrado", HttpStatus.NOT_FOUND));
        Docente docente = docenteRepository.findByUsuarioId(docenteId)
                .orElseThrow(() -> new ApiException("Docente no encontrado", HttpStatus.NOT_FOUND));
        curso.setDocente(docente);
        return cursoRepository.save(curso);
    }
 
    public List<Curso> listarCursos() {
        return cursoRepository.findAll();
    }
 
    public List<Curso> listarCursosPorDocente(Long docenteId) {
        return cursoRepository.findByDocenteId(docenteId);
    }
 
    // ---- Horarios ----
    public Horario crearHorario(Long cursoId, Horario horario) {
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new ApiException("Curso no encontrado", HttpStatus.NOT_FOUND));
        horario.setCurso(curso);
        return horarioRepository.save(horario);
    }
 
    public List<Horario> horariosDeCursos(List<Long> cursoIds) {
        return horarioRepository.findByCursoIdIn(cursoIds);
    }
 
    // ---- Matriculas ----
    @Transactional
    public Matricula matricular(MatricularRequest req) {
        Estudiante estudiante = estudianteRepository.findByUsuarioId(req.estudianteId())
                .orElseThrow(() -> new ApiException("Estudiante no encontrado", HttpStatus.NOT_FOUND));
        Curso curso = cursoRepository.findById(req.cursoId())
                .orElseThrow(() -> new ApiException("Curso no encontrado", HttpStatus.NOT_FOUND));
 
        matriculaRepository.findByEstudianteIdAndCursoId(estudiante.getId(), curso.getId()).ifPresent(m -> {
            throw new ApiException("El estudiante ya esta matriculado en este curso", HttpStatus.CONFLICT);
        });
 
        Matricula matricula = new Matricula();
        matricula.setEstudiante(estudiante);
        matricula.setCurso(curso);
        matricula.setEstado(EstadoMatricula.INSCRITO);
        return matriculaRepository.save(matricula);
    }
 
    public List<Matricula> matriculasDeEstudiante(Long estudianteId) {
        return matriculaRepository.findByEstudianteId(estudianteId);
    }
 
    public List<Matricula> matriculasDeCurso(Long cursoId) {
        return matriculaRepository.findByCursoId(cursoId);
    }
 
    public Estudiante estudiantePorUsuarioEmail(String email) {
        return estudianteRepository.findByUsuarioEmail(email)
                .orElseThrow(() -> new ApiException("Perfil de estudiante no encontrado", HttpStatus.NOT_FOUND));
    }
 
    public Docente docentePorUsuarioEmail(String email) {
        return docenteRepository.findByUsuarioEmail(email)
                .orElseThrow(() -> new ApiException("Perfil de docente no encontrado", HttpStatus.NOT_FOUND));
    }
 
    public Curso obtenerCurso(Long cursoId) {
        return cursoRepository.findById(cursoId)
                .orElseThrow(() -> new ApiException("Curso no encontrado", HttpStatus.NOT_FOUND));
    }
 
    /** Verifica que el curso pertenezca al docente autenticado; lanza 403 si no. */
    public void verificarCursoDeDocente(Long cursoId, Long docenteId) {
        Curso curso = obtenerCurso(cursoId);
        if (curso.getDocente() == null || !curso.getDocente().getId().equals(docenteId)) {
            throw new ApiException("No tienes permiso sobre este curso", HttpStatus.FORBIDDEN);
        }
    }
}
 