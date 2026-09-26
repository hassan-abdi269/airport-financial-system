import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  ArrowUpDown,
  Eye,
  Ban,
  Plus,
  X,
  AlertTriangle,
} from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import StatusBadge from '../components/common/StatusBadge'
import { formatCurrency } from '../utils/formatCurrency'

// ============================================================
// MOCK DATA
// ============================================================
const MOCK_TRANSACTIONS = [
  { id: 1042, date: '2026-09-26', flight_number: 'BS-101', airline: 'BlueSky',   aircraft: 'EMB30',     type: 'DOMESTIC',      total: 1182.00, paid: 1182.00, currency: 'USD', payment_status: 'PAID',           transaction_status: 'POSTED', void_reason: null },
  { id: 1041, date: '2026-09-26', flight_number: 'FK-205', airline: 'Fokkar-50', aircraft: 'Fokker-50', type: 'DOMESTIC',      total: 724.00,  paid: 300.00,  currency: 'USD', payment_status: 'PARTIALLY_PAID', transaction_status: 'POSTED', void_reason: null },
  { id: 1040, date: '2026-09-26', flight_number: 'RY-310', airline: 'Royal',     aircraft: 'EMB30',     type: 'INTERNATIONAL', total: 1440.00, paid: 0,        currency: 'USD', payment_status: 'UNPAID',         transaction_status: 'POSTED', void_reason: null },
  { id: 1039, date: '2026-09-26', flight_number: 'SL-118', airline: 'Salaam',    aircraft: 'Fokker-50', type: 'DOMESTIC',      total: 1230.00, paid: 1230.00,  currency: 'USD', payment_status: 'PAID',           transaction_status: 'POSTED', void_reason: null },
  { id: 1038, date: '2026-09-25', flight_number: 'BS-115', airline: 'BlueSky',   aircraft: 'EMB30',     type: 'DOMESTIC',      total: 1245.00, paid: 1245.00,  currency: 'USD', payment_status: 'PAID',           transaction_status: 'POSTED', void_reason: null },
  { id: 1037, date: '2026-09-25', flight_number: 'RY-302', airline: 'Royal',     aircraft: 'EMB30',     type: 'INTERNATIONAL', total: 1320.00, paid: 0,        currency: 'USD', payment_status: 'UNPAID',         transaction_status: 'POSTED', void_reason: null },
  { id: 1036, date: '2026-09-25', flight_number: 'RA-701', airline: 'Rayaam',    aircraft: 'Fokker-50', type: 'DOMESTIC',      total: 689.00,  paid: 689.00,   currency: 'USD', payment_status: 'PAID',           transaction_status: 'POSTED', void_reason: null },
  { id: 1035, date: '2026-09-24', flight_number: 'HL-022', airline: 'Hilaac',    aircraft: 'EMB30',     type: 'DOMESTIC',      total: 960.00,  paid: 500.00,   currency: 'USD', payment_status: 'PARTIALLY_PAID', transaction_status: 'POSTED', void_reason: null },
  { id: 1034, date: '2026-09-24', flight_number: 'FK-212', airline: 'Fokkar-50', aircraft: 'Fokker-50', type: 'INTERNATIONAL', total: 1380.00, paid: 0,        currency: 'USD', payment_status: 'UNPAID',         transaction_status: 'POSTED', void_reason: null },
  { id: 1033, date: '2026-09-24', flight_number: 'SL-125', airline: 'Salaam',    aircraft: 'Fokker-50', type: 'DOMESTIC',      total: 764.00,  paid: 764.00,   currency: 'USD', payment_status: 'PAID',           transaction_status: 'VOIDED', void_reason: 'Duplicate entry' },
]

const AIRLINES = ['All Airlines', 'BlueSky', 'Fokkar-50', 'Royal', 'Salaam', 'Rayaam', 'Hilaac']
const PAYMENT_STATUSES = ['All Payment Status', 'UNPAID', 'PARTIALLY_PAID', 'PAID']
const TRANSACTION_STATUSES = ['All Transaction Status', 'POSTED', 'DRAFT', 'VOIDED']
const PER_PAGE = 8

// ============================================================
export default function Transactions() {
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [airline, setAirline] = useState('All Airlines')
  const [paymentStatus, setPaymentStatus] = useState('All Payment Status')
  const [txStatus, setTxStatus] = useState('All Transaction Status')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)

  const [voidTarget, setVoidTarget] = useState(null)
  const [voidReason, setVoidReason] = useState('')

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase()
    return MOCK_TRANSACTIONS
      .filter((t) => (airline === 'All Airlines' ? true : t.airline === airline))
      .filter((t) => (paymentStatus === 'All Payment Status' ? true : t.payment_status === paymentStatus))
      .filter((t) => (txStatus === 'All Transaction Status' ? true : t.transaction_status === txStatus))
      .filter((t) => (!dateFrom ? true : t.date >= dateFrom))
      .filter((t) => (!dateTo ? true : t.date <= dateTo))
      .filter((t) =>
        !s
          ? true
          : t.flight_number.toLowerCase().includes(s) ||
            t.airline.toLowerCase().includes(s) ||
            t.aircraft.toLowerCase().includes(s) ||
            String(t.id).includes(s)
      )
      .sort((a, b) => {
        const d = new Date(a.date) - new Date(b.date)
        return sortDir === 'asc' ? d : -d
      })
  }, [search, airline, paymentStatus, txStatus, dateFrom, dateTo, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  const resetPage = () => setPage(1)

  const openVoid = (tx) => {
    setVoidTarget(tx)
    setVoidReason('')
  }

  const confirmVoid = () => {
    // Mock — just close the dialog with a message
    if (!voidReason.trim()) return
    alert(`Would void transaction #${voidTarget.id}\nReason: ${voidReason}`)
    setVoidTarget(null)
    setVoidReason('')
  }

  return (
    <div className="max-w-[1600px] mx-auto">
      <PageHeader
        title="Daily Transactions"
        subtitle="All revenue transactions"
        actions={
          <button
            onClick={() => navigate('/transactions/new')}
            className="inline-flex items-center gap-1.5 bg-navy-900 hover:bg-navy-800 text-white text-sm font-medium px-3 py-2 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Transaction
          </button>
        }
      />

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-slate-500 mb-1">Search</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); resetPage() }}
                placeholder="Flight #, airline, aircraft, ID..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-navy-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Airline</label>
            <select
              value={airline}
              onChange={(e) => { setAirline(e.target.value); resetPage() }}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy-800"
            >
              {AIRLINES.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Payment</label>
            <select
              value={paymentStatus}
              onChange={(e) => { setPaymentStatus(e.target.value); resetPage() }}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy-800"
            >
              {PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
            <select
              value={txStatus}
              onChange={(e) => { setTxStatus(e.target.value); resetPage() }}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy-800"
            >
              {TRANSACTION_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); resetPage() }}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy-800"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); resetPage() }}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy-800"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">
                  <button
                    onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
                    className="inline-flex items-center gap-1 hover:text-slate-800"
                  >
                    Date <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-4 py-3 font-medium">Flight</th>
                <th className="px-4 py-3 font-medium">Airline</th>
                <th className="px-4 py-3 font-medium">Aircraft</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium text-right">Total</th>
                <th className="px-4 py-3 font-medium text-right">Paid</th>
                <th className="px-4 py-3 font-medium text-right">Outstanding</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-4 py-12 text-center text-sm text-slate-500">
                    No transactions match the current filters.
                  </td>
                </tr>
              ) : (
                pageRows.map((t) => {
                  const outstanding = t.total - t.paid
                  const isVoided = t.transaction_status === 'VOIDED'
                  return (
                    <tr
                      key={t.id}
                      className={`border-b border-slate-100 hover:bg-slate-50 ${isVoided ? 'opacity-60' : ''}`}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">#{t.id}</td>
                      <td className="px-4 py-3 text-slate-700">{t.date}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-700">{t.flight_number}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{t.airline}</td>
                      <td className="px-4 py-3 text-slate-600">{t.aircraft}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{t.type}</td>
                      <td className="px-4 py-3 text-right tabular-nums font-medium text-slate-800">
                        {formatCurrency(t.total, t.currency)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-green-700">
                        {formatCurrency(t.paid, t.currency)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-red-600">
                        {outstanding > 0 ? formatCurrency(outstanding, t.currency) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={t.payment_status} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={t.transaction_status} />
                        {isVoided && t.void_reason && (
                          <p className="text-[10px] text-slate-400 mt-1 italic">{t.void_reason}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/transactions/${t.id}`)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-navy-900 hover:text-navy-700"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>
                          {!isVoided && (
                            <button
                              onClick={() => openVoid(t)}
                              className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              Void
                            </button>
                          )}
                        </div>
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
            <span className="font-medium text-slate-700">{filtered.length}</span> transactions
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
        ⚠️ Demo data — real transactions will load from <code className="font-mono">GET /api/transactions</code> once the backend is connected.
      </p>

      {/* Void confirmation modal */}
      {voidTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-start gap-3 p-5 border-b border-slate-200">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-800">
                  Void transaction #{voidTarget.id}?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  The transaction will not be deleted. It stays in the system as VOIDED and is excluded from financial totals.
                </p>
              </div>
              <button
                onClick={() => setVoidTarget(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Reason for voiding <span className="text-red-600">*</span>
              </label>
              <textarea
                value={voidReason}
                onChange={(e) => setVoidReason(e.target.value)}
                rows={3}
                placeholder="e.g. Incorrect aircraft information"
                className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-navy-800 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 px-5 py-3 bg-slate-50 border-t border-slate-200 rounded-b-lg">
              <button
                onClick={() => setVoidTarget(null)}
                className="text-sm font-medium text-slate-600 hover:text-slate-800 px-3 py-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmVoid}
                disabled={!voidReason.trim()}
                className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 rounded-md"
              >
                Void Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}