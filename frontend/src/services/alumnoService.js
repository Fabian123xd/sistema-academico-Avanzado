import axios from 'axios'

const base = axios.create({
  baseURL: 'http://localhost:8082/api/alumnos'
})

export default {
  list: () => base.get(''),
  get: (id) => base.get(`/${id}`),
  create: (data) => base.post('', data),
  update: (id, data) => base.put(`/${id}`, data),
  deleteById: (id) => base.delete(`/${id}`)
}