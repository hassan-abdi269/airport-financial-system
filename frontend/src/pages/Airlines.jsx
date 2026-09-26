import { useMemo, useState } from 'react'
import {
  Search,
  Plus,
  Pencil,
  Power,
  Building2,
  Mail,
  Phone,
  User,
  X,
  AlertTriangle,
} from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import StatusBadge from '../components/common/StatusBadge'

// ============================================================
// MOCK DATA
// ============================================================
const MOCK_AIRLINES = [
  { id: 1, name: 'BlueSky',   code: 'BS', contact_name: 'Ahmed Hassan',  contact_email: 'ops@bluesky.local',  contact_phone: '+252 61 555 0101', is_active: true,  aircraft_count: 2, flights_count: 15 },
  { id: 2, name: 'Fokkar-50', code: 'FK', contact_name: 'Yasin Omar',    contact_email: 'ops@fokkar.local',   contact_phone: '+252 61 555 0102', is_active: true,  aircraft_count: 1, flights_count: 12 },
  { id: 3, name: 'Royal',     code: 'RY', contact_name: 'Fatima Ali',    contact_email: 'ops@royal.local',    contact_phone: '+252 61 555 0103', is_active: true,  aircraft_count: 1, flights_count: 8 },
  { id: 4, name: 'Salaam',    code: 'SL', contact_name: 'Mohamed Warsame', contact_email: 'ops@salaam.local', contact_phone: '+252 61 555 0104', is_active: true,  aircraft_count: 1, flights_count: 7 },
  { id: 5, name: 'Rayaam',    code: 'RA', contact_name: 'Amina Yusuf',   contact_email: 'ops@rayaam.local',   contact_phone: '+252 61 555 0105', is_active: true,  aircraft_count: 1, flights_count: 6 },
  { id: 6, name: 'Hilaac',    code: 'HL', contact_name: 'Omar Abdullahi', contact_email: 'ops@hilaac.local',  contact_phone: '+252 61 555 0106', is_active: false, aircraft_count: 1, flights_count: 5 },
]

// ============================================================
export default function Airlines() {
  const [airlines, setAirlines] = useState(MOCK_AIRLINES)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toggleTarget, setToggleTarget] = useState(null)

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase()
    return airlines.filter(
      (a) =>
        !s ||
        a.name.toLowerCase().includes(s) ||
        a.code.toLowerCase().includes(s) ||
        (a.contact_name || '').toLowerCase().includes(s)
    )
  }, [airlines, search])

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
    setAirlines((prev) =>
      prev.map((a) => (a.id === toggleTarget.id ? { ...a, is_active: !a.is_active } : a))
    )
    setToggleTarget(null)
  }

  return (
    <div className="max-w-[1600px] mx-auto">
      <PageHeader
        title="Airlines"
        subtitle="Manage airlines, their codes, and contact details"
        actions={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 bg-navy-900 hover:bg-navy-800 text-white text-sm font-medium px-3 py-2 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Airline
          </button>
        }
      />

      {/* Summary strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <StatCard label="Total Airlines" value={airlines.length} />
        <StatCard label="Active" value={airlines.filter((a) => a.is_active).length} tone="green" />
        <StatCard label="Inactive" value={airlines.filter((a) => !a.is_active).length} tone="slate" />
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4">
        <div className="max-w-md">
          <label className="block text-xs font-medium text-slate-500 mb-1">Search</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, code, contact..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800"
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
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Airline</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium text-right">Aircraft</th>
                <th className="px-4 py-3 font-medium text-right">Flights</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-sm text-slate-500">
                    No airlines match the current search.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center font-mono text-xs font-semibold text-navy-900 bg-navy-50 px-2 py-0.5 rounded">
                        {a.code}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {a.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{a.contact_name}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{a.contact_email}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs font-mono">{a.contact_phone}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                      {a.aircraft_count}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                      {a.flights_count}
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
        ⚠️ Demo data — real airlines will load from <code className="font-mono">GET /api/airlines</code> once the backend is connected.
      </p>

      {/* ===== Add / Edit Modal ===== */}
      {showModal && (
        <AirlineModal
          airline={editing}
          onClose={() => setShowModal(false)}
          onSave={() => {
            alert(editing ? 'Would update airline.' : 'Would create airline.')
            setShowModal(false)
          }}
        />
      )}

      {/* ===== Toggle status confirmation ===== */}
      {toggleTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-start gap-3 p-5">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                toggleTarget.is_active ? 'bg-red-50' : 'bg-green-50'
              }`}>
                <AlertTriangle className={`w-5 h-5 ${
                  toggleTarget.is_active ? 'text-red-600' : 'text-green-600'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-800">
                  {toggleTarget.is_active ? 'Deactivate' : 'Activate'} "{toggleTarget.name}"?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {toggleTarget.is_active
                    ? 'The airline will be hidden from selection in new flights. Existing records are preserved.'
                    : 'The airline will become available for new flights again.'}
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
  const tones = {
    slate: 'text-slate-800',
    green: 'text-green-700',
  }
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      <p className={`text-lg font-semibold tabular-nums mt-1 ${tones[tone]}`}>{value}</p>
    </div>
  )
}

function AirlineModal({ airline, onClose, onSave }) {
  const [name, setName] = useState(airline?.name || '')
  const [code, setCode] = useState(airline?.code || '')
  const [contactName, setContactName] = useState(airline?.contact_name || '')
  const [contactEmail, setContactEmail] = useState(airline?.contact_email || '')
  const [contactPhone, setContactPhone] = useState(airline?.contact_phone || '')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) return setError('Airline name is required.')
    if (!code.trim()) return setError('Airline code is required.')
    onSave()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 overflow-y-auto">
      <form onSubmit={submit} className="bg-white rounded-lg shadow-xl w-full max-w-lg my-8">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">
            {airline ? 'Edit Airline' : 'Add Airline'}
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Airline Name <span className="text-red-600">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. BlueSky"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Code <span className="text-red-600">*</span>
              </label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                maxLength={4}
                placeholder="BS"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800 font-mono uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              <User className="inline w-3 h-3 mr-1" /> Contact Person
            </label>
            <input
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Full name"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                <Mail className="inline w-3 h-3 mr-1" /> Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="ops@airline.local"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                <Phone className="inline w-3 h-3 mr-1" /> Phone
              </label>
              <input
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+252 61 555 0101"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800 font-mono"
              />
            </div>
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
            {airline ? 'Update Airline' : 'Create Airline'}
          </button>
        </div>
      </form>
    </div>
  )
}