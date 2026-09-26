const STYLES = {
  // Transaction statuses
  DRAFT: 'bg-slate-100 text-slate-700 border-slate-200',
  POSTED: 'bg-blue-50 text-blue-700 border-blue-200',
  VOIDED: 'bg-red-50 text-red-700 border-red-200',
  // Payment statuses
  UNPAID: 'bg-red-50 text-red-700 border-red-200',
  PARTIALLY_PAID: 'bg-amber-50 text-amber-700 border-amber-200',
  PAID: 'bg-green-50 text-green-700 border-green-200',
  // Report statuses
  GENERATED: 'bg-blue-50 text-blue-700 border-blue-200',
  CHECKED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  APPROVED: 'bg-green-50 text-green-700 border-green-200',
  // Active/inactive
  ACTIVE: 'bg-green-50 text-green-700 border-green-200',
  INACTIVE: 'bg-slate-100 text-slate-600 border-slate-200',
}

export default function StatusBadge({ status }) {
  const key = String(status || '').toUpperCase()
  const cls = STYLES[key] || 'bg-slate-100 text-slate-700 border-slate-200'
  return (
    <span
      className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded border ${cls}`}
    >
      {key.replace(/_/g, ' ')}
    </span>
  )
}