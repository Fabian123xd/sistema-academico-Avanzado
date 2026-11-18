package com.sistemaacademico.sistema_academico.service;

import com.sistemaacademico.sistema_academico.dto.EntregaRequest;
import com.sistemaacademico.sistema_academico.exception.ApiException;
import com.sistemaacademico.sistema_academico.model.*;
import com.sistemaacademico.sistema_academico.repository.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Funciones propias del rol Estudiante: horario, notas, entregas, examenes, historial y rendimiento academico. */
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

    /**
     * Calcula el Promedio Ponderado Acumulado (PPA), creditos aprobados, y puesto en la carrera.
     */
    public Map<String, Object> obtenerRendimientoEstudiante(Long estudianteId) {
        Estudiante estudiante = estudianteRepository.findById(estudianteId)
                .orElseThrow(() -> new ApiException("Estudiante no encontrado", HttpStatus.NOT_FOUND));

        List<Matricula> matriculas = matriculaRepository.findByEstudianteId(estudianteId);

        int creditosInscritos = 0;
        int creditosAprobados = 0;
        int cursosAprobados = 0;
        int cursosDesaprobados = 0;
        int cursosEnCurso = 0;

        double sumaPonderada = 0.0;
        int sumaCreditosPonderados = 0;

        for (Matricula m : matriculas) {
            Curso c = m.getCurso();
            int cred = (c != null && c.getCreditos() != null && c.getCreditos() > 0) ? c.getCreditos() : 3;
            creditosInscritos += cred;

            Double notaFinal = m.getPromedioFinal();
            if (notaFinal == null) {
                List<Nota> notasMat = notaRepository.findByMatriculaId(m.getId());
                if (!notasMat.isEmpty()) {
                    double avg = notasMat.stream().mapToDouble(Nota::getValor).average().orElse(0.0);
                    notaFinal = Math.round(avg * 10.0) / 10.0;
                }
            }

            if (notaFinal != null) {
                sumaPonderada += notaFinal * cred;
                sumaCreditosPonderados += cred;

                if (notaFinal >= 10.5 || m.getEstado() == EstadoMatricula.APROBADO) {
                    creditosAprobados += cred;
                    cursosAprobados++;
                } else if (m.getEstado() == EstadoMatricula.DESAPROBADO || (m.getEstado() != EstadoMatricula.RETIRADO && notaFinal < 10.5 && m.getFechaCierre() != null)) {
                    cursosDesaprobados++;
                } else {
                    cursosEnCurso++;
                }
            } else {
                cursosEnCurso++;
            }
        }

        double ppa = sumaCreditosPonderados > 0 
                ? Math.round((sumaPonderada / sumaCreditosPonderados) * 100.0) / 100.0 
                : 0.0;

        Long carreraId = estudiante.getCarrera() != null ? estudiante.getCarrera().getId() : null;
        List<Map<String, Object>> cuadro = generarCuadroMerito(carreraId);

        int puesto = 1;
        int totalEstudiantes = cuadro.size();
        String distincion = "REGULAR";

        for (Map<String, Object> item : cuadro) {
            if (estudianteId.equals(item.get("estudianteId"))) {
                puesto = (Integer) item.get("puesto");
                distincion = (String) item.get("distincion");
                break;
            }
        }

        Map<String, Object> res = new HashMap<>();
        res.put("estudianteId", estudiante.getId());
        res.put("codigo", estudiante.getUsuario() != null ? estudiante.getUsuario().getCodigo() : "—");
        res.put("nombreCompleto", estudiante.getUsuario() != null 
                ? estudiante.getUsuario().getNombres() + " " + estudiante.getUsuario().getApellidos() 
                : "—");
        res.put("carrera", estudiante.getCarrera() != null ? estudiante.getCarrera().getNombre() : "General");
        res.put("carreraId", carreraId);
        res.put("ppa", ppa);
        res.put("creditosInscritos", creditosInscritos);
        res.put("creditosAprobados", creditosAprobados);
        res.put("cursosAprobados", cursosAprobados);
        res.put("cursosDesaprobados", cursosDesaprobados);
        res.put("cursosEnCurso", cursosEnCurso);
        res.put("puesto", puesto);
        res.put("totalEstudiantesCarrera", totalEstudiantes);
        res.put("distincion", distincion);

        return res;
    }

    /**
     * Genera el cuadro de honor y orden de merito ordenado por PPA descendente.
     */
    public List<Map<String, Object>> generarCuadroMerito(Long carreraId) {
        List<Estudiante> estudiantes;
        if (carreraId != null) {
            estudiantes = estudianteRepository.findByCarreraId(carreraId);
        } else {
            estudiantes = estudianteRepository.findAll();
        }

        List<Map<String, Object>> lista = new ArrayList<>();

        for (Estudiante est : estudiantes) {
            List<Matricula> matriculas = matriculaRepository.findByEstudianteId(est.getId());

            int creditosAprobados = 0;
            double sumaPonderada = 0.0;
            int sumaCreditosPonderados = 0;

            for (Matricula m : matriculas) {
                Curso c = m.getCurso();
                int cred = (c != null && c.getCreditos() != null && c.getCreditos() > 0) ? c.getCreditos() : 3;

                Double notaFinal = m.getPromedioFinal();
                if (notaFinal == null) {
                    List<Nota> notasMat = notaRepository.findByMatriculaId(m.getId());
                    if (!notasMat.isEmpty()) {
                        double avg = notasMat.stream().mapToDouble(Nota::getValor).average().orElse(0.0);
                        notaFinal = Math.round(avg * 10.0) / 10.0;
                    }
                }

                if (notaFinal != null) {
                    sumaPonderada += notaFinal * cred;
                    sumaCreditosPonderados += cred;
                    if (notaFinal >= 10.5 || m.getEstado() == EstadoMatricula.APROBADO) {
                        creditosAprobados += cred;
                    }
                }
            }

            double ppa = sumaCreditosPonderados > 0 
                    ? Math.round((sumaPonderada / sumaCreditosPonderados) * 100.0) / 100.0 
                    : 0.0;

            Map<String, Object> item = new HashMap<>();
            item.put("estudianteId", est.getId());
            item.put("codigo", est.getUsuario() != null ? est.getUsuario().getCodigo() : "—");
            item.put("nombreCompleto", est.getUsuario() != null 
                    ? est.getUsuario().getNombres() + " " + est.getUsuario().getApellidos() 
                    : "—");
            item.put("carrera", est.getCarrera() != null ? est.getCarrera().getNombre() : "General");
            item.put("carreraId", est.getCarrera() != null ? est.getCarrera().getId() : null);
            item.put("ppa", ppa);
            item.put("creditosAprobados", creditosAprobados);
            item.put("totalMatriculas", matriculas.size());
            lista.add(item);
        }

        // Ordenar por PPA descendente, luego creditos aprobados desc
        lista.sort((a, b) -> {
            Double ppaB = (Double) b.get("ppa");
            Double ppaA = (Double) a.get("ppa");
            int cmp = ppaB.compareTo(ppaA);
            if (cmp != 0) return cmp;
            Integer credB = (Integer) b.get("creditosAprobados");
            Integer credA = (Integer) a.get("creditosAprobados");
            return credB.compareTo(credA);
        });

        int total = lista.size();
        for (int i = 0; i < total; i++) {
            Map<String, Object> item = lista.get(i);
            int puesto = i + 1;
            item.put("puesto", puesto);

            Double ppa = (Double) item.get("ppa");
            String distincion = "REGULAR";
            if (ppa > 0.0) {
                double percentil = (double) puesto / total;
                if (puesto == 1 || percentil <= 0.10) {
                    distincion = "DÉCIMO SUPERIOR";
                } else if (percentil <= 0.20) {
                    distincion = "QUINTO SUPERIOR";
                } else if (percentil <= 0.3334) {
                    distincion = "TERCIO SUPERIOR";
                }
            }
            item.put("distincion", distincion);
        }

        return lista;
    }
}
