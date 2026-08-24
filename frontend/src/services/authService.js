import api from './api'

export default {
  // identificador puede ser el email o el codigo de acceso (A..., D..., U...)
  login: (identificador, password) => api.post('/auth/login', { identificador, password }).then(r => r.data)
}
