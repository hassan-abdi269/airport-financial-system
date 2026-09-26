import { useMemo, useState } from 'react'
import {
  Search,
  ScrollText,
  Eye,
  X,
  Shield,
  Filter,
} from 'lucide-react'
import PageHeader from '../components/common/PageHeader'

// ============================================================
// MOCK DATA
// ============================================================
const ACTIONS = [
  { value: 'LOGIN',              label: 'Login',              tone: 'slate' },
  { value: 'LOGOUT',             label: 'Logout',             tone: 'slate' },
  { value: 'CREATE_TRANSACTION', label: 'Create Transaction', tone: 'green' },
  { value: 'UPDATE_TRANSACTION', label: 'Update Transaction', tone: 'blue' },
  { value: 'VOID_TRANSACTION',   label: 'Void Transaction',   tone: 'red' },
  { value: 'CREATE_PAYMENT',     label: 'Create Payment',     tone: 'green' },
  { value: 'UPDATE_PAYMENT',     label: 'Update Payment',     tone: 'blue' },
  { value: 'CHANGE_FEE',         label: 'Change Fee',         tone: 'amber' },
  { value: 'CREATE_AIRLINE',     label: 'Create Airline',     tone: 'green' },
  { value: 'UPDATE_AIRLINE',     label: 'Update Airline',     tone: 'blue' },
  { value: 'CREATE_AIRCRAFT',    label: 'Create Aircraft',    tone: 'green' },
  { value: 'CREATE_USER',        label: 'Create User',        tone: 'green' },
  { value: 'DISABLE_USER',       label: 'Disable User',       tone: 'red' },
  { value: 'APPROVE_REPORT',     label: 'Approve Report',     tone: 'green' },
  { value: 'CREATE_BACKUP',      label: 'Create Backup',      tone: 'slate' },
]

const ACTION_STYLES = {
  green: 'bg-green-50 text-green-700 border-green-200',
  blue:  'bg-blue-50 text-blue-700 border-blue-200',
  red:   'bg-red-50 text-red-700 border-red-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
}

const actionMeta = (a) => ACTIONS.find((x) => x.value === a) || { label: a, tone: 'slate' }

const MOCK_LOGS = [
  { id: 1024, user: 'Demo Administrator',  action: 'LOGIN',              entity_type: 'User',                  entity_id: 1,    ip_address: '127.0.0.1',     created_at: '2026-09-26T08:42:11Z', old_values: null,                              new_values: null },
  { id: 1023, user: 'Demo Administrator',  action: 'CREATE_PAYMENT',     entity_type: 'Payment',               entity_id: 501,  ip_address: '127.0.0.1',     created_at: '2026-09-26T08:35:04Z', old_values: null,                              new_values: { amount: '1182.00', method: 'BANK_TRANSFER', reference: 'TRF-88421' } },
  { id: 1022, user: 'Amina Yusuf',          action: 'CREATE_TRANSACTION', entity_type: 'RevenueTransaction',    entity_id: 1042, ip_address: '10.0.0.12',     created_at: '2026-09-26T08:15:22Z', old_values: null,                              new_values: { total_amount: '1182.00', flight_id: 101, currency: 'USD' } },
  { id: 1021, user: 'Amina Yusuf',          action: 'UPDATE_TRANSACTION', entity_type: 'RevenueTransaction',    entity_id: 1041, ip_address: '10.0.0.12',     created_at: '2026-09-26T07:58:11Z', old_values: { handling_fee: '110.00' },        new_values: { handling_fee: '105.00' } },
  { id: 1020, user: 'Demo Administrator',  action: 'CHANGE_FEE',         entity_type: 'FeeConfiguration',      entity_id: 12,   ip_address: '127.0.0.1',     created_at: '2026-09-26T07:20:00Z', old_values: { rate: '4.00' },                 new_values: { rate: '5.00' } },
  { id: 1019, user: 'Demo Administrator',  action: 'CREATE_USER',        entity_type: 'User',                  entity_id: 5,    ip_address: '127.0.0.1',     created_at: '2026-09-25T17:40:32Z', old_values: null,                              new_values: { name: 'Yasin Omar', role: 'FINANCE_ASSISTANT' } },
  { id: 1018, user: 'Omar Abdullahi',       action: 'VOID_TRANSACTION',   entity_type: 'RevenueTransaction',    entity_id: 1033, ip_address: '10.0.0.15',     created_at: '2026-09-25T16:55:10Z', old_values: { status: 'POSTED' },             new_values: { status: 'VOIDED', reason: 'Duplicate entry' } },
  { id: 1017, user: 'Omar Abdullahi',       action: 'CREATE_TRANSACTION', entity_type: 'RevenueTransaction',    entity_id: 1039, ip_address: '10.0.0.15',     created_at: '2026-09-25T16:30:44Z', old_values: null,                              new_values: { total_amount: '1230.00', flight_id: 104 } },
  { id: 1016, user: 'Fatima Ali',           action: 'APPROVE_REPORT',     entity_type: 'Report',                entity_id: 42,   ip_address: '10.0.0.22',     created_at: '2026-09-25T15:10:03Z', old_values: { status: 'CHECKED' },            new_values: { status: 'APPROVED' } },
  { id: 1015, user: 'Demo Administrator',  action: 'CREATE_AIRLINE',     entity_type: 'Airline',               entity_id: 6,    ip_address: '127.0.0.1',     created_at: '2026-09-25T11:00:00Z', old_values: null,                              new_values: { name: 'Hilaac', code: 'HL' } },
  { id: 1014, user: 'Demo Administrator',  action: 'CREATE_BACKUP',      entity_type: 'System',                entity_id: null, ip_address: '127.0.0.1',     created_at: '2026-09-25T03:00:00Z', old_values: null,                              new_values: { file: 'airport_backup_2026_09_25.db', size_kb: 248 } },
  { id: 1013, user: 'Demo Administrator',  action: 'DISABLE_USER',       entity_type: 'User',                  entity_id: 5,    ip_address: '127.0.0.1',     created_at: '2026-09-24T14:22:18Z', old_values: { is_active: true },              new_values: { is_active: false } },
  { id: 1012, user: 'Amina Yusuf',          action: 'LOGIN',              entity_type: 'User',                  entity_id: 2,    ip_address: '10.0.0.12',     created_at: '2026-09-24T08:05:47Z', old_values: null,                              new_values: null },
  { id: 1011, user: 'Fatima Ali',           action: 'LOGOUT',             entity_type: 'User',                  entity_id: 4,    ip_address: '10.0.0.22',     created_at: '2026-09-23T18:12:33Z', old_values: null,                              new_values: null },
]

const PER_PAGE = 10

const fmtDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'medium' })
}

// ============================================================
export default function AuditLogs() {
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('all')
  const [entityFilter, setEntityFilter] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)

  const entityTypes = useMemo(
    () => Array.from(new Set(MOCK_LOGS.map((l) => l.entity_type))).sort(),
    []
  )

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase()
    return MOCK_LOGS
      .filter((l) => (actionFilter === 'all' ? true : l.action === actionFilter))
      .filter((l) => (entityFilter === 'all' ? true : l.entity_type === entityFilter))
      .filter((l) => (!dateFrom ? true : l.created_at.slice(0, 10) >= dateFrom))
      .filter((l) => (!dateTo ? true : l.created_at.slice(0, 10) <= dateTo))
      .filter(
        (l) =>
          !s ||
          l.user.toLowerCase().includes(s) ||
          l.action.toLowerCase().includes(s) ||
          l.entity_type.toLowerCase().includes(s) ||
          String(l.entity_id).includes(s)
      )
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }, [search, actionFilter, entityFilter, dateFrom, dateTo])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  const resetPage = () => setPage(1)

  return (
    <div className="max-w-[1600px] mx-auto">
      <PageHeader
        title="Audit Logs"
        subtitle="Read-only log of all important financial and system actions"
        actions={
          <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-md">
            <Shield className="w-3.5 h-3.5" />
            Immutable — cannot be edited
          </span>
        }
      />

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-slate-500 mb-1">Search</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); resetPage() }}
                placeholder="User, action, entity, ID..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Action</label>
            <select
              value={actionFilter}
              onChange={(e) => { setActionFilter(e.target.value); resetPage() }}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy-800"
            >
              <option value="all">All Actions</option>
              {ACTIONS.map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Entity Type</label>
            <select
              value={entityFilter}
              onChange={(e) => { setEntityFilter(e.target.value); resetPage() }}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy-800"
            >
              <option value="all">All Entities</option>
              {entityTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); resetPage() }}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); resetPage() }}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">Entity</th>
                <th className="px-4 py-3 font-medium">Entity ID</th>
                <th className="px-4 py-3 font-medium">IP</th>
                <th className="px-4 py-3 font-medium text-right">Details</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-500">
                    No audit log entries match the current filters.
                  </td>
                </tr>
              ) : (
                pageRows.map((l) => {
                  const meta = actionMeta(l.action)
                  return (
                    <tr key={l.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">
                        {fmtDate(l.created_at)}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">{l.user}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded border ${ACTION_STYLES[meta.tone]}`}
                        >
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-xs">{l.entity_type}</td>
                      <td className="px-4 py-3 text-slate-600 font-mono text-xs">
                        {l.entity_id ? `#${l.entity_id}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-mono text-xs">
                        {l.ip_address}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelected(l)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-navy-900 hover:text-navy-700"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 text-xs text-slate-500">
          <div>
            Showing <span className="font-medium text-slate-700">{pageRows.length}</span> of{' '}
            <span className="font-medium text-slate-700">{filtered.length}</span> entries
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="px-2.5 py-1 border border-slate-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Previous
            </button>
            <span className="px-2">
              Page <span className="font-medium text-slate-700">{currentPage}</span> of{' '}
              <span className="font-medium text-slate-700">{totalPages}</span>
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-2.5 py-1 border border-slate-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center pt-4">
        ⚠️ Demo data — real audit logs will load from <code className="font-mono">GET /api/audit-logs</code> once the backend is connected.
      </p>

      {/* Details drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={() => setSelected(null)}>
          <div
            className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <ScrollText className="w-4 h-4 text-navy-900" />
                <h3 className="text-sm font-semibold text-slate-800">
                  Audit Entry #{selected.id}
                </h3>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <Row label="Timestamp" value={fmtDate(selected.created_at)} />
              <Row label="User" value={selected.user} />
              <Row
                label="Action"
                value={
                  <span
                    className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded border ${ACTION_STYLES[actionMeta(selected.action).tone]}`}
                  >
                    {actionMeta(selected.action).label}
                  </span>
                }
              />
              <Row label="Entity Type" value={selected.entity_type} />
              <Row
                label="Entity ID"
                value={selected.entity_id ? `#${selected.entity_id}` : '—'}
              />
              <Row label="IP Address" value={<span className="font-mono">{selected.ip_address}</span>} />

              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                  Old Values
                </p>
                <pre className="text-[11px] bg-slate-50 border border-slate-200 rounded p-3 overflow-x-auto text-slate-700">
                  {selected.old_values
                    ? JSON.stringify(selected.old_values, null, 2)
                    : '— no previous values (create action)'}
                </pre>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                  New Values
                </p>
                <pre className="text-[11px] bg-slate-50 border border-slate-200 rounded p-3 overflow-x-auto text-slate-700">
                  {selected.new_values
                    ? JSON.stringify(selected.new_values, null, 2)
                    : '— no new values recorded'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide pt-0.5">
        {label}
      </span>
      <span className="text-slate-800 text-right">{value}</span>
    </div>
  )
}