import api from './api'

export const dashboardService = {
  summary: () => api.get('/dashboard/summary').then((r) => r.data),
  revenueTrend: (params) =>
    api.get('/dashboard/revenue-trend', { params }).then((r) => r.data),
  revenueByAirline: () =>
    api.get('/dashboard/revenue-by-airline').then((r) => r.data),
  revenueByCategory: () =>
    api.get('/dashboard/revenue-by-category').then((r) => r.data),
}