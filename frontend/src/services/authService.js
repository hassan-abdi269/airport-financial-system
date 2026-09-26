import api from './api'

export const authService = {
  async login(email, password) {
    const res = await api.post('/auth/login', { email, password })
    return res.data
  },

  async logout() {
    const res = await api.post('/auth/logout')
    return res.data
  },

  async me() {
    const res = await api.get('/auth/me')
    return res.data
  },
}