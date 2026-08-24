import api from './api'

export default {
  misCursos: () => api.get('/docente/cursos').then(r => r.data),
  matriculasDeCurso: (cursoId) => api.get(`/docente/cursos/${cursoId}/matriculas`).then(r => r.data),

  registrarNota: (data) => api.post('/docente/notas', data).then(r => r.data),
  notasDeCurso: (cursoId) => api.get(`/docente/cursos/${cursoId}/notas`).then(r => r.data),

  registrarAsistencia: (data) => api.post('/docente/asistencia', data).then(r => r.data),
  asistenciaDeCurso: (cursoId) => api.get(`/docente/cursos/${cursoId}/asistencia`).then(r => r.data),

  subirMaterial: (cursoId, data) => api.post(`/docente/cursos/${cursoId}/materiales`, data).then(r => r.data),
  materialesDeCurso: (cursoId) => api.get(`/docente/cursos/${cursoId}/materiales`).then(r => r.data),

  crearEvaluacion: (cursoId, data) => api.post(`/docente/cursos/${cursoId}/evaluaciones`, data).then(r => r.data),
  evaluacionesDeCurso: (cursoId) => api.get(`/docente/cursos/${cursoId}/evaluaciones`).then(r => r.data),
  entregasDeEvaluacion: (evaluacionId) => api.get(`/docente/evaluaciones/${evaluacionId}/entregas`).then(r => r.data),
  calificarEntrega: (entregaId, data) => api.patch(`/docente/entregas/${entregaId}/calificar`, data).then(r => r.data),
}
