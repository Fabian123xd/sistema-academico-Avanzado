package com.sistemaacademico.sistema_academico.service;
 
import com.sistemaacademico.sistema_academico.dto.MatricularRequest;
import com.sistemaacademico.sistema_academico.exception.ApiException;
import com.sistemaacademico.sistema_academico.model.*;
import com.sistemaacademico.sistema_academico.repository.*;
import java.util.List;
import java.util.Map;
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
    private final CarreraRepository carreraRepository;

    public AcademicoService(PeriodoAcademicoRepository periodoRepository, CursoRepository cursoRepository,
                             DocenteRepository docenteRepository, EstudianteRepository estudianteRepository,
                             MatriculaRepository matriculaRepository, HorarioRepository horarioRepository,
                             CarreraRepository carreraRepository) {
        this.periodoRepository = periodoRepository;
        this.cursoRepository = cursoRepository;
        this.docenteRepository = docenteRepository;
        this.estudianteRepository = estudianteRepository;
        this.matriculaRepository = matriculaRepository;
        this.horarioRepository = horarioRepository;
        this.carreraRepository = carreraRepository;
    }

    // ---- Carreras y Malla Curricular ----
    @Transactional
    public Carrera crearCarrera(Carrera carrera) {
        if (carreraRepository.findByCodigo(carrera.getCodigo()).isPresent()) {
            throw new ApiException("Ya existe una carrera con el código: " + carrera.getCodigo(), HttpStatus.CONFLICT);
        }
        return carreraRepository.save(carrera);
    }

    public List<Carrera> listarCarreras() {
        return carreraRepository.findAll();
    }

    public Carrera obtenerCarrera(Long id) {
        return carreraRepository.findById(id)
                .orElseThrow(() -> new ApiException("Carrera no encontrada", HttpStatus.NOT_FOUND));
    }

    public List<Curso> listarCursosPorCarrera(Long carreraId) {
        return cursoRepository.findByCarreraId(carreraId);
    }

    public List<Curso> listarCursosPorCarreraYCiclo(Long carreraId, Integer ciclo) {
        return cursoRepository.findByCarreraIdAndCiclo(carreraId, ciclo);
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
        return crearCurso(curso, docenteId, periodoId, null, 1, TipoCurso.OBLIGATORIO, 30);
    }

    @Transactional
    public Curso crearCurso(Curso curso, Long docenteId, Long periodoId, Long carreraId, Integer ciclo, TipoCurso tipo) {
        return crearCurso(curso, docenteId, periodoId, carreraId, ciclo, tipo, 30);
    }

    @Transactional
    public Curso crearCurso(Curso curso, Long docenteId, Long periodoId, Long carreraId, Integer ciclo, TipoCurso tipo, Integer capacidadMaxima) {
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
        if (carreraId != null) {
            Carrera carrera = carreraRepository.findById(carreraId)
                    .orElseThrow(() -> new ApiException("Carrera no encontrada", HttpStatus.NOT_FOUND));
            curso.setCarrera(carrera);
        }
        if (ciclo != null && ciclo >= 1) {
            curso.setCiclo(ciclo);
        }
        if (tipo != null) {
            curso.setTipo(tipo);
        }
        curso.setCapacidadMaxima(capacidadMaxima != null && capacidadMaxima > 0 ? capacidadMaxima : 30);
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

    // ---- Prerrequisitos de Cursos ----
    @Transactional
    public Curso asignarPrerrequisito(Long cursoId, Long prerrequisitoId) {
        if (cursoId.equals(prerrequisitoId)) {
            throw new ApiException("Un curso no puede ser prerrequisito de sí mismo", HttpStatus.BAD_REQUEST);
        }
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new ApiException("Curso no encontrado", HttpStatus.NOT_FOUND));
        Curso prerrequisito = cursoRepository.findById(prerrequisitoId)
                .orElseThrow(() -> new ApiException("Curso prerrequisito no encontrado", HttpStatus.NOT_FOUND));

        curso.getPrerrequisitos().add(prerrequisito);
        return cursoRepository.save(curso);
    }

    @Transactional
    public Curso eliminarPrerrequisito(Long cursoId, Long prerrequisitoId) {
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new ApiException("Curso no encontrado", HttpStatus.NOT_FOUND));
        curso.getPrerrequisitos().removeIf(p -> p.getId().equals(prerrequisitoId));
        return cursoRepository.save(curso);
    }

    public List<Curso> listarPrerrequisitos(Long cursoId) {
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new ApiException("Curso no encontrado", HttpStatus.NOT_FOUND));
        return List.copyOf(curso.getPrerrequisitos());
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

        // Validar cupo máximo y vacantes disponibles
        long inscritosActivos = matriculaRepository.countByCursoIdAndEstadoNot(curso.getId(), EstadoMatricula.RETIRADO);
        int capacidad = curso.getCapacidadMaxima() != null ? curso.getCapacidadMaxima() : 30;
        if (inscritosActivos >= capacidad) {
            throw new ApiException(
                    "No hay vacantes disponibles en este curso. Capacidad máxima alcanzada (" + inscritosActivos + "/" + capacidad + ")",
                    HttpStatus.CONFLICT
            );
        }

        // Validar cumplimiento de prerrequisitos
        validarPrerrequisitos(estudiante.getId(), curso);

        // Validar ausencia de cruce de horario con otros cursos del estudiante
        validarCruceHorarios(estudiante.getId(), curso);

        Matricula matricula = new Matricula();
        matricula.setEstudiante(estudiante);
        matricula.setCurso(curso);
        matricula.setEstado(EstadoMatricula.INSCRITO);
        return matriculaRepository.save(matricula);
    }

    public Map<String, Object> verificarCruceHorario(Long usuarioEstudianteId, Long cursoId) {
        Estudiante estudiante = estudianteRepository.findByUsuarioId(usuarioEstudianteId)
                .orElseThrow(() -> new ApiException("Estudiante no encontrado", HttpStatus.NOT_FOUND));
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new ApiException("Curso no encontrado", HttpStatus.NOT_FOUND));

        try {
            validarCruceHorarios(estudiante.getId(), curso);
            return Map.of("hayCruce", false, "mensaje", "Sin cruce de horarios");
        } catch (ApiException e) {
            return Map.of("hayCruce", true, "mensaje", e.getMessage());
        }
    }

    private void validarCruceHorarios(Long estudianteId, Curso cursoNuevo) {
        List<Horario> horariosNuevo = horarioRepository.findByCursoId(cursoNuevo.getId());
        if (horariosNuevo == null || horariosNuevo.isEmpty()) {
            return;
        }

        List<Matricula> matriculasActivas = matriculaRepository.findByEstudianteId(estudianteId).stream()
                .filter(m -> m.getEstado() != EstadoMatricula.RETIRADO)
                .filter(m -> {
                    if (cursoNuevo.getPeriodo() == null || m.getCurso().getPeriodo() == null) {
                        return true;
                    }
                    return m.getCurso().getPeriodo().getId().equals(cursoNuevo.getPeriodo().getId());
                })
                .toList();

        if (matriculasActivas.isEmpty()) {
            return;
        }

        List<Long> cursoIdsActivos = matriculasActivas.stream().map(m -> m.getCurso().getId()).toList();
        List<Horario> horariosExistentes = horarioRepository.findByCursoIdIn(cursoIdsActivos);

        for (Horario hn : horariosNuevo) {
            for (Horario he : horariosExistentes) {
                if (hn.getDiaSemana() != null && he.getDiaSemana() != null
                        && hn.getDiaSemana().trim().equalsIgnoreCase(he.getDiaSemana().trim())) {

                    if (hn.getHoraInicio() != null && hn.getHoraFin() != null
                            && he.getHoraInicio() != null && he.getHoraFin() != null) {

                        boolean seSolapan = hn.getHoraInicio().isBefore(he.getHoraFin())
                                && he.getHoraInicio().isBefore(hn.getHoraFin());

                        if (seSolapan) {
                            throw new ApiException(
                                    "Cruce de horario detectado el día " + hn.getDiaSemana().toUpperCase()
                                            + " (" + hn.getHoraInicio() + " - " + hn.getHoraFin() + ")"
                                            + " con el curso ya matriculado: '" + he.getCurso().getNombre()
                                            + "' (" + he.getHoraInicio() + " - " + he.getHoraFin() + ")",
                                    HttpStatus.CONFLICT
                            );
                        }
                    }
                }
            }
        }
    }

    public Map<String, Object> obtenerVacantes(Long cursoId) {
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new ApiException("Curso no encontrado", HttpStatus.NOT_FOUND));
        long inscritos = matriculaRepository.countByCursoIdAndEstadoNot(cursoId, EstadoMatricula.RETIRADO);
        long capacidad = curso.getCapacidadMaxima() != null ? curso.getCapacidadMaxima() : 30;
        long disponibles = Math.max(0, capacidad - inscritos);

        return Map.of(
                "cursoId", cursoId,
                "cursoCodigo", curso.getCodigo(),
                "cursoNombre", curso.getNombre(),
                "capacidadMaxima", capacidad,
                "inscritos", inscritos,
                "vacantesDisponibles", disponibles,
                "disponible", disponibles > 0
        );
    }

    private void validarPrerrequisitos(Long estudianteId, Curso curso) {
        if (curso.getPrerrequisitos() == null || curso.getPrerrequisitos().isEmpty()) {
            return;
        }

        List<Matricula> matriculasEstudiante = matriculaRepository.findByEstudianteId(estudianteId);
        for (Curso prereq : curso.getPrerrequisitos()) {
            boolean aprobado = matriculasEstudiante.stream()
                    .anyMatch(m -> m.getCurso().getId().equals(prereq.getId()) &&
                            (m.getEstado() == EstadoMatricula.APROBADO || m.getEstado() == EstadoMatricula.COMPLETADO));

            if (!aprobado) {
                throw new ApiException(
                        "No cumples con el prerrequisito obligatorio: debes aprobar previamente el curso '" 
                        + prereq.getNombre() + "' (" + prereq.getCodigo() + ")",
                        HttpStatus.BAD_REQUEST
                );
            }
        }
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
 