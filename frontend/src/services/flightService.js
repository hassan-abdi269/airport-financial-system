import api from './api'

export const flightService = {
  list: (params) => api.get('/flights', { params }).then((r) => r.data),
  get: (id) => api.get(`/flights/${id}`).then((r) => r.data),
  create: (payload) => api.post('/flights', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/flights/${id}`, payload).then((r) => r.data),
}