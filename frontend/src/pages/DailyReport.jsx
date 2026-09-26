import { useMemo, useState } from 'react'
import {
  Calendar,
  Download,
  FileText,
  FileSpreadsheet,
  Printer,
} from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import { formatCurrency } from '../utils/formatCurrency'

// ============================================================
// MOCK DATA — mirrors the reference images
// ============================================================
const MOCK_DAILY_ROWS = [
  { id: 1, airline: 'BlueSky',   aircraft: 'EMB30',     landing: 100, handling: 110, navigation: 84, cargo: 0,    parking: 0,  chd_inf: 0,  adults: 24, domestic: 24, international: 0,  other: 0, tax: 0 },
  { id: 2, airline: 'StarSky',   aircraft: 'Fokker-50', landing: 200, handling: 210, navigation: 84, cargo: 0,    parking: 0,  chd_inf: 0,  adults: 28, domestic: 28, international: 0,  other: 0, tax: 0 },
  { id: 3, airline: 'StarSky',   aircraft: 'EMB30',     landing: 100, handling: 110, navigation: 84, cargo: 160,  parking: 0,  chd_inf: 0,  adults: 44, domestic: 44, international: 0,  other: 0, tax: 0 },
  { id: 4, airline: 'Saacid',    aircraft: 'Fokker-50', landing: 200, handling: 210, navigation: 84, cargo: 160,  parking: 0,  chd_inf: 0,  adults: 43, domestic: 43, international: 0,  other: 0, tax: 0 },
  { id: 5, airline: 'Jubba',     aircraft: 'Fokker-50', landing: 200, handling: 210, navigation: 84, cargo: 160,  parking: 0,  chd_inf: 0,  adults: 50, domestic: 50, international: 0,  other: 0, tax: 0 },
  { id: 6, airline: 'BlueSky',   aircraft: 'EMB30',     landing: 100, handling: 110, navigation: 84, cargo: 0,    parking: 0,  chd_inf: 0,  adults: 25, domestic: 25, international: 0,  other: 0, tax: 0 },
  { id: 7, airline: 'Payaam',    aircraft: 'Fokker-50', landing: 200, handling: 210, navigation: 84, cargo: 0,    parking: 0,  chd_inf: 0,  adults: 26, domestic: 26, international: 0,  other: 0, tax: 0 },
  { id: 8, airline: 'Salaam',    aircraft: 'Fokker-50', landing: 200, handling: 210, navigation: 84, cargo: 160,  parking: 0,  chd_inf: 0,  adults: 27, domestic: 27, international: 0,  other: 0, tax: 0 },
  { id: 9, airline: 'Hilaac',    aircraft: 'EMB30',     landing: 100, handling: 110, navigation: 84, cargo: 160,  parking: 0,  chd_inf: 0,  adults: 32, domestic: 32, international: 0,  other: 0, tax: 0 },
  { id: 10, airline: 'Royal',   aircraft: 'EMB30',     landing: 100, handling: 110, navigation: 84, cargo: 0,    parking: 0,  chd_inf: 0,  adults: 21, domestic: 21, international: 0,  other: 0, tax: 0 },
  { id: 11, airline: 'Fly-24',  aircraft: 'Fokker-50', landing: 200, handling: 210, navigation: 84, cargo: 0,    parking: 0,  chd_inf: 0,  adults: 47, domestic: 47, international: 0,  other: 0, tax: 0 },
  { id: 12, airline: 'Fly-24',  aircraft: 'Fokker-50', landing: 200, handling: 210, navigation: 84, cargo: 0,    parking: 0,  chd_inf: 0,  adults: 50, domestic: 50, international: 0,  other: 0, tax: 0 },
  { id: 13, airline: 'Daaruro', aircraft: 'EMB30',     landing: 100, handling: 110, navigation: 84, cargo: 0,    parking: 0,  chd_inf: 0,  adults: 0,  domestic: 0,  international: 0,  other: 0, tax: 0 },
  { id: 14, airline: 'BlueSky', aircraft: 'EMB30',     landing: 100, handling: 110, navigation: 84, cargo: 0,    parking: 0,  chd_inf: 0,  adults: 19, domestic: 19, international: 0,  other: 0, tax: 0 },
  { id: 15, airline: 'SY-BYH',  aircraft: 'Fokker-50', landing: 180, handling: 110, navigation: 84, cargo: 0,    parking: 0,  chd_inf: 0,  adults: 26, domestic: 26, international: 0,  other: 0, tax: 0 },
  { id: 16, airline: 'SY-GMA',  aircraft: 'Fokker-50', landing: 610, handling: 110, navigation: 84, cargo: 250,  parking: 0,  chd_inf: 0,  adults: 13, domestic: 13, international: 0,  other: 0, tax: 0 },
]

// ============================================================
export default function DailyReport() {
  const [date, setDate] = useState('2026-09-26')

  const rows = useMemo(() => {
    return MOCK_DAILY_ROWS.map((r) => {
      const domesticAmount = r.domestic * 2
      const internationalAmount = r.international * 5
      const subtotal =
        r.landing + r.handling + r.navigation + r.cargo + r.parking +
        r.chd_inf + domesticAmount + internationalAmount + r.other
      const total = subtotal + r.tax
      return {
        ...r,
        domestic_amount: domesticAmount,
        international_amount: internationalAmount,
        subtotal,
        total,
      }
    })
  }, [])

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, r) => ({
        landing: acc.landing + r.landing,
        handling: acc.handling + r.handling,
        navigation: acc.navigation + r.navigation,
        cargo: acc.cargo + r.cargo,
        parking: acc.parking + r.parking,
        chd_inf: acc.chd_inf + r.chd_inf,
        adults: acc.adults + r.adults,
        domestic: acc.domestic + r.domestic_amount,
        international: acc.international + r.international_amount,
        other: acc.other + r.other,
        tax: acc.tax + r.tax,
        subtotal: acc.subtotal + r.subtotal,
        total: acc.total + r.total,
      }),
      {
        landing: 0, handling: 0, navigation: 0, cargo: 0, parking: 0,
        chd_inf: 0, adults: 0, domestic: 0, international: 0, other: 0,
        tax: 0, subtotal: 0, total: 0,
      }
    )
  }, [rows])

  const exportMock = (fmt) => {
    alert(`Would export daily report as ${fmt} for ${date}.\nReal download comes once the backend generates files.`)
  }

  return (
    <div className="max-w-[1800px] mx-auto">
      <PageHeader
        title="Daily Financial Report"
        subtitle="One-day airport revenue summary"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy-800"
              />
            </div>
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

      {/* ============ Report document ============ */}
      <div className="bg-white border border-slate-300 rounded-lg overflow-hidden shadow-sm">
        {/* Report header */}
        <div className="text-center px-6 py-6 border-b-2 border-navy-900">
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
            AIRPORT FINANCIAL MANAGEMENT SYSTEM
          </p>
          <h2 className="text-lg font-bold text-navy-900 mt-1">
            DAILY FINANCIAL REPORT
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Date: <span className="font-medium">{date}</span>
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-navy-900 text-white text-left">
                <Th className="w-10">#</Th>
                <Th>Company / Airline</Th>
                <Th>Aircraft</Th>
                <Th right>Landing</Th>
                <Th right>Handling</Th>
                <Th right>Nav</Th>
                <Th right>Cargo</Th>
                <Th right>Night<br />Parking</Th>
                <Th right>CHD/INF</Th>
                <Th right>Adults</Th>
                <Th right>Domestic</Th>
                <Th right>International</Th>
                <Th right>Other</Th>
                <Th right>Total</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={r.id}
                  className={`border-b border-slate-200 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}
                >
                  <Td className="text-slate-400 tabular-nums">{i + 1}</Td>
                  <Td className="font-medium text-slate-800">{r.airline}</Td>
                  <Td className="text-slate-600">{r.aircraft}</Td>
                  <Td right mono>{r.landing.toFixed(2)}</Td>
                  <Td right mono>{r.handling.toFixed(2)}</Td>
                  <Td right mono>{r.navigation.toFixed(2)}</Td>
                  <Td right mono>{r.cargo.toFixed(2)}</Td>
                  <Td right mono>{r.parking.toFixed(2)}</Td>
                  <Td right mono>{r.chd_inf.toFixed(2)}</Td>
                  <Td right mono>{r.adults}</Td>
                  <Td right mono>{r.domestic_amount.toFixed(2)}</Td>
                  <Td right mono>{r.international_amount.toFixed(2)}</Td>
                  <Td right mono>{r.other.toFixed(2)}</Td>
                  <Td right mono className="font-semibold text-navy-900">
                    {r.total.toFixed(2)}
                  </Td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-green-50 border-t-2 border-green-300">
                <td />
                <td colSpan={2} className="px-3 py-3 text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Total
                </td>
                <Td right mono className="font-semibold text-slate-800">{totals.landing.toFixed(2)}</Td>
                <Td right mono className="font-semibold text-slate-800">{totals.handling.toFixed(2)}</Td>
                <Td right mono className="font-semibold text-slate-800">{totals.navigation.toFixed(2)}</Td>
                <Td right mono className="font-semibold text-slate-800">{totals.cargo.toFixed(2)}</Td>
                <Td right mono className="font-semibold text-slate-800">{totals.parking.toFixed(2)}</Td>
                <Td right mono className="font-semibold text-slate-800">{totals.chd_inf.toFixed(2)}</Td>
                <Td right mono className="font-semibold text-slate-800">{totals.adults}</Td>
                <Td right mono className="font-semibold text-slate-800">{totals.domestic.toFixed(2)}</Td>
                <Td right mono className="font-semibold text-slate-800">{totals.international.toFixed(2)}</Td>
                <Td right mono className="font-semibold text-slate-800">{totals.other.toFixed(2)}</Td>
                <Td right mono className="font-bold text-navy-900 bg-green-100">
                  {totals.total.toFixed(2)}
                </Td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Summary box */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryLine label="Subtotal" value={formatCurrency(totals.subtotal)} />
            <SummaryLine label="Tax" value={formatCurrency(totals.tax)} />
            <SummaryLine label="Grand Total" value={formatCurrency(totals.total)} accent />
            <SummaryLine label="Total Flights" value={String(rows.length)} />
          </div>
        </div>

        {/* Signature block */}
        <div className="border-t border-slate-200 px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <SignatureBlock role="Prepared By" name="Demo Administrator" />
          <SignatureBlock role="Checked By" name="Finance Officer" />
          <SignatureBlock role="Approved By" name="Management" />
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center pt-4">
        ⚠️ Demo data — real daily report will load from{' '}
        <code className="font-mono">GET /api/reports/daily?date=YYYY-MM-DD</code> once the backend is connected.
      </p>
    </div>
  )
}

// ============================================================
// Table helpers
// ============================================================
function Th({ children, right = false, className = '' }) {
  return (
    <th
      className={`px-3 py-2 text-[10px] font-semibold uppercase tracking-wider border-r border-white/10 last:border-r-0 ${
        right ? 'text-right' : 'text-left'
      } ${className}`}
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