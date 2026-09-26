import { useMemo, useState } from 'react'
import {
  Search,
  Plus,
  Pencil,
  Power,
  User as UserIcon,
  Mail,
  X,
  AlertTriangle,
  Shield,
} from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import StatusBadge from '../components/common/StatusBadge'

// ============================================================
// MOCK DATA
// ============================================================
const ROLES = [
  { value: 'ADMIN',             label: 'Administrator',       desc: 'Full system access' },
  { value: 'FINANCE_OFFICER',   label: 'Finance Officer',     desc: 'Create transactions, record payments, generate reports' },
  { value: 'FINANCE_ASSISTANT', label: 'Finance Assistant',   desc: 'Enter daily transactions, view permitted reports' },
  { value: 'MANAGEMENT',        label: 'Management',          desc: 'View dashboards, review and approve reports' },
]

const ROLE_STYLES = {
  ADMIN:             'bg-red-50 text-red-700 border-red-200',
  FINANCE_OFFICER:   'bg-blue-50 text-blue-700 border-blue-200',
  FINANCE_ASSISTANT: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  MANAGEMENT:        'bg-indigo-50 text-indigo-700 border-indigo-200',
}

const MOCK_USERS = [
  { id: 1, name: 'Demo Administrator',  email: 'admin@airport.local',       username: 'admin',     role: 'ADMIN',             is_active: true,  last_login: '2026-09-26T08:42:00' },
  { id: 2, name: 'Amina Yusuf',          email: 'finance@airport.local',     username: 'finance',   role: 'FINANCE_OFFICER',   is_active: true,  last_login: '2026-09-26T07:15:00' },
  { id: 3, name: 'Omar Abdullahi',       email: 'assistant@airport.local',   username: 'assistant', role: 'FINANCE_ASSISTANT', is_active: true,  last_login: '2026-09-25T16:30:00' },
  { id: 4, name: 'Fatima Ali',           email: 'management@airport.local',  username: 'mgmt',      role: 'MANAGEMENT',        is_active: true,  last_login: '2026-09-24T09:10:00' },
  { id: 5, name: 'Yasin Omar',           email: 'yasin@airport.local',       username: 'yasin',     role: 'FINANCE_ASSISTANT', is_active: false, last_login: null },
]

const ROLE_LABEL = (r) => ROLES.find((x) => x.value === r)?.label || r

const fmtDate = (iso) => {
  if (!iso) return 'Never'
  const d = new Date(iso)
  return d.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
}

// ============================================================
export default function Users() {
  const [users, setUsers] = useState(MOCK_USERS)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toggleTarget, setToggleTarget] = useState(null)

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase()
    return users
      .filter((u) => (roleFilter === 'all' ? true : u.role === roleFilter))
      .filter((u) =>
        statusFilter === 'all' ? true : statusFilter === 'active' ? u.is_active : !u.is_active
      )
      .filter(
        (u) =>
          !s ||
          u.name.toLowerCase().includes(s) ||
          u.email.toLowerCase().includes(s) ||
          u.username.toLowerCase().includes(s)
      )
  }, [users, search, roleFilter, statusFilter])

  const handleToggle = () => {
    if (!toggleTarget) return
    setUsers((prev) =>
      prev.map((u) => (u.id === toggleTarget.id ? { ...u, is_active: !u.is_active } : u))
    )
    setToggleTarget(null)
  }

  const stats = {
    total: users.length,
    active: users.filter((u) => u.is_active).length,
    admins: users.filter((u) => u.role === 'ADMIN').length,
  }

  return (
    <div className="max-w-[1600px] mx-auto">
      <PageHeader
        title="Users"
        subtitle="System users, roles, and access control"
        actions={
          <button
            onClick={() => { setEditing(null); setShowModal(true) }}
            className="inline-flex items-center gap-1.5 bg-navy-900 hover:bg-navy-800 text-white text-sm font-medium px-3 py-2 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <StatCard label="Total Users" value={stats.total} />
        <StatCard label="Active" value={stats.active} tone="green" />
        <StatCard label="Administrators" value={stats.admins} tone="red" />
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-slate-500 mb-1">Search</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, email, or username..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Role</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy-800"
            >
              <option value="all">All Roles</option>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy-800"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Username</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Last Login</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-500">
                    No users match the current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-navy-50 border border-navy-100 flex items-center justify-center flex-shrink-0">
                          <UserIcon className="w-4 h-4 text-navy-900" />
                        </div>
                        <span className="font-medium text-slate-800">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{u.email}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-700">{u.username}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded border ${ROLE_STYLES[u.role] || 'bg-slate-100 text-slate-700 border-slate-200'}`}
                      >
                        {ROLE_LABEL(u.role)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">{fmtDate(u.last_login)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={u.is_active ? 'ACTIVE' : 'INACTIVE'} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => { setEditing(u); setShowModal(true) }}
                          className="inline-flex items-center gap-1 text-xs font-medium text-navy-900 hover:text-navy-700"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => setToggleTarget(u)}
                          disabled={u.role === 'ADMIN' && u.email === 'admin@airport.local'}
                          className={`inline-flex items-center gap-1 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed ${
                            u.is_active
                              ? 'text-red-600 hover:text-red-700'
                              : 'text-green-700 hover:text-green-800'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                          {u.is_active ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center pt-4">
        ⚠️ Demo data — real users will load from <code className="font-mono">GET /api/users</code> once the backend is connected.
      </p>

      {/* Add / Edit */}
      {showModal && (
        <UserModal
          user={editing}
          onClose={() => setShowModal(false)}
          onSave={() => {
            alert(editing ? 'Would update user.' : 'Would create user.')
            setShowModal(false)
          }}
        />
      )}

      {/* Toggle confirm */}
      {toggleTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-start gap-3 p-5">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  toggleTarget.is_active ? 'bg-red-50' : 'bg-green-50'
                }`}
              >
                <AlertTriangle
                  className={`w-5 h-5 ${
                    toggleTarget.is_active ? 'text-red-600' : 'text-green-600'
                  }`}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-800">
                  {toggleTarget.is_active ? 'Disable' : 'Enable'} {toggleTarget.name}?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {toggleTarget.is_active
                    ? 'The user will not be able to sign in. Their historical actions remain in the audit log.'
                    : 'The user will be able to sign in again with their existing password.'}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-5 py-3 bg-slate-50 border-t border-slate-200 rounded-b-lg">
              <button
                onClick={() => setToggleTarget(null)}
                className="text-sm font-medium text-slate-600 hover:text-slate-800 px-3 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleToggle}
                className={`text-sm font-medium text-white px-3 py-2 rounded-md ${
                  toggleTarget.is_active
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-700 hover:bg-green-800'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
function StatCard({ label, value, tone = 'slate' }) {
  const tones = { slate: 'text-slate-800', green: 'text-green-700', red: 'text-red-700' }
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      <p className={`text-lg font-semibold tabular-nums mt-1 ${tones[tone]}`}>{value}</p>
    </div>
  )
}

function UserModal({ user, onClose, onSave }) {
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [username, setUsername] = useState(user?.username || '')
  const [role, setRole] = useState(user?.role || 'FINANCE_ASSISTANT')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) return setError('Name is required.')
    if (!email.trim()) return setError('Email is required.')
    if (!username.trim()) return setError('Username is required.')
    if (!user && !password) return setError('Password is required for new users.')
    if (password && password.length < 8) return setError('Password must be at least 8 characters.')
    onSave()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 overflow-y-auto">
      <form onSubmit={submit} className="bg-white rounded-lg shadow-xl w-full max-w-lg my-8">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-navy-900" />
            <h3 className="text-sm font-semibold text-slate-800">
              {user ? 'Edit User' : 'Add User'}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {error && (
            <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Full Name <span className="text-red-600">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Amina Yusuf"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                <Mail className="inline w-3 h-3 mr-1" /> Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@airport.local"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Username <span className="text-red-600">*</span>
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Role</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`text-left px-3 py-2 rounded-md border text-xs transition-colors ${
                    role === r.value
                      ? 'border-navy-800 bg-navy-50 ring-1 ring-navy-800'
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                >
                  <p className="font-medium text-slate-800">{r.label}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{r.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              {user ? 'New Password (leave blank to keep current)' : 'Password'} 
              {!user && <span className="text-red-600"> *</span>}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={user ? '••••••••' : 'At least 8 characters'}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 px-5 py-3 bg-slate-50 border-t border-slate-200 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-slate-600 hover:text-slate-800 px-3 py-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="text-sm font-medium text-white bg-navy-900 hover:bg-navy-800 px-3 py-2 rounded-md"
          >
            {user ? 'Update User' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  )
}