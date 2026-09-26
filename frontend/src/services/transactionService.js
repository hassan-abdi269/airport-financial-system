import api from './api'

export const transactionService = {
  list: (params) => api.get('/transactions', { params }).then((r) => r.data),
  get: (id) => api.get(`/transactions/${id}`).then((r) => r.data),
  create: (payload) => api.post('/transactions', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/transactions/${id}`, payload).then((r) => r.data),
  void: (id, reason) =>
    api.post(`/transactions/${id}/void`, { reason }).then((r) => r.data),
}