import { useMemo, useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import {
  DollarSign,
  TrendingUp,
  Percent,
  Calendar,
  Download,
} from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import { formatCurrency } from '../utils/formatCurrency'

// ============================================================
// MOCK DATA
// ============================================================
const CATEGORIES = [
  { key: 'landing',        label: 'Landing Fees',           value: 4220.00, color: '#0f172a' },
  { key: 'handling',       label: 'Handling Charges',       value: 3150.00, color: '#1e40af' },
  { key: 'navigation',     label: 'Navigation Fees',        value: 2380.00, color: '#0891b2' },
  { key: 'domestic',       label: 'Domestic Passenger',     value: 1650.00, color: '#0d9488' },
  { key: 'international',  label: 'International Passenger', value: 1180.00, color: '#65a30d' },
  { key: 'cargo',          label: 'Cargo Fees',             value: 1420.00, color: '#ca8a04' },
  { key: 'parking',        label: 'Night Parking',          value: 890.00,  color: '#c2410c' },
  { key: 'chd_inf',        label: 'CHD / INF',              value: 340.00,  color: '#7c3aed' },
  { key: 'tax',            label: 'Tax',                    value: 620.00,  color: '#be185d' },
  { key: 'other',          label: 'Other Charges',          value: 420.00,  color: '#475569' },
]

const TOP_AIRLINES = [
  { airline: 'BlueSky',   category_total: 5420.00, share: 0.31 },
  { airline: 'Fokkar-50', category_total: 4830.00, share: 0.27 },
  { airline: 'Salaam',    category_total: 3150.00, share: 0.18 },
  { airline: 'Royal',     category_total: 2910.00, share: 0.16 },
  { airline: 'Rayaam',    category_total: 2240.00, share: 0.13 },
  { airline: 'Hilaac',    category_total: 1680.00, share: 0.10 },
]

// ============================================================
export default function RevenueReport() {
  const [period, setPeriod] = useState('this_month')

  const filtered = CATEGORIES
  const grandTotal = useMemo(() => filtered.reduce((s, c) => s + c.value, 0), [filtered])

  const chartData = useMemo(
    () => filtered.map((c) => ({ name: c.label, value: c.value, color: c.color })),
    [filtered]
  )

  const topCategory = useMemo(
    () => [...filtered].sort((a, b) => b.value - a.value)[0],
    [filtered]
  )

  return (
    <div className="max-w-[1600px] mx-auto">
      <PageHeader
        title="Revenue by Category"
        subtitle="Breakdown of airport revenue across all charge categories"
        actions={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="pl-9 pr-8 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy-800"
              >
                <option value="this_month">This Month</option>
                <option value="last_month">Last Month</option>
                <option value="this_quarter">This Quarter</option>
                <option value="this_year">This Year</option>
              </select>
            </div>
            <button className="inline-flex items-center gap-1.5 bg-navy-900 hover:bg-navy-800 text-white text-sm font-medium px-3 py-2 rounded-md transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        }
      />

      {/* Summary strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <SummaryTile
          icon={DollarSign}
          label="Total Revenue"
          value={formatCurrency(grandTotal)}
          tone="blue"
        />
        <SummaryTile
          icon={TrendingUp}
          label="Top Category"
          value={topCategory.label}
          sub={formatCurrency(topCategory.value)}
          tone="green"
        />
        <SummaryTile
          icon={Percent}
          label="Categories Tracked"
          value={String(filtered.length)}
          sub="All active fee types"
          tone="slate"
        />
      </div>

      {/* Chart + table */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Revenue Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => formatCurrency(v)}
                  contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11 }}
                  iconType="circle"
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700">Category Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                  <th className="px-4 py-3 font-medium text-right">Share</th>
                  <th className="px-4 py-3 font-medium w-40">Distribution</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const pct = grandTotal > 0 ? (c.value / grandTotal) * 100 : 0
                  return (
                    <tr key={c.key} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: c.color }}
                          />
                          <span className="font-medium text-slate-800">{c.label}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums font-medium text-slate-800">
                        {formatCurrency(c.value)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-600">
                        {pct.toFixed(1)}%
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${pct}%`, backgroundColor: c.color }}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 border-t-2 border-slate-200">
                  <td className="px-4 py-3 text-sm font-semibold text-slate-800">Total</td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold text-slate-800">
                    {formatCurrency(grandTotal)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold text-slate-800">
                    100.0%
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* By airline */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700">Top Contributors by Airline</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3 font-medium">Airline</th>
                <th className="px-4 py-3 font-medium text-right">Revenue</th>
                <th className="px-4 py-3 font-medium text-right">Share of Total</th>
                <th className="px-4 py-3 font-medium w-48">Distribution</th>
              </tr>
            </thead>
            <tbody>
              {TOP_AIRLINES.map((a) => (
                <tr key={a.airline} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{a.airline}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-800">
                    {formatCurrency(a.category_total)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-600">
                    {(a.share * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-navy-900"
                        style={{ width: `${a.share * 100}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center pt-4">
        ⚠️ Demo data — real revenue breakdown will load from{' '}
        <code className="font-mono">GET /api/reports/revenue</code> once the backend is connected.
      </p>
    </div>
  )
}

// ============================================================
function SummaryTile({ icon: Icon, label, value, sub, tone = 'slate' }) {
  const tones = {
    blue:  { bg: 'bg-blue-50',  icon: 'text-blue-600' },
    green: { bg: 'bg-green-50', icon: 'text-green-600' },
    slate: { bg: 'bg-slate-100', icon: 'text-slate-600' },
  }
  const t = tones[tone] || tones.slate
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
        <div className={`w-8 h-8 rounded-md flex items-center justify-center ${t.bg}`}>
          <Icon className={`w-4 h-4 ${t.icon}`} />
        </div>
      </div>
      <p className="text-lg font-semibold text-slate-800 tabular-nums truncate">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  )
}