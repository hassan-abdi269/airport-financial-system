import { useMemo, useState } from 'react'
import {
  Search,
  Plus,
  Pencil,
  Power,
  X,
  AlertTriangle,
  Calculator,
  Info,
} from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import StatusBadge from '../components/common/StatusBadge'
import { formatCurrency } from '../utils/formatCurrency'

// ============================================================
// MOCK DATA
// ============================================================
const FEE_TYPES = [
  'LANDING', 'HANDLING', 'NAVIGATION', 'CARGO',
  'NIGHT_PARKING', 'DOMESTIC_PASSENGER', 'INTERNATIONAL_PASSENGER',
  'CHD_INF', 'OTHER', 'TAX',
]

const FEE_UNITS = [
  'FIXED', 'PER_FLIGHT', 'PER_ADULT', 'PER_CHILD', 'PER_INFANT',
  'PER_PASSENGER', 'PER_KG', 'PERCENTAGE',
]

const FEE_TYPE_LABELS = {
  LANDING: 'Landing Fee',
  HANDLING: 'Handling Fee',
  NAVIGATION: 'Navigation Fee',
  CARGO: 'Cargo Fee',
  NIGHT_PARKING: 'Night Parking',
  DOMESTIC_PASSENGER: 'Domestic Passenger',
  INTERNATIONAL_PASSENGER: 'International Passenger',
  CHD_INF: 'CHD / INF',
  OTHER: 'Other Charge',
  TAX: 'Tax',
}

const UNIT_LABELS = {
  FIXED: 'Fixed amount',
  PER_FLIGHT: 'Per flight',
  PER_ADULT: 'Per adult',
  PER_CHILD: 'Per child',
  PER_INFANT: 'Per infant',
  PER_PASSENGER: 'Per passenger',
  PER_KG: 'Per kilogram',
  PERCENTAGE: 'Percentage %',
}

const MOCK_FEES = [
  // Landing
  { id: 1, fee_type: 'LANDING', description: 'EMB30 Landing (Regional Jet)',       rate: 100.00, unit: 'PER_FLIGHT', currency: 'USD', effective_from: '2026-01-01', effective_to: null, is_active: true },
  { id: 2, fee_type: 'LANDING', description: 'Fokker-50 Landing (Turboprop)',      rate: 200.00, unit: 'PER_FLIGHT', currency: 'USD', effective_from: '2026-01-01', effective_to: null, is_active: true },
  { id: 3, fee_type: 'LANDING', description: 'Boeing 737 Landing (Narrow Body)',   rate: 380.00, unit: 'PER_FLIGHT', currency: 'USD', effective_from: '2026-01-01', effective_to: null, is_active: true },

  // Handling
  { id: 4, fee_type: 'HANDLING', description: 'EMB30 Handling',                     rate: 110.00, unit: 'PER_FLIGHT', currency: 'USD', effective_from: '2026-01-01', effective_to: null, is_active: true },
  { id: 5, fee_type: 'HANDLING', description: 'Fokker-50 Handling',                 rate: 210.00, unit: 'PER_FLIGHT', currency: 'USD', effective_from: '2026-01-01', effective_to: null, is_active: true },

  // Navigation
  { id: 6, fee_type: 'NAVIGATION', description: 'Standard Navigation Fee',          rate: 84.00,  unit: 'PER_FLIGHT', currency: 'USD', effective_from: '2026-01-01', effective_to: null, is_active: true },

  // Cargo
  { id: 7, fee_type: 'CARGO', description: 'Cargo Handling per kg',                 rate: 1.50,   unit: 'PER_KG',     currency: 'USD', effective_from: '2026-01-01', effective_to: null, is_active: true },

  // Parking
  { id: 8, fee_type: 'NIGHT_PARKING', description: 'Overnight Parking (Night Shift)', rate: 65.00, unit: 'PER_FLIGHT', currency: 'USD', effective_from: '2026-01-01', effective_to: null, is_active: true },

  // Passenger
  { id: 9,  fee_type: 'DOMESTIC_PASSENGER', description: 'Domestic Passenger Fee',      rate: 2.00, unit: 'PER_PASSENGER', currency: 'USD', effective_from: '2026-01-01', effective_to: null, is_active: true },
  { id: 10, fee_type: 'INTERNATIONAL_PASSENGER', description: 'International Passenger Fee', rate: 5.00, unit: 'PER_PASSENGER', currency: 'USD', effective_from: '2026-01-01', effective_to: null, is_active: true },
  { id: 11, fee_type: 'CHD_INF', description: 'Child / Infant Fee',                    rate: 1.00, unit: 'PER_PASSENGER', currency: 'USD', effective_from: '2026-01-01', effective_to: null, is_active: true },

  // Tax
  { id: 12, fee_type: 'TAX', description: 'Airport Service Tax',                      rate: 5.00, unit: 'PERCENTAGE', currency: 'USD', effective_from: '2026-01-01', effective_to: null, is_active: true },

  // Other (inactive example)
  { id: 13, fee_type: 'OTHER', description: 'Late Payment Penalty (deprecated)',      rate: 25.00, unit: 'FIXED', currency: 'USD', effective_from: '2024-01-01', effective_to: '2025-12-31', is_active: false },
]

// ============================================================
export default function FeeConfiguration() {
  const [fees, setFees] = useState(MOCK_FEES)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toggleTarget, setToggleTarget] = useState(null)

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase()
    return fees
      .filter((f) => (typeFilter === 'all' ? true : f.fee_type === typeFilter))
      .filter((f) =>
        statusFilter === 'all' ? true : statusFilter === 'active' ? f.is_active : !f.is_active
      )
      .filter(
        (f) =>
          !s ||
          f.description.toLowerCase().includes(s) ||
          FEE_TYPE_LABELS[f.fee_type].toLowerCase().includes(s)
      )
      .sort((a, b) => {
        const t = FEE_TYPES.indexOf(a.fee_type) - FEE_TYPES.indexOf(b.fee_type)
        return t !== 0 ? t : a.id - b.id
      })
  }, [fees, search, typeFilter, statusFilter])

  const openCreate = () => {
    setEditing(null)
    setShowModal(true)
  }
  const openEdit = (f) => {
    setEditing(f)
    setShowModal(true)
  }

  const handleToggle = () => {
    if (!toggleTarget) return
    setFees((prev) =>
      prev.map((f) => (f.id === toggleTarget.id ? { ...f, is_active: !f.is_active } : f))
    )
    setToggleTarget(null)
  }

  const stats = {
    total: fees.length,
    active: fees.filter((f) => f.is_active).length,
    inactive: fees.filter((f) => !f.is_active).length,
  }

  return (
    <div className="max-w-[1600px] mx-auto">
      <PageHeader
        title="Fee Configuration"
        subtitle="Airport charge rates — used by the calculation engine when creating transactions"
        actions={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 bg-navy-900 hover:bg-navy-800 text-white text-sm font-medium px-3 py-2 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Fee
          </button>
        }
      />

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-4 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-blue-800">
          Changes to fee rates <strong>do not affect past transactions</strong>. Historical amounts
          are stored at the time each transaction is created. Adjust a rate here and it applies only
          to <em>future</em> transactions.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <StatCard label="Total Fees" value={stats.total} />
        <StatCard label="Active" value={stats.active} tone="green" />
        <StatCard label="Inactive" value={stats.inactive} tone="slate" />
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
                placeholder="Description or fee type..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Fee Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy-800"
            >
              <option value="all">All Types</option>
              {FEE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {FEE_TYPE_LABELS[t]}
                </option>
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
              <option value="active">Active only</option>
              <option value="inactive">Inactive only</option>
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
                <th className="px-4 py-3 font-medium">Fee Type</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium text-right">Rate</th>
                <th className="px-4 py-3 font-medium">Unit</th>
                <th className="px-4 py-3 font-medium">Effective From</th>
                <th className="px-4 py-3 font-medium">Effective To</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-500">
                    No fees match the current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((f) => (
                  <tr key={f.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-navy-900 bg-navy-50 border border-navy-100 px-2 py-0.5 rounded">
                        {FEE_TYPE_LABELS[f.fee_type]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{f.description}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-semibold text-slate-800">
                      {f.unit === 'PERCENTAGE'
                        ? `${Number(f.rate).toFixed(2)}%`
                        : formatCurrency(f.rate, f.currency)}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">{UNIT_LABELS[f.unit]}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{f.effective_from || '—'}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{f.effective_to || '—'}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={f.is_active ? 'ACTIVE' : 'INACTIVE'} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEdit(f)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-navy-900 hover:text-navy-700"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => setToggleTarget(f)}
                          className={`inline-flex items-center gap-1 text-xs font-medium ${
                            f.is_active
                              ? 'text-red-600 hover:text-red-700'
                              : 'text-green-700 hover:text-green-800'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                          {f.is_active ? 'Disable' : 'Enable'}
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
        ⚠️ Demo data — real fee configs will load from <code className="font-mono">GET /api/fees</code> once the backend is connected.
      </p>

      {/* Add / Edit */}
      {showModal && (
        <FeeModal
          fee={editing}
          onClose={() => setShowModal(false)}
          onSave={() => {
            alert(editing ? 'Would update fee.' : 'Would create fee.')
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
                  {toggleTarget.is_active ? 'Disable' : 'Enable'} this fee?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {toggleTarget.description}
                </p>
                {toggleTarget.is_active && (
                  <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 mt-2">
                    New transactions will no longer use this rate. Existing transactions are
                    unaffected.
                  </p>
                )}
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
  const tones = { slate: 'text-slate-800', green: 'text-green-700' }
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      <p className={`text-lg font-semibold tabular-nums mt-1 ${tones[tone]}`}>{value}</p>
    </div>
  )
}

function FeeModal({ fee, onClose, onSave }) {
  const [feeType, setFeeType] = useState(fee?.fee_type || 'LANDING')
  const [description, setDescription] = useState(fee?.description || '')
  const [rate, setRate] = useState(fee?.rate ?? '')
  const [unit, setUnit] = useState(fee?.unit || 'PER_FLIGHT')
  const [currency, setCurrency] = useState(fee?.currency || 'USD')
  const [effectiveFrom, setEffectiveFrom] = useState(
    fee?.effective_from || new Date().toISOString().slice(0, 10)
  )
  const [effectiveTo, setEffectiveTo] = useState(fee?.effective_to || '')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    setError('')
    if (!description.trim()) return setError('Description is required.')
    if (rate === '' || Number(rate) < 0) return setError('Enter a valid non-negative rate.')
    if (effectiveTo && effectiveTo < effectiveFrom) {
      return setError('Effective To cannot be earlier than Effective From.')
    }
    onSave()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 overflow-y-auto">
      <form onSubmit={submit} className="bg-white rounded-lg shadow-xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-navy-900" />
            <h3 className="text-sm font-semibold text-slate-800">
              {fee ? 'Edit Fee' : 'Add Fee'}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Fee Type <span className="text-red-600">*</span>
              </label>
              <select
                value={feeType}
                onChange={(e) => setFeeType(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy-800"
              >
                {FEE_TYPES.map((t) => (
                  <option key={t} value={t}>{FEE_TYPE_LABELS[t]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy-800"
              >
                {FEE_UNITS.map((u) => (
                  <option key={u} value={u}>{UNIT_LABELS[u]}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Description <span className="text-red-600">*</span>
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. EMB30 Landing (Regional Jet)"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Rate {unit === 'PERCENTAGE' ? '(%)' : ''} <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800 tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy-800"
              >
                <option value="USD">USD — US Dollar</option>
                <option value="SOS">SOS — Somali Shilling</option>
                <option value="KES">KES — Kenyan Shilling</option>
                <option value="EUR">EUR — Euro</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Effective From</label>
              <input
                type="date"
                value={effectiveFrom}
                onChange={(e) => setEffectiveFrom(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Effective To <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="date"
                value={effectiveTo}
                onChange={(e) => setEffectiveTo(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800"
              />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-600">
            <strong>Example:</strong> A rate of {rate || '0.00'} {unit === 'PERCENTAGE' ? '%' : currency} billed as{' '}
            <em>{UNIT_LABELS[unit]}</em> means the system will multiply the rate by the matching quantity (flights, passengers, kgs) when creating a transaction.
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
            {fee ? 'Update Fee' : 'Create Fee'}
          </button>
        </div>
      </form>
    </div>
  )
}