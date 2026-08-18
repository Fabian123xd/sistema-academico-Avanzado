import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8082/api'
})

// Adjunta el token JWT a cada peticion saliente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sa_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Si el token expira o es invalido, se cierra la sesion automaticamente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('sa_token')
      localStorage.removeItem('sa_user')
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
