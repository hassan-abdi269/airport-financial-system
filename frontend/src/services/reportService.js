import api from './api'

export const reportService = {
  daily: (date) => api.get('/reports/daily', { params: { date } }).then((r) => r.data),
  monthly: (year, month) =>
    api.get('/reports/monthly', { params: { year, month } }).then((r) => r.data),
  airlines: (params) => api.get('/reports/airlines', { params }).then((r) => r.data),
  revenue: (params) => api.get('/reports/revenue', { params }).then((r) => r.data),
}