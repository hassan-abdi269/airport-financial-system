import { useMemo, useState } from 'react'
import {
  Search,
  Plus,
  Pencil,
  Power,
  Plane,
  X,
  AlertTriangle,
} from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import StatusBadge from '../components/common/StatusBadge'

// ============================================================
// MOCK DATA
// ============================================================
const AIRLINES = [
  { id: 1, name: 'BlueSky',   code: 'BS' },
  { id: 2, name: 'Fokkar-50', code: 'FK' },
  { id: 3, name: 'Royal',     code: 'RY' },
  { id: 4, name: 'Salaam',    code: 'SL' },
  { id: 5, name: 'Rayaam',    code: 'RA' },
  { id: 6, name: 'Hilaac',    code: 'HL' },
]

const AIRCRAFT_TYPES = ['EMB30', 'Fokker-50', 'Boeing 737', 'Airbus A320', 'Dash-8', 'Other']

const MOCK_AIRCRAFT = [
  { id: 1, registration_number: '6O-BSA', aircraft_type: 'EMB30',     category: 'Regional Jet',   airline_id: 1, is_active: true },
  { id: 2, registration_number: '6O-BSB', aircraft_type: 'EMB30',     category: 'Regional Jet',   airline_id: 1, is_active: true },
  { id: 3, registration_number: '6O-FKA', aircraft_type: 'Fokker-50', category: 'Turboprop',      airline_id: 2, is_active: true },
  { id: 4, registration_number: '6O-RYA', aircraft_type: 'EMB30',     category: 'Regional Jet',   airline_id: 3, is_active: true },
  { id: 5, registration_number: '6O-SLA', aircraft_type: 'Fokker-50', category: 'Turboprop',      airline_id: 4, is_active: true },
  { id: 6, registration_number: '6O-RAA', aircraft_type: 'Fokker-50', category: 'Turboprop',      airline_id: 5, is_active: true },
  { id: 7, registration_number: '6O-HLA', aircraft_type: 'EMB30',     category: 'Regional Jet',   airline_id: 6, is_active: false },
]

const airlineName = (id) => AIRLINES.find((a) => a.id === id)?.name || '—'
const airlineCode = (id) => AIRLINES.find((a) => a.id === id)?.code || '—'

// ============================================================
export default function Aircraft() {
  const [aircraft, setAircraft] = useState(MOCK_AIRCRAFT)
  const [search, setSearch] = useState('')
  const [airlineFilter, setAirlineFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toggleTarget, setToggleTarget] = useState(null)

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase()
    return aircraft
      .filter((a) => (airlineFilter === 'all' ? true : a.airline_id === Number(airlineFilter)))
      .filter(
        (a) =>
          !s ||
          a.registration_number.toLowerCase().includes(s) ||
          a.aircraft_type.toLowerCase().includes(s) ||
          (a.category || '').toLowerCase().includes(s)
      )
  }, [aircraft, search, airlineFilter])

  const openCreate = () => {
    setEditing(null)
    setShowModal(true)
  }
  const openEdit = (a) => {
    setEditing(a)
    setShowModal(true)
  }

  const handleToggleStatus = () => {
    if (!toggleTarget) return
    setAircraft((prev) =>
      prev.map((a) => (a.id === toggleTarget.id ? { ...a, is_active: !a.is_active } : a))
    )
    setToggleTarget(null)
  }

  return (
    <div className="max-w-[1600px] mx-auto">
      <PageHeader
        title="Aircraft"
        subtitle="Manage aircraft registrations and link them to airlines"
        actions={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 bg-navy-900 hover:bg-navy-800 text-white text-sm font-medium px-3 py-2 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Aircraft
          </button>
        }
      />

      {/* Summary strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <StatCard label="Total Aircraft" value={aircraft.length} />
        <StatCard label="Active" value={aircraft.filter((a) => a.is_active).length} tone="green" />
        <StatCard
          label="Airlines Covered"
          value={new Set(aircraft.map((a) => a.airline_id)).size}
        />
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Search</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Registration, type, category..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Airline</label>
            <select
              value={airlineFilter}
              onChange={(e) => setAirlineFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy-800"
            >
              <option value="all">All Airlines</option>
              {AIRLINES.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.code})
                </option>
              ))}
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
                <th className="px-4 py-3 font-medium">Registration</th>
                <th className="px-4 py-3 font-medium">Aircraft Type</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Airline</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-500">
                    No aircraft match the current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Plane className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono text-sm font-semibold text-navy-900">
                          {a.registration_number}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{a.aircraft_type}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{a.category || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-800 font-medium">
                        {airlineName(a.airline_id)}
                      </span>
                      <span className="ml-2 text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {airlineCode(a.airline_id)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={a.is_active ? 'ACTIVE' : 'INACTIVE'} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEdit(a)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-navy-900 hover:text-navy-700"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => setToggleTarget(a)}
                          className={`inline-flex items-center gap-1 text-xs font-medium ${
                            a.is_active
                              ? 'text-red-600 hover:text-red-700'
                              : 'text-green-700 hover:text-green-800'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                          {a.is_active ? 'Deactivate' : 'Activate'}
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
        ⚠️ Demo data — real aircraft will load from <code className="font-mono">GET /api/aircraft</code> once the backend is connected.
      </p>

      {/* Add / Edit */}
      {showModal && (
        <AircraftModal
          aircraft={editing}
          onClose={() => setShowModal(false)}
          onSave={() => {
            alert(editing ? 'Would update aircraft.' : 'Would create aircraft.')
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
                  {toggleTarget.is_active ? 'Deactivate' : 'Activate'} "{toggleTarget.registration_number}"?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {toggleTarget.is_active
                    ? 'This aircraft will be hidden from new flight entries. Existing records are preserved.'
                    : 'This aircraft will become selectable again.'}
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
                onClick={handleToggleStatus}
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

function AircraftModal({ aircraft, onClose, onSave }) {
  const [registration, setRegistration] = useState(aircraft?.registration_number || '')
  const [type, setType] = useState(aircraft?.aircraft_type || 'EMB30')
  const [category, setCategory] = useState(aircraft?.category || '')
  const [airlineId, setAirlineId] = useState(aircraft?.airline_id || '')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    setError('')
    if (!registration.trim()) return setError('Registration number is required.')
    if (!type) return setError('Aircraft type is required.')
    if (!airlineId) return setError('Airline is required.')
    onSave()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 overflow-y-auto">
      <form onSubmit={submit} className="bg-white rounded-lg shadow-xl w-full max-w-lg my-8">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">
            {aircraft ? 'Edit Aircraft' : 'Add Aircraft'}
          </h3>
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
              Registration Number <span className="text-red-600">*</span>
            </label>
            <input
              value={registration}
              onChange={(e) => setRegistration(e.target.value.toUpperCase())}
              placeholder="6O-BSA"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800 font-mono uppercase"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Aircraft Type <span className="text-red-600">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy-800"
              >
                {AIRCRAFT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Regional Jet"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Airline <span className="text-red-600">*</span>
            </label>
            <select
              value={airlineId}
              onChange={(e) => setAirlineId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy-800"
            >
              <option value="">— Select an airline —</option>
              {AIRLINES.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.code})
                </option>
              ))}
            </select>
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
            {aircraft ? 'Update Aircraft' : 'Create Aircraft'}
          </button>
        </div>
      </form>
    </div>
  )
}