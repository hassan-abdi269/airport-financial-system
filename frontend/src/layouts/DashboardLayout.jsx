import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Plane,
  LayoutDashboard,
  PlaneTakeoff,
  Receipt,
  CreditCard,
  BarChart3,
  FileText,
  Users,
  Settings as SettingsIcon,
  ScrollText,
  DollarSign,
  Building2,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { usePermissions } from '../hooks/usePermissions'

const SECTIONS = [
  {
    label: null,
    items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, action: 'viewDashboard' }],
  },
  {
    label: 'Operations',
    items: [
      { to: '/flights', label: 'Flights', icon: PlaneTakeoff, action: 'createFlight' },
      { to: '/transactions', label: 'Daily Transactions', icon: Receipt, action: 'createTransaction' },
    ],
  },
  {
    label: 'Financial',
    items: [
      { to: '/payments', label: 'Payments', icon: CreditCard, action: 'recordPayment' },
      { to: '/reports/revenue', label: 'Revenue', icon: DollarSign, action: 'viewReports' },
      { to: '/reports/daily', label: 'Reports', icon: FileText, action: 'viewReports' },
    ],
  },
  {
    label: 'Master Data',
    items: [
      { to: '/airlines', label: 'Airlines', icon: Building2, action: 'manageAirlines' },
      { to: '/aircraft', label: 'Aircraft', icon: Plane, action: 'manageAircraft' },
      { to: '/fees', label: 'Fee Configuration', icon: BarChart3, action: 'manageFees' },
    ],
  },
  {
    label: 'Administration',
    items: [
      { to: '/users', label: 'Users', icon: Users, action: 'manageUsers' },
      { to: '/audit-logs', label: 'Audit Logs', icon: ScrollText, action: 'viewAuditLogs' },
      { to: '/settings', label: 'Settings', icon: SettingsIcon, action: 'manageSettings' },
    ],
  },
]

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const { can } = usePermissions()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50">
      {/* ===== Sidebar (fixed width, scrolls independently if content is long) ===== */}
      <aside className="hidden md:flex w-64 flex-col bg-navy-900 text-slate-100 flex-shrink-0 h-full">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/10 flex items-center gap-2 flex-shrink-0">
          <Plane className="w-5 h-5" />
          <div className="min-w-0">
            <p className="font-semibold tracking-tight text-sm">AFMS</p>
            <p className="text-[10px] text-slate-400 truncate">Financial Management</p>
          </div>
        </div>

        {/* Nav (this is the only part that scrolls inside the sidebar) */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          {SECTIONS.map((section, i) => {
            const visible = section.items.filter((it) => !it.action || can(it.action))
            if (!visible.length) return null
            return (
              <div key={i}>
                {section.label && (
                  <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {section.label}
                  </p>
                )}
                <div className="space-y-0.5">
                  {visible.map((item) => {
                    const Icon = item.icon
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                            isActive
                              ? 'bg-white/10 text-white'
                              : 'text-slate-300 hover:bg-white/5 hover:text-white'
                          }`
                        }
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </NavLink>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </nav>
      </aside>

      {/* ===== Main column ===== */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Topbar (sticky at top of the main column) */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Plane className="w-4 h-4 text-navy-900 md:hidden flex-shrink-0" />
            <h1 className="text-sm font-semibold text-slate-700 truncate">
              Airport Financial Management System
            </h1>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-slate-700 leading-tight">
                {user?.name || 'User'}
              </p>
              <p className="text-[11px] text-slate-500 leading-tight">{user?.role || ''}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </header>

        {/* ===== Scrollable content area ===== */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}