import api from './api'

export default {
  // Usuarios
  crearDocente: (data) => api.post('/admin/usuarios/docentes', data).then(r => r.data),
  crearEstudiante: (data) => api.post('/admin/usuarios/estudiantes', data).then(r => r.data),
  listarDocentes: () => api.get('/admin/usuarios/docentes').then(r => r.data),
  listarEstudiantes: () => api.get('/admin/usuarios/estudiantes').then(r => r.data),
  cambiarEstado: (id, activo) => api.patch(`/admin/usuarios/${id}/estado?activo=${activo}`).then(r => r.data),
  eliminarUsuario: (id) => api.delete(`/admin/usuarios/${id}`).then(r => r.data),

  // Carreras
  crearCarrera: (data) => api.post('/admin/carreras', data).then(r => r.data),
  listarCarreras: () => api.get('/admin/carreras').then(r => r.data),
  cursosDeCarrera: (carreraId, ciclo) => api.get(`/admin/carreras/${carreraId}/cursos${ciclo ? `?ciclo=${ciclo}` : ''}`).then(r => r.data),

  // Periodos
  crearPeriodo: (data) => api.post('/admin/periodos', data).then(r => r.data),
  listarPeriodos: () => api.get('/admin/periodos').then(r => r.data),

  // Cursos
  crearCurso: (data) => api.post('/admin/cursos', data).then(r => r.data),
  listarCursos: () => api.get('/admin/cursos').then(r => r.data),
  asignarDocente: (cursoId, docenteId) => api.patch(`/admin/cursos/${cursoId}/docente?docenteId=${docenteId}`).then(r => r.data),
  crearHorario: (cursoId, data) => api.post(`/admin/cursos/${cursoId}/horarios`, data).then(r => r.data),
  vacantesDeCurso: (cursoId) => api.get(`/admin/cursos/${cursoId}/vacantes`).then(r => r.data),
  agregarPrerrequisito: (cursoId, prerrequisitoId) => api.post(`/admin/cursos/${cursoId}/prerrequisitos?prerrequisitoId=${prerrequisitoId}`).then(r => r.data),
  eliminarPrerrequisito: (cursoId, prerrequisitoId) => api.delete(`/admin/cursos/${cursoId}/prerrequisitos/${prerrequisitoId}`).then(r => r.data),
  listarPrerrequisitos: (cursoId) => api.get(`/admin/cursos/${cursoId}/prerrequisitos`).then(r => r.data),

  // Matriculas
  matricular: (estudianteId, cursoId) => api.post('/admin/matriculas', { estudianteId, cursoId }).then(r => r.data),
  matriculasDeCurso: (cursoId) => api.get(`/admin/cursos/${cursoId}/matriculas`).then(r => r.data),
  validarCruceHorario: (estudianteId, cursoId) => api.get(`/admin/matriculas/validar-cruce?estudianteId=${estudianteId}&cursoId=${cursoId}`).then(r => r.data),
}
