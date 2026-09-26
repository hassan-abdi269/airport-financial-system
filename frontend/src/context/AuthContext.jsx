import { createContext, useCallback, useEffect, useState } from 'react'
import { authService } from '../services/authService'

export const AuthContext = createContext(null)

// ⚠️ DEMO MODE IS HARDCODED ON for now.
// When we build the real /api/auth/* endpoints, set this to false.
const DEMO_MODE = true

const DEMO_USER = {
  id: 1,
  name: 'Demo Administrator',
  email: 'admin@airport.local',
  role: 'ADMIN',
  is_active: true,
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (DEMO_MODE) {
      setUser(DEMO_USER)
      setLoading(false)
      return
    }
    try {
      const data = await authService.me()
      setUser(data?.data || null)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const login = useCallback(async (email, password) => {
    if (DEMO_MODE) {
      // Demo mode: accept any credentials, simulate a successful login
      setUser({ ...DEMO_USER, email: email || DEMO_USER.email })
      return { success: true, data: DEMO_USER }
    }
    const data = await authService.login(email, password)
    setUser(data?.data || null)
    return data
  }, [])

  const logout = useCallback(async () => {
    if (DEMO_MODE) {
      setUser(null)
      return
    }
    try {
      await authService.logout()
    } finally {
      setUser(null)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}