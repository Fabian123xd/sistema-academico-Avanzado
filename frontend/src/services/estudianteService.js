import api from './api'

export default {
  misCursos: () => api.get('/estudiante/cursos').then(r => r.data),
  miHorario: () => api.get('/estudiante/horario').then(r => r.data),
  misNotas: () => api.get('/estudiante/notas').then(r => r.data),
  historial: () => api.get('/estudiante/historial').then(r => r.data),
  evaluacionesDisponibles: () => api.get('/estudiante/evaluaciones').then(r => r.data),
  entregar: (evaluacionId, contenido) => api.post('/estudiante/entregas', { evaluacionId, contenido }).then(r => r.data),
  misEntregas: () => api.get('/estudiante/entregas').then(r => r.data),
}
