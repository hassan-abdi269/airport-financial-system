import { useMemo, useState } from 'react'
import {
  Building2,
  Download,
  Plane,
  TrendingUp,
  DollarSign,
  Percent,
  FileText,
  FileSpreadsheet,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import PageHeader from '../components/common/PageHeader'
import { formatCurrency, formatNumber } from '../utils/formatCurrency'

// ============================================================
// MOCK DATA
// ============================================================
const MOCK_AIRLINES = [
  { id: 1, code: 'BS', name: 'BlueSky',   flights: 15, domestic_flights: 15, international_flights: 0, revenue: 7646.00, outstanding: 0 },
  { id: 2, code: 'FK', name: 'Fokkar-50', flights: 12, domestic_flights: 10, international_flights: 2, revenue: 9016.00, outstanding: 724.00 },
  { id: 3, code: 'RY', name: 'Royal',     flights: 8,  domestic_flights: 3,  international_flights: 5, revenue: 2892.00, outstanding: 2760.00 },
  { id: 4, code: 'SL', name: 'Salaam',    flights: 7,  domestic_flights: 7,  international_flights: 0, revenue: 5453.00, outstanding: 0 },
  { id: 5, code: 'RA', name: 'Rayaam',    flights: 6,  domestic_flights: 6,  international_flights: 0, revenue: 4244.00, outstanding: 0 },
  { id: 6, code: 'HL', name: 'Hilaac',    flights: 5,  domestic_flights: 4,  international_flights: 1, revenue: 2375.00, outstanding: 460.00 },
]

const PERIODS = [
  { value: 'this_month',  label: 'This Month' },
  { value: 'last_month',  label: 'Last Month' },
  { value: 'this_quarter', label: 'This Quarter' },
  { value: 'this_year',   label: 'This Year' },
]

const BAR_COLORS = ['#0f172a', '#1e40af', '#0891b2', '#0d9488', '#ca8a04', '#c2410c']

// ============================================================
export default function AirlineReport() {
  const [period, setPeriod] = useState('this_month')
  const [sortKey, setSortKey] = useState('revenue')
  const [sortDir, setSortDir] = useState('desc')

  const sorted = useMemo(() => {
    const arr = [...MOCK_AIRLINES]
    arr.sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv))
      return sortDir === 'asc' ? cmp : -cmp
    })
    return arr
  }, [sortKey, sortDir])

  const totals = useMemo(() => {
    return MOCK_AIRLINES.reduce(
      (acc, a) => ({
        flights: acc.flights + a.flights,
        revenue: acc.revenue + a.revenue,
        outstanding: acc.outstanding + a.outstanding,
      }),
      { flights: 0, revenue: 0, outstanding: 0 }
    )
  }, [])

  const avgPerFlight = totals.flights > 0 ? totals.revenue / totals.flights : 0
  const topAirline = sorted[0]

  const chartData = useMemo(
    () => sorted.map((a, i) => ({ name: a.name, revenue: a.revenue, color: BAR_COLORS[i % BAR_COLORS.length] })),
    [sorted]
  )

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const exportMock = (fmt) => alert(`Would export airline report as ${fmt}.`)

  return (
    <div className="max-w-[1600px] mx-auto">
      <PageHeader
        title="Revenue by Airline"
        subtitle="Revenue contribution and flight activity by airline"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy-800"
            >
              {PERIODS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
            <button
              onClick={() => exportMock('PDF')}
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-navy-900 hover:bg-navy-800 text-white px-3 py-2 rounded-md"
            >
              <FileText className="w-3.5 h-3.5" />
              PDF
            </button>
            <button
              onClick={() => exportMock('Excel')}
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-green-700 hover:bg-green-800 text-white px-3 py-2 rounded-md"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Excel
            </button>
            <button
              onClick={() => exportMock('CSV')}
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-700 hover:bg-slate-800 text-white px-3 py-2 rounded-md"
            >
              <Download className="w-3.5 h-3.5" />
              CSV
            </button>
          </div>
        }
      />

      {/* KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Kpi icon={DollarSign} label="Total Revenue" value={formatCurrency(totals.revenue)} tone="blue" />
        <Kpi icon={Plane} label="Total Flights" value={formatNumber(totals.flights)} tone="slate" />
        <Kpi icon={TrendingUp} label="Avg / Flight" value={formatCurrency(avgPerFlight)} tone="green" />
        <Kpi
          icon={Building2}
          label="Top Airline"
          value={topAirline.name}
          sub={formatCurrency(topAirline.revenue)}
          tone="amber"
        />
      </div>

      {/* Chart */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-700">Revenue Distribution</h3>
          <span className="text-xs text-slate-500">
            Total: <span className="font-medium text-slate-800">{formatCurrency(totals.revenue)}</span>
          </span>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip
                formatter={(v) => formatCurrency(v)}
                contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}
              />
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">
                  <SortBtn active={sortKey === 'name'} dir={sortDir} onClick={() => toggleSort('name')}>
                    Airline
                  </SortBtn>
                </th>
                <th className="px-4 py-3 font-medium text-right">
                  <SortBtn active={sortKey === 'flights'} dir={sortDir} onClick={() => toggleSort('flights')}>
                    Flights
                  </SortBtn>
                </th>
                <th className="px-4 py-3 font-medium text-right">Domestic</th>
                <th className="px-4 py-3 font-medium text-right">International</th>
                <th className="px-4 py-3 font-medium text-right">
                  <SortBtn active={sortKey === 'revenue'} dir={sortDir} onClick={() => toggleSort('revenue')}>
                    Revenue
                  </SortBtn>
                </th>
                <th className="px-4 py-3 font-medium text-right">Avg / Flight</th>
                <th className="px-4 py-3 font-medium text-right">Outstanding</th>
                <th className="px-4 py-3 font-medium text-right">Share</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((a) => {
                const share = totals.revenue > 0 ? (a.revenue / totals.revenue) * 100 : 0
                const avg = a.flights > 0 ? a.revenue / a.flights : 0
                return (
                  <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center font-mono text-xs font-semibold text-navy-900 bg-navy-50 px-2 py-0.5 rounded">
                        {a.code}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">{a.name}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700">{a.flights}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-600">{a.domestic_flights}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-600">{a.international_flights}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-semibold text-slate-800">
                      {formatCurrency(a.revenue)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                      {formatCurrency(avg)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {a.outstanding > 0 ? (
                        <span className="text-red-600 font-medium">
                          {formatCurrency(a.outstanding)}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-navy-900 rounded-full"
                            style={{ width: `${share}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-700 tabular-nums w-10 text-right">
                          {share.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 border-t-2 border-slate-200">
                <td colSpan={2} className="px-4 py-3 text-sm font-semibold text-slate-800">
                  Total
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-semibold text-slate-800">
                  {totals.flights}
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-semibold text-slate-800">
                  {MOCK_AIRLINES.reduce((s, a) => s + a.domestic_flights, 0)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-semibold text-slate-800">
                  {MOCK_AIRLINES.reduce((s, a) => s + a.international_flights, 0)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-semibold text-slate-800">
                  {formatCurrency(totals.revenue)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-semibold text-slate-800">
                  {formatCurrency(avgPerFlight)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-semibold text-red-600">
                  {totals.outstanding > 0 ? formatCurrency(totals.outstanding) : '—'}
                </td>
                <td className="px-4 py-3 text-right text-xs font-semibold text-slate-800">100.0%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center pt-4">
        ⚠️ Demo data — real airline report will load from{' '}
        <code className="font-mono">GET /api/reports/airlines</code> with period filters.
      </p>
    </div>
  )
}

// ============================================================
function Kpi({ icon: Icon, label, value, sub, tone = 'slate' }) {
  const tones = {
    blue:  { bg: 'bg-blue-50',  text: 'text-blue-600' },
    green: { bg: 'bg-green-50', text: 'text-green-600' },
    slate: { bg: 'bg-slate-100', text: 'text-slate-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
  }
  const t = tones[tone] || tones.slate
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
        <div className={`w-8 h-8 rounded-md flex items-center justify-center ${t.bg}`}>
          <Icon className={`w-4 h-4 ${t.text}`} />
        </div>
      </div>
      <p className="text-lg font-semibold text-slate-800 tabular-nums truncate">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  )
}

function SortBtn({ children, active, dir, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 hover:text-slate-800 transition-colors ${
        active ? 'text-navy-900 font-semibold' : ''
      }`}
    >
      {children}
      {active && (
        <span className="text-[9px]">{dir === 'asc' ? '▲' : '▼'}</span>
      )}
    </button>
  )
}