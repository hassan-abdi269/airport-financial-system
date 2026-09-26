import { useMemo, useState } from 'react'
import {
  Search,
  ArrowUpDown,
  Plus,
  X,
  DollarSign,
  CreditCard,
  Building2,
  Smartphone,
  Banknote,
} from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import StatusBadge from '../components/common/StatusBadge'
import { formatCurrency } from '../utils/formatCurrency'

// ============================================================
// MOCK DATA
// ============================================================
const MOCK_PAYMENTS = [
  { id: 501, date: '2026-09-26', transaction_id: 1042, flight_number: 'BS-101', airline: 'BlueSky',   method: 'BANK_TRANSFER', amount: 1182.00, reference: 'TRF-88421',  received_by: 'Demo Administrator' },
  { id: 500, date: '2026-09-26', transaction_id: 1041, flight_number: 'FK-205', airline: 'Fokkar-50', method: 'CASH',          amount: 300.00,  reference: 'CASH-102',    received_by: 'Demo Administrator' },
  { id: 499, date: '2026-09-26', transaction_id: 1039, flight_number: 'SL-118', airline: 'Salaam',    method: 'MOBILE_MONEY',  amount: 1230.00, reference: 'MM-55213',    received_by: 'Demo Administrator' },
  { id: 498, date: '2026-09-25', transaction_id: 1038, flight_number: 'BS-115', airline: 'BlueSky',   method: 'BANK_TRANSFER', amount: 1245.00, reference: 'TRF-88390',  received_by: 'Demo Administrator' },
  { id: 497, date: '2026-09-25', transaction_id: 1036, flight_number: 'RA-701', airline: 'Rayaam',    method: 'CARD',          amount: 689.00,  reference: 'CARD-2291',   received_by: 'Demo Administrator' },
  { id: 496, date: '2026-09-24', transaction_id: 1035, flight_number: 'HL-022', airline: 'Hilaac',    method: 'CASH',          amount: 500.00,  reference: 'CASH-101',    received_by: 'Demo Administrator' },
  { id: 495, date: '2026-09-24', transaction_id: 1033, flight_number: 'SL-125', airline: 'Salaam',    method: 'BANK_TRANSFER', amount: 764.00,  reference: 'TRF-88201',  received_by: 'Demo Administrator' },
]

// Recent transactions that still have an outstanding balance
const OUTSTANDING_TRANSACTIONS = [
  { id: 1041, flight_number: 'FK-205', airline: 'Fokkar-50', total: 724.00,  paid: 300.00, currency: 'USD' },
  { id: 1040, flight_number: 'RY-310', airline: 'Royal',     total: 1440.00, paid: 0,        currency: 'USD' },
  { id: 1037, flight_number: 'RY-302', airline: 'Royal',     total: 1320.00, paid: 0,        currency: 'USD' },
  { id: 1035, flight_number: 'HL-022', airline: 'Hilaac',    total: 960.00,  paid: 500.00, currency: 'USD' },
  { id: 1034, flight_number: 'FK-212', airline: 'Fokkar-50', total: 1380.00, paid: 0,        currency: 'USD' },
]

const AIRLINES = ['All Airlines', 'BlueSky', 'Fokkar-50', 'Royal', 'Salaam', 'Rayaam', 'Hilaac']
const METHODS = ['All Methods', 'CASH', 'BANK_TRANSFER', 'CARD', 'MOBILE_MONEY', 'OTHER']
const PER_PAGE = 8

const METHOD_LABELS = {
  CASH: 'Cash',
  BANK_TRANSFER: 'Bank Transfer',
  CARD: 'Card',
  MOBILE_MONEY: 'Mobile Money',
  OTHER: 'Other',
}

const METHOD_ICONS = {
  CASH: Banknote,
  BANK_TRANSFER: Building2,
  CARD: CreditCard,
  MOBILE_MONEY: Smartphone,
  OTHER: DollarSign,
}

// ============================================================
export default function Payments() {
  const [search, setSearch] = useState('')
  const [airline, setAirline] = useState('All Airlines')
  const [method, setMethod] = useState('All Methods')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)

  const [showModal, setShowModal] = useState(false)
  const [formTx, setFormTx] = useState('')
  const [formAmount, setFormAmount] = useState('')
  const [formMethod, setFormMethod] = useState('CASH')
  const [formReference, setFormReference] = useState('')
  const [formDate, setFormDate] = useState(new Date().toISOString().slice(0, 10))
  const [formNotes, setFormNotes] = useState('')
  const [formError, setFormError] = useState('')

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase()
    return MOCK_PAYMENTS
      .filter((p) => (airline === 'All Airlines' ? true : p.airline === airline))
      .filter((p) => (method === 'All Methods' ? true : p.method === method))
      .filter((p) =>
        !s
          ? true
          : p.airline.toLowerCase().includes(s) ||
            p.flight_number.toLowerCase().includes(s) ||
            p.reference.toLowerCase().includes(s) ||
            String(p.id).includes(s)
      )
      .sort((a, b) => {
        const d = new Date(a.date) - new Date(b.date)
        return sortDir === 'asc' ? d : -d
      })
  }, [search, airline, method, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  const totalReceived = filtered.reduce((sum, p) => sum + p.amount, 0)

  const selectedTx = OUTSTANDING_TRANSACTIONS.find((t) => t.id === Number(formTx))
  const outstanding = selectedTx ? selectedTx.total - selectedTx.paid : 0

  const resetPage = () => setPage(1)

  const openModal = () => {
    setShowModal(true)
    setFormTx('')
    setFormAmount('')
    setFormMethod('CASH')
    setFormReference('')
    setFormDate(new Date().toISOString().slice(0, 10))
    setFormNotes('')
    setFormError('')
  }

  const submitPayment = () => {
    setFormError('')
    if (!formTx) return setFormError('Select a transaction.')
    if (!formAmount || Number(formAmount) <= 0) return setFormError('Enter a valid amount.')
    if (Number(formAmount) > outstanding) {
      return setFormError(`Amount exceeds outstanding balance of ${formatCurrency(outstanding)}.`)
    }
    if (!formReference.trim()) return setFormError('Reference number is required.')

    alert(
      `Would record payment:\nTransaction #${formTx}\nAmount: ${formatCurrency(Number(formAmount))}\nMethod: ${METHOD_LABELS[formMethod]}\nReference: ${formReference}`
    )
    setShowModal(false)
  }

  return (
    <div className="max-w-[1600px] mx-auto">
      <PageHeader
        title="Payments"
        subtitle="Record and view payments against revenue transactions"
        actions={
          <button
            onClick={openModal}
            className="inline-flex items-center gap-1.5 bg-navy-900 hover:bg-navy-800 text-white text-sm font-medium px-3 py-2 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            Record Payment
          </button>
        }
      />

      {/* Summary strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Payments Shown</p>
          <p className="text-lg font-semibold text-slate-800 tabular-nums mt-1">{filtered.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Amount Received</p>
          <p className="text-lg font-semibold text-green-700 tabular-nums mt-1">{formatCurrency(totalReceived)}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Outstanding (Top 5)</p>
          <p className="text-lg font-semibold text-amber-600 tabular-nums mt-1">
            {formatCurrency(OUTSTANDING_TRANSACTIONS.reduce((s, t) => s + (t.total - t.paid), 0))}
          </p>
        </div>
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
                onChange={(e) => { setSearch(e.target.value); resetPage() }}
                placeholder="Reference, flight, airline, ID..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800"
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
            <label className="block text-xs font-medium text-slate-500 mb-1">Method</label>
            <select
              value={method}
              onChange={(e) => { setMethod(e.target.value); resetPage() }}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy-800"
            >
              {METHODS.map((m) => <option key={m}>{m}</option>)}
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
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">
                  <button
                    onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
                    className="inline-flex items-center gap-1 hover:text-slate-800"
                  >
                    Date <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-4 py-3 font-medium">Transaction</th>
                <th className="px-4 py-3 font-medium">Flight</th>
                <th className="px-4 py-3 font-medium">Airline</th>
                <th className="px-4 py-3 font-medium">Method</th>
                <th className="px-4 py-3 font-medium">Reference</th>
                <th className="px-4 py-3 font-medium text-right">Amount</th>
                <th className="px-4 py-3 font-medium">Received By</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-sm text-slate-500">
                    No payments match the current filters.
                  </td>
                </tr>
              ) : (
                pageRows.map((p) => {
                  const Icon = METHOD_ICONS[p.method] || DollarSign
                  return (
                    <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">#{p.id}</td>
                      <td className="px-4 py-3 text-slate-700">{p.date}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">TX-{p.transaction_id}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-700">{p.flight_number}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{p.airline}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-700">
                          <Icon className="w-3.5 h-3.5 text-slate-400" />
                          {METHOD_LABELS[p.method]}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">{p.reference}</td>
                      <td className="px-4 py-3 text-right tabular-nums font-medium text-green-700">
                        {formatCurrency(p.amount)}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">{p.received_by}</td>
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
            <span className="font-medium text-slate-700">{filtered.length}</span> payments
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
        ⚠️ Demo data — real payments will load from <code className="font-mono">GET /api/payments</code> once the backend is connected.
      </p>

      {/* ===== Record Payment Modal ===== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-navy-900" />
                <h3 className="text-sm font-semibold text-slate-800">Record Payment</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {formError && (
                <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Transaction <span className="text-red-600">*</span>
                </label>
                <select
                  value={formTx}
                  onChange={(e) => setFormTx(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy-800"
                >
                  <option value="">— Select a transaction —</option>
                  {OUTSTANDING_TRANSACTIONS.map((t) => (
                    <option key={t.id} value={t.id}>
                      TX-{t.id} • {t.flight_number} • {t.airline} • Outstanding {formatCurrency(t.total - t.paid)}
                    </option>
                  ))}
                </select>
                {selectedTx && (
                  <p className="text-[11px] text-slate-500 mt-1">
                    Total {formatCurrency(selectedTx.total)} · Paid {formatCurrency(selectedTx.paid)} · Outstanding{' '}
                    <span className="font-medium text-amber-700">{formatCurrency(outstanding)}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Amount <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800 tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Method</label>
                  <select
                    value={formMethod}
                    onChange={(e) => setFormMethod(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy-800"
                  >
                    <option value="CASH">Cash</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CARD">Card</option>
                    <option value="MOBILE_MONEY">Mobile Money</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Reference <span className="text-red-600">*</span>
                  </label>
                  <input
                    value={formReference}
                    onChange={(e) => setFormReference(e.target.value)}
                    placeholder="e.g. TRF-88421"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Date</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  rows={2}
                  placeholder="Optional notes"
                  className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-navy-800 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 px-5 py-3 bg-slate-50 border-t border-slate-200 rounded-b-lg">
              <button
                onClick={() => setShowModal(false)}
                className="text-sm font-medium text-slate-600 hover:text-slate-800 px-3 py-2"
              >
                Cancel
              </button>
              <button
                onClick={submitPayment}
                className="text-sm font-medium text-white bg-navy-900 hover:bg-navy-800 px-3 py-2 rounded-md"
              >
                Record Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}