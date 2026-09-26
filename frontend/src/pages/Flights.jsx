import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Plus, Filter, ArrowUpDown, Eye } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import StatusBadge from '../components/common/StatusBadge'

// ============================================================
// MOCK DATA
// ============================================================
const MOCK_FLIGHTS = [
  { id: 1,  flight_number: 'BS-101', date: '2026-09-26', airline: 'BlueSky',   aircraft: 'EMB30',      type: 'DOMESTIC',      direction: 'ARRIVAL',   adults: 24, children: 2, infants: 1, status: 'POSTED' },
  { id: 2,  flight_number: 'FK-205', date: '2026-09-26', airline: 'Fokkar-50', aircraft: 'Fokker-50',  type: 'DOMESTIC',      direction: 'DEPARTURE', adults: 18, children: 0, infants: 0, status: 'POSTED' },
  { id: 3,  flight_number: 'RY-310', date: '2026-09-26', airline: 'Royal',     aircraft: 'EMB30',      type: 'INTERNATIONAL', direction: 'ARRIVAL',   adults: 44, children: 3, infants: 2, status: 'POSTED' },
  { id: 4,  flight_number: 'SL-118', date: '2026-09-26', airline: 'Salaam',    aircraft: 'Fokker-50',  type: 'DOMESTIC',      direction: 'ARRIVAL',   adults: 30, children: 1, infants: 0, status: 'POSTED' },
  { id: 5,  flight_number: 'BS-115', date: '2026-09-25', airline: 'BlueSky',   aircraft: 'EMB30',      type: 'DOMESTIC',      direction: 'DEPARTURE', adults: 28, children: 0, infants: 0, status: 'POSTED' },
  { id: 6,  flight_number: 'RY-302', date: '2026-09-25', airline: 'Royal',     aircraft: 'EMB30',      type: 'INTERNATIONAL', direction: 'DEPARTURE', adults: 39, children: 4, infants: 1, status: 'POSTED' },
  { id: 7,  flight_number: 'RA-701', date: '2026-09-25', airline: 'Rayaam',    aircraft: 'Fokker-50',  type: 'DOMESTIC',      direction: 'ARRIVAL',   adults: 15, children: 0, infants: 0, status: 'POSTED' },
  { id: 8,  flight_number: 'HL-022', date: '2026-09-24', airline: 'Hilaac',    aircraft: 'EMB30',      type: 'DOMESTIC',      direction: 'DEPARTURE', adults: 22, children: 1, infants: 0, status: 'POSTED' },
  { id: 9,  flight_number: 'FK-212', date: '2026-09-24', airline: 'Fokkar-50', aircraft: 'Fokker-50',  type: 'INTERNATIONAL', direction: 'ARRIVAL',   adults: 35, children: 2, infants: 1, status: 'POSTED' },
  { id: 10, flight_number: 'SL-125', date: '2026-09-24', airline: 'Salaam',    aircraft: 'Fokker-50',  type: 'DOMESTIC',      direction: 'DEPARTURE', adults: 19, children: 0, infants: 0, status: 'DRAFT' },
]

const AIRLINES = ['All Airlines', 'BlueSky', 'Fokkar-50', 'Royal', 'Salaam', 'Rayaam', 'Hilaac']
const AIRCRAFT = ['All Aircraft', 'EMB30', 'Fokker-50']
const FLIGHT_TYPES = ['All Types', 'DOMESTIC', 'INTERNATIONAL']
const PER_PAGE = 8

// ============================================================
export default function Flights() {
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [airline, setAirline] = useState('All Airlines')
  const [aircraft, setAircraft] = useState('All Aircraft')
  const [type, setType] = useState('All Types')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase()
    return MOCK_FLIGHTS
      .filter((f) => (airline === 'All Airlines' ? true : f.airline === airline))
      .filter((f) => (aircraft === 'All Aircraft' ? true : f.aircraft === aircraft))
      .filter((f) => (type === 'All Types' ? true : f.type === type))
      .filter((f) =>
        !s
          ? true
          : f.flight_number.toLowerCase().includes(s) ||
            f.airline.toLowerCase().includes(s) ||
            f.aircraft.toLowerCase().includes(s)
      )
      .sort((a, b) => {
        const d = new Date(a.date) - new Date(b.date)
        return sortDir === 'asc' ? d : -d
      })
  }, [search, airline, aircraft, type, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  const resetPage = () => setPage(1)

  return (
    <div className="max-w-[1600px] mx-auto">
      <PageHeader
        title="Flights"
        subtitle="All recorded flights and their passenger counts"
        actions={
          <Link
            to="/flights/new"
            className="inline-flex items-center gap-1.5 bg-navy-900 hover:bg-navy-800 text-white text-sm font-medium px-3 py-2 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Flight
          </Link>
        }
      />

      {/* Filter bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-slate-500 mb-1">Search</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); resetPage() }}
                placeholder="Flight number, airline, aircraft..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-navy-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Airline</label>
            <select
              value={airline}
              onChange={(e) => { setAirline(e.target.value); resetPage() }}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-navy-800"
            >
              {AIRLINES.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Aircraft</label>
            <select
              value={aircraft}
              onChange={(e) => { setAircraft(e.target.value); resetPage() }}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-navy-800"
            >
              {AIRCRAFT.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Flight Type</label>
            <select
              value={type}
              onChange={(e) => { setType(e.target.value); resetPage() }}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-navy-800"
            >
              {FLIGHT_TYPES.map((t) => <option key={t}>{t}</option>)}
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
                <th className="px-4 py-3 font-medium">Flight #</th>
                <th className="px-4 py-3 font-medium">
                  <button
                    onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
                    className="inline-flex items-center gap-1 hover:text-slate-800"
                  >
                    Date <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-4 py-3 font-medium">Airline</th>
                <th className="px-4 py-3 font-medium">Aircraft</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Arr/Dep</th>
                <th className="px-4 py-3 font-medium text-right">Adults</th>
                <th className="px-4 py-3 font-medium text-right">Child</th>
                <th className="px-4 py-3 font-medium text-right">Infant</th>
                <th className="px-4 py-3 font-medium text-right">Total Pax</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-4 py-12 text-center text-sm text-slate-500">
                    No flights match the current filters.
                  </td>
                </tr>
              ) : (
                pageRows.map((f) => (
                  <tr key={f.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs text-slate-700">{f.flight_number}</td>
                    <td className="px-4 py-3 text-slate-700">{f.date}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{f.airline}</td>
                    <td className="px-4 py-3 text-slate-600">{f.aircraft}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${f.type === 'DOMESTIC' ? 'text-slate-600' : 'text-indigo-600'}`}>
                        {f.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{f.direction}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700">{f.adults}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700">{f.children}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700">{f.infants}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium text-slate-800">
                      {f.adults + f.children + f.infants}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={f.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => navigate(`/flights/${f.id}`)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-navy-900 hover:text-navy-700"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 text-xs text-slate-500">
          <div>
            Showing <span className="font-medium text-slate-700">{pageRows.length}</span> of{' '}
            <span className="font-medium text-slate-700">{filtered.length}</span> flights
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
        ⚠️ Demo data — real flights will load from <code className="font-mono">GET /api/flights</code> once the backend is connected.
      </p>
    </div>
  )
}