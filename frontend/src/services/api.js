import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // send HTTP-only session cookie
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor: handle expired sessions consistently
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Session expired or not authenticated.
      // Only redirect if we're not already on the login page.
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api