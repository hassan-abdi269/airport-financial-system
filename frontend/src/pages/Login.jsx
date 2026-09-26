import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Plane, Lock, Mail, AlertCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import AuthLayout from '../layouts/AuthLayout'

// ⚠️ DEMO CREDENTIALS — remove before production
const DEMO_EMAIL = 'admin@airport.local'
const DEMO_PASSWORD = 'demo1234'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState(DEMO_EMAIL)
  const [password, setPassword] = useState(DEMO_PASSWORD)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Email and password are required.')
      return
    }

    setSubmitting(true)
    try {
      await login(email, password)
      const dest = location.state?.from?.pathname || '/dashboard'
      navigate(dest, { replace: true })
    } catch (err) {
      const message =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        'Unable to log in. Please check your credentials.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  const fillDemo = () => {
    setEmail(DEMO_EMAIL)
    setPassword(DEMO_PASSWORD)
    setError('')
  }

  return (
    <AuthLayout>
      <div className="bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-navy-900 px-6 py-6 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 rounded-md p-2">
              <Plane className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight">
                Airport Financial Management System
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">AFMS — Secure Sign In</p>
            </div>
          </div>
        </div>

        {/* Demo banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-start justify-between gap-3">
          <div className="text-xs text-amber-800">
            <p className="font-semibold">Demo Mode</p>
            <p className="mt-0.5">
              Use <span className="font-mono">{DEMO_EMAIL}</span> /{' '}
              <span className="font-mono">{DEMO_PASSWORD}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={fillDemo}
            className="text-xs font-medium text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded px-2 py-1 transition-colors flex-shrink-0"
          >
            Fill demo
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          {error && (
            <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={DEMO_EMAIL}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-navy-800"
                disabled={submitting}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-navy-800"
                disabled={submitting}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-navy-900 hover:bg-navy-800 text-white text-sm font-medium py-2.5 rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-xs text-slate-500 text-center">
            Authorized personnel only. All activity is logged.
          </p>
        </form>
      </div>

      <p className="text-xs text-slate-400 text-center mt-4">
        © {new Date().getFullYear()} Airport Financial Management System
      </p>
    </AuthLayout>
  )
}