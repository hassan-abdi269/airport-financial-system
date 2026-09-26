import { useMemo, useState } from 'react'
import {
  Calendar,
  FileText,
  FileSpreadsheet,
  Download,
  Printer,
  Plane,
  Users,
  TrendingUp,
} from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import { formatCurrency, formatNumber } from '../utils/formatCurrency'

// ============================================================
// MOCK MONTHLY DATA — mirrors the structure of the reference image
// ============================================================
const MOCK_AIRLINES = [
  { code: 'BS', name: 'BlueSky',   flights: 15, landing: 1500, handling: 1650, navigation: 1260, cargo: 2400, parking: 0,   domestic: 748,  international: 0,    other: 88,   total: 7646 },
  { code: 'FK', name: 'Fokkar-50', flights: 12, landing: 2400, handling: 2520, navigation: 1008, cargo: 1840, parking: 130, domestic: 998,  international: 0,    other: 120,  total: 9016 },
  { code: 'RY', name: 'Royal',     flights: 8,  landing: 800,  handling: 880,  navigation: 672,  cargo: 0,    parking: 65,  domestic: 0,    international: 415,  other: 60,   total: 2892 },
  { code: 'SL', name: 'Salaam',    flights: 7,  landing: 1400, handling: 1470, navigation: 588,  cargo: 1000, parking: 0,   domestic: 950,  international: 0,    other: 45,   total: 5453 },
  { code: 'RA', name: 'Rayaam',    flights: 6,  landing: 1200, handling: 1260, navigation: 504,  cargo: 620,  parking: 0,   domestic: 630,  international: 0,    other: 30,   total: 4244 },
  { code: 'HL', name: 'Hilaac',    flights: 5,  landing: 500,  handling: 550,  navigation: 420,  cargo: 480,  parking: 65,  domestic: 360,  international: 0,    other: 0,    total: 2375 },
]

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

// ============================================================
export default function MonthlyReport() {
  const [month, setMonth] = useState('September')
  const [year, setYear] = useState('2026')

  const totals = useMemo(() => {
    return MOCK_AIRLINES.reduce(
      (acc, r) => ({
        flights: acc.flights + r.flights,
        landing: acc.landing + r.landing,
        handling: acc.handling + r.handling,
        navigation: acc.navigation + r.navigation,
        cargo: acc.cargo + r.cargo,
        parking: acc.parking + r.parking,
        domestic: acc.domestic + r.domestic,
        international: acc.international + r.international,
        other: acc.other + r.other,
        total: acc.total + r.total,
      }),
      {
        flights: 0, landing: 0, handling: 0, navigation: 0, cargo: 0,
        parking: 0, domestic: 0, international: 0, other: 0, total: 0,
      }
    )
  }, [])

  const taxEstimate = totals.total * 0.05
  const grandTotal = totals.total + taxEstimate
  const avgPerFlight = totals.flights > 0 ? totals.total / totals.flights : 0

  const topAirline = useMemo(
    () => [...MOCK_AIRLINES].sort((a, b) => b.total - a.total)[0],
    []
  )

  const exportMock = (fmt) => {
    alert(`Would export monthly report for ${month} ${year} as ${fmt}.`)
  }

  return (
    <div className="max-w-[1800px] mx-auto">
      <PageHeader
        title="Monthly Income Report"
        subtitle="Aggregated revenue by category and airline for the selected month"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy-800"
            >
              {MONTHS.map((m) => <option key={m}>{m}</option>)}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy-800"
            >
              {['2024', '2025', '2026', '2027'].map((y) => <option key={y}>{y}</option>)}
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
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 border border-slate-300 hover:bg-slate-50 px-3 py-2 rounded-md"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
          </div>
        }
      />

      {/* ============ KPI strip ============ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Kpi
          icon={TrendingUp}
          label="Month Total"
          value={formatCurrency(totals.total)}
          tone="blue"
        />
        <Kpi
          icon={Plane}
          label="Total Flights"
          value={formatNumber(totals.flights)}
          tone="slate"
        />
        <Kpi
          icon={Users}
          label="Avg Revenue / Flight"
          value={formatCurrency(avgPerFlight)}
          tone="green"
        />
        <Kpi
          icon={TrendingUp}
          label="Top Airline"
          value={topAirline.name}
          sub={formatCurrency(topAirline.total)}
          tone="amber"
        />
      </div>

      {/* ============ Report document ============ */}
      <div className="bg-white border border-slate-300 rounded-lg overflow-hidden shadow-sm">
        {/* Header */}
        <div className="text-center px-6 py-6 border-b-2 border-navy-900">
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
            AIRPORT FINANCIAL MANAGEMENT SYSTEM
          </p>
          <h2 className="text-lg font-bold text-navy-900 mt-1">MONTHLY INCOME REPORT</h2>
          <p className="text-sm text-slate-600 mt-1">
            Period: <span className="font-medium">{month} {year}</span>
          </p>
        </div>

        {/* Section 1: Income by category */}
        <div className="px-6 py-5 border-b border-slate-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-3">
            Income by Category
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <CategoryTile label="Landing"         value={totals.landing} />
            <CategoryTile label="Handling"        value={totals.handling} />
            <CategoryTile label="Navigation"      value={totals.navigation} />
            <CategoryTile label="Cargo"           value={totals.cargo} />
            <CategoryTile label="Night Parking"   value={totals.parking} />
            <CategoryTile label="Domestic Pax"    value={totals.domestic} />
            <CategoryTile label="International Pax" value={totals.international} />
            <CategoryTile label="Other Charges"   value={totals.other} />
            <CategoryTile label="Subtotal"        value={totals.total} accent />
            <CategoryTile label="Grand Total"     value={grandTotal} accent />
          </div>
        </div>

        {/* Section 2: Revenue by airline */}
        <div className="px-6 py-5 border-b border-slate-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-3">
            Revenue by Airline
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-navy-900 text-white text-left">
                  <Th>Code</Th>
                  <Th>Airline</Th>
                  <Th right>Flights</Th>
                  <Th right>Landing</Th>
                  <Th right>Handling</Th>
                  <Th right>Navigation</Th>
                  <Th right>Cargo</Th>
                  <Th right>Parking</Th>
                  <Th right>Domestic</Th>
                  <Th right>International</Th>
                  <Th right>Other</Th>
                  <Th right>Total</Th>
                </tr>
              </thead>
              <tbody>
                {MOCK_AIRLINES.map((r, i) => (
                  <tr
                    key={r.code}
                    className={`border-b border-slate-200 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}
                  >
                    <Td mono className="font-semibold text-navy-900">{r.code}</Td>
                    <Td className="font-medium text-slate-800">{r.name}</Td>
                    <Td right mono>{r.flights}</Td>
                    <Td right mono>{r.landing.toFixed(2)}</Td>
                    <Td right mono>{r.handling.toFixed(2)}</Td>
                    <Td right mono>{r.navigation.toFixed(2)}</Td>
                    <Td right mono>{r.cargo.toFixed(2)}</Td>
                    <Td right mono>{r.parking.toFixed(2)}</Td>
                    <Td right mono>{r.domestic.toFixed(2)}</Td>
                    <Td right mono>{r.international.toFixed(2)}</Td>
                    <Td right mono>{r.other.toFixed(2)}</Td>
                    <Td right mono className="font-semibold text-navy-900">{r.total.toFixed(2)}</Td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-green-50 border-t-2 border-green-300">
                  <td colSpan={2} className="px-3 py-3 text-sm font-bold text-slate-800 uppercase tracking-wide">
                    Total
                  </td>
                  <Td right mono className="font-semibold">{totals.flights}</Td>
                  <Td right mono className="font-semibold">{totals.landing.toFixed(2)}</Td>
                  <Td right mono className="font-semibold">{totals.handling.toFixed(2)}</Td>
                  <Td right mono className="font-semibold">{totals.navigation.toFixed(2)}</Td>
                  <Td right mono className="font-semibold">{totals.cargo.toFixed(2)}</Td>
                  <Td right mono className="font-semibold">{totals.parking.toFixed(2)}</Td>
                  <Td right mono className="font-semibold">{totals.domestic.toFixed(2)}</Td>
                  <Td right mono className="font-semibold">{totals.international.toFixed(2)}</Td>
                  <Td right mono className="font-semibold">{totals.other.toFixed(2)}</Td>
                  <Td right mono className="font-bold text-navy-900 bg-green-100">
                    {totals.total.toFixed(2)}
                  </Td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Section 3: Flight summary */}
        <div className="px-6 py-5 border-b border-slate-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-3">
            Flight Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryLine label="Total Flights" value={formatNumber(totals.flights)} />
            <SummaryLine label="Average Revenue / Flight" value={formatCurrency(avgPerFlight)} />
            <SummaryLine label="Est. Tax (5%)" value={formatCurrency(taxEstimate)} />
            <SummaryLine label="Grand Total (incl. tax)" value={formatCurrency(grandTotal)} accent />
          </div>
        </div>

        {/* Signature block */}
        <div className="border-t border-slate-200 px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <SignatureBlock role="Prepared By" name="Amina Yusuf" />
          <SignatureBlock role="Checked By" name="Finance Officer" />
          <SignatureBlock role="Approved By" name="Management" />
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center pt-4">
        ⚠️ Demo data — real monthly report will load from{' '}
        <code className="font-mono">GET /api/reports/monthly?year={year}&month={MONTHS.indexOf(month) + 1}</code>.
      </p>
    </div>
  )
}

// ============================================================
function Th({ children, right = false }) {
  return (
    <th
      className={`px-3 py-2 text-[10px] font-semibold uppercase tracking-wider border-r border-white/10 last:border-r-0 ${
        right ? 'text-right' : 'text-left'
      }`}
    >
      {children}
    </th>
  )
}

function Td({ children, right = false, mono = false, className = '' }) {
  return (
    <td
      className={`px-3 py-2 border-r border-slate-100 last:border-r-0 ${
        right ? 'text-right' : 'text-left'
      } ${mono ? 'tabular-nums' : ''} ${className}`}
    >
      {children}
    </td>
  )
}

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

function CategoryTile({ label, value, accent = false }) {
  return (
    <div
      className={`border rounded-md px-3 py-2 ${
        accent ? 'bg-navy-50 border-navy-200' : 'bg-slate-50 border-slate-200'
      }`}
    >
      <p className="text-[10px] uppercase tracking-wider font-medium text-slate-500">
        {label}
      </p>
      <p
        className={`text-sm font-semibold tabular-nums mt-0.5 ${
          accent ? 'text-navy-900' : 'text-slate-800'
        }`}
      >
        {formatCurrency(value)}
      </p>
    </div>
  )
}

function SummaryLine({ label, value, accent = false }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">{label}</p>
      <p className={`text-base font-semibold tabular-nums ${accent ? 'text-navy-900' : 'text-slate-800'}`}>
        {value}
      </p>
    </div>
  )
}

function SignatureBlock({ role, name }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium mb-6">{role}</p>
      <div className="border-t border-slate-300 pt-2">
        <p className="text-xs font-medium text-slate-800">{name}</p>
        <p className="text-[10px] text-slate-500 mt-0.5">Signature</p>
      </div>
    </div>
  )
}