import {
  DollarSign,
  Plane,
  PlaneTakeoff,
  PlaneLanding,
  AlertCircle,
  TrendingUp,
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { useAuth } from '../hooks/useAuth'
import StatusBadge from '../components/common/StatusBadge'
import { formatCurrency, formatNumber } from '../utils/formatCurrency'

// ============================================================
// MOCK DATA — replace with API calls when backend is ready
// ============================================================

const summary = {
  todayRevenue: 8420.5,
  monthRevenue: 184320.0,
  totalFlights: 342,
  domesticFlights: 268,
  internationalFlights: 74,
  outstanding: 42310.75,
}

const revenueTrend = [
  { date: 'Sep 20', revenue: 6200 },
  { date: 'Sep 21', revenue: 7480 },
  { date: 'Sep 22', revenue: 5320 },
  { date: 'Sep 23', revenue: 9110 },
  { date: 'Sep 24', revenue: 8420 },
  { date: 'Sep 25', revenue: 7250 },
  { date: 'Sep 26', revenue: 8420 },
]

const revenueByAirline = [
  { airline: 'BlueSky', revenue: 5420, flights: 15 },
  { airline: 'Fokkar-50', revenue: 4830, flights: 12 },
  { airline: 'Royal', revenue: 2910, flights: 8 },
  { airline: 'Salaam', revenue: 3150, flights: 7 },
  { airline: 'Rayaam', revenue: 2240, flights: 6 },
  { airline: 'Hilaac', revenue: 1680, flights: 5 },
]

const revenueByCategory = [
  { name: 'Landing', value: 4220 },
  { name: 'Handling', value: 3150 },
  { name: 'Navigation', value: 2380 },
  { name: 'Cargo', value: 1420 },
  { name: 'Parking', value: 890 },
  { name: 'Domestic Pax', value: 1650 },
  { name: 'International Pax', value: 1180 },
  { name: 'Other', value: 420 },
]

const domesticVsInternational = [
  { name: 'Domestic', value: 268 },
  { name: 'International', value: 74 },
]

const recentTransactions = [
  { id: 1042, date: '2026-09-26', airline: 'BlueSky', aircraft: 'EMB30', total: 1182.0, status: 'PAID' },
  { id: 1041, date: '2026-09-26', airline: 'Fokkar-50', aircraft: 'Fokker-50', total: 724.0, status: 'PARTIALLY_PAID' },
  { id: 1040, date: '2026-09-26', airline: 'StarSky', aircraft: 'EMB30', total: 1440.0, status: 'UNPAID' },
  { id: 1039, date: '2026-09-26', airline: 'Saacid', aircraft: 'Fokker-50', total: 1230.0, status: 'PAID' },
  { id: 1038, date: '2026-09-25', airline: 'Jubba', aircraft: 'Fokker-50', total: 1245.0, status: 'PAID' },
  { id: 1037, date: '2026-09-25', airline: 'BlueSky', aircraft: 'EMB30', total: 1320.0, status: 'UNPAID' },
]

const CATEGORY_COLORS = ['#0f172a', '#1e40af', '#0891b2', '#0d9488', '#65a30d', '#ca8a04', '#c2410c', '#7c3aed']

// ============================================================

export default function Dashboard() {
  const { user } = useAuth()
  const currency = 'USD'

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Welcome back{user?.name ? `, ${user.name}` : ''}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Airport Financial Management System — Overview
          </p>
        </div>
        <div className="text-xs text-slate-500 bg-white border border-slate-200 rounded-md px-3 py-1.5">
          Last updated: {new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
        </div>
      </div>

      {/* ============ Summary Cards ============ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <SummaryCard
          label="Today's Revenue"
          value={formatCurrency(summary.todayRevenue, currency)}
          icon={DollarSign}
          tone="blue"
        />
        <SummaryCard
          label="This Month"
          value={formatCurrency(summary.monthRevenue, currency)}
          icon={TrendingUp}
          tone="green"
        />
        <SummaryCard
          label="Total Flights"
          value={formatNumber(summary.totalFlights)}
          icon={Plane}
          tone="slate"
        />
        <SummaryCard
          label="Domestic"
          value={formatNumber(summary.domesticFlights)}
          icon={PlaneLanding}
          tone="indigo"
        />
        <SummaryCard
          label="International"
          value={formatNumber(summary.internationalFlights)}
          icon={PlaneTakeoff}
          tone="cyan"
        />
        <SummaryCard
          label="Outstanding"
          value={formatCurrency(summary.outstanding, currency)}
          icon={AlertCircle}
          tone="amber"
        />
      </div>

      {/* ============ Revenue Trend + Domestic vs Intl ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card title="Revenue Trend (Last 7 Days)" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  formatter={(v) => formatCurrency(v, currency)}
                  contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0f172a"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#0f172a' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Domestic vs International">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={domesticVsInternational}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  <Cell fill="#0f172a" />
                  <Cell fill="#0891b2" />
                </Pie>
                <Tooltip
                  formatter={(v, n) => [formatNumber(v) + ' flights', n]}
                  contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ============ Revenue by Airline + By Category ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Revenue by Airline">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByAirline} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="airline" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  formatter={(v) => formatCurrency(v, currency)}
                  contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="revenue" fill="#1e40af" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Revenue by Category">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueByCategory}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 40, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  width={110}
                />
                <Tooltip
                  formatter={(v) => formatCurrency(v, currency)}
                  contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {revenueByCategory.map((_, i) => (
                    <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ============ Recent Transactions ============ */}
      <Card title="Recent Transactions" padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Airline</th>
                <th className="px-4 py-3 font-medium">Aircraft</th>
                <th className="px-4 py-3 font-medium text-right">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">#{tx.id}</td>
                  <td className="px-4 py-3 text-slate-700">{tx.date}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{tx.airline}</td>
                  <td className="px-4 py-3 text-slate-600">{tx.aircraft}</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-800 tabular-nums">
                    {formatCurrency(tx.total, currency)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={tx.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="text-xs text-slate-400 text-center pt-2">
        ⚠️ All values on this page are demo data. Connect the backend API to replace them with real figures.
      </p>
    </div>
  )
}

// ============================================================
// Reusable bits
// ============================================================

const TONE_STYLES = {
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-700',   icon: 'text-blue-600' },
  green:  { bg: 'bg-green-50',  text: 'text-green-700',  icon: 'text-green-600' },
  slate:  { bg: 'bg-slate-100', text: 'text-slate-700',  icon: 'text-slate-600' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', icon: 'text-indigo-600' },
  cyan:   { bg: 'bg-cyan-50',   text: 'text-cyan-700',   icon: 'text-cyan-600' },
  amber:  { bg: 'bg-amber-50',  text: 'text-amber-700',  icon: 'text-amber-600' },
}

function SummaryCard({ label, value, icon: Icon, tone = 'slate' }) {
  const s = TONE_STYLES[tone] || TONE_STYLES.slate
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
        <div className={`w-8 h-8 rounded-md flex items-center justify-center ${s.bg}`}>
          <Icon className={`w-4 h-4 ${s.icon}`} />
        </div>
      </div>
      <p className="text-lg font-semibold text-slate-800 tabular-nums truncate">{value}</p>
    </div>
  )
}

function Card({ title, children, className = '', padded = true }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-lg ${className}`}>
      {title && (
        <div className="px-4 py-3 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        </div>
      )}
      <div className={padded ? 'p-4' : ''}>{children}</div>
    </div>
  )
}