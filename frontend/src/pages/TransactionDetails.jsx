import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Printer,
  Download,
  Ban,
  DollarSign,
  Plus,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  User as UserIcon,
  Plane,
  Calendar,
  X,
} from 'lucide-react'
import StatusBadge from '../components/common/StatusBadge'
import { formatCurrency } from '../utils/formatCurrency'

// ============================================================
// MOCK DATA
// ============================================================
const MOCK_TRANSACTION = {
  id: 1042,
  date: '2026-09-26',
  created_at: '2026-09-26T08:15:22Z',
  updated_at: '2026-09-26T08:35:04Z',
  flight: {
    flight_number: 'BS-101',
    flight_date: '2026-09-26',
    airline: 'BlueSky',
    airline_code: 'BS',
    aircraft: '6O-BSA',
    aircraft_type: 'EMB30',
    flight_type: 'DOMESTIC',
    direction: 'ARRIVAL',
    origin: 'Mogadishu',
    destination: 'Kismayo',
    adults: 24,
    children: 2,
    infants: 1,
  },
  charges: {
    landing: 100.00,
    handling: 110.00,
    navigation: 84.00,
    cargo: 0.00,
    night_parking: 0.00,
    chd_inf: 3.00,        // 3 × $1
    domestic_passenger: 48.00,  // 24 × $2
    international_passenger: 0.00,
    other: 0.00,
  },
  subtotal: 345.00,
  tax_amount: 17.25,
  total_amount: 362.25,
  currency: 'USD',
  transaction_status: 'POSTED',
  payment_status: 'PAID',
  notes: 'Regular scheduled flight.',
  created_by: 'Amina Yusuf',
  updated_by: 'Demo Administrator',
  voided_by: null,
  voided_at: null,
  void_reason: null,
}

const MOCK_PAYMENTS = [
  {
    id: 501,
    date: '2026-09-26',
    method: 'BANK_TRANSFER',
    amount: 362.25,
    reference: 'TRF-88421',
    received_by: 'Demo Administrator',
    notes: 'Full settlement via Dahabshiil.',
    created_at: '2026-09-26T08:35:04Z',
  },
]

const MOCK_AUDIT = [
  { id: 1022, timestamp: '2026-09-26T08:15:22Z', user: 'Amina Yusuf',        action: 'CREATE_TRANSACTION', details: 'Transaction created with total $362.25' },
  { id: 1023, timestamp: '2026-09-26T08:35:04Z', user: 'Demo Administrator', action: 'CREATE_PAYMENT',     details: 'Payment of $362.25 recorded (Bank Transfer)' },
]

const METHOD_LABELS = {
  CASH: 'Cash',
  BANK_TRANSFER: 'Bank Transfer',
  CARD: 'Card',
  MOBILE_MONEY: 'Mobile Money',
  OTHER: 'Other',
}

const fmtDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
}

// ============================================================
export default function TransactionDetails() {
  const navigate = useNavigate()
  const { id } = useParams()

  const tx = MOCK_TRANSACTION
  const payments = MOCK_PAYMENTS
  const audit = MOCK_AUDIT

  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showVoidModal, setShowVoidModal] = useState(false)

  const paidAmount = payments.reduce((s, p) => s + p.amount, 0)
  const outstanding = tx.total_amount - paidAmount

  const isVoided = tx.transaction_status === 'VOIDED'

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Back link */}
      <div className="mb-4">
        <button
          onClick={() => navigate('/transactions')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Transactions
        </button>
      </div>

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 mb-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-semibold text-slate-800">
                Transaction #{tx.id}
              </h2>
              <StatusBadge status={tx.transaction_status} />
              <StatusBadge status={tx.payment_status} />
            </div>
            <p className="text-sm text-slate-500">
              {tx.flight.flight_number} · {tx.flight.airline} · {tx.date}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 border border-slate-300 hover:bg-slate-50 px-3 py-2 rounded-md"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
            <button
              onClick={() => alert('Would export this transaction as PDF.')}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 border border-slate-300 hover:bg-slate-50 px-3 py-2 rounded-md"
            >
              <Download className="w-3.5 h-3.5" />
              Export PDF
            </button>
            {!isVoided && (
              <button
                onClick={() => setShowVoidModal(true)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 border border-red-300 hover:bg-red-50 px-3 py-2 rounded-md"
              >
                <Ban className="w-3.5 h-3.5" />
                Void
              </button>
            )}
          </div>
        </div>

        {isVoided && (
          <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-red-800">
              <p className="font-semibold">Voided by {tx.voided_by} on {fmtDate(tx.voided_at)}</p>
              <p className="mt-0.5">Reason: {tx.void_reason}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ============ LEFT ============ */}
        <div className="lg:col-span-2 space-y-4">
          {/* Flight info */}
          <Card icon={Plane} title="Flight Information">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <InfoCell label="Flight Number" value={tx.flight.flight_number} mono />
              <InfoCell label="Flight Date" value={tx.flight.flight_date} />
              <InfoCell label="Airline" value={`${tx.flight.airline} (${tx.flight.airline_code})`} />
              <InfoCell
                label="Aircraft"
                value={`${tx.flight.aircraft} · ${tx.flight.aircraft_type}`}
                mono
              />
              <InfoCell label="Flight Type" value={tx.flight.flight_type} />
              <InfoCell label="Direction" value={tx.flight.direction} />
              <InfoCell label="Origin" value={tx.flight.origin || '—'} />
              <InfoCell label="Destination" value={tx.flight.destination || '—'} />
            </div>

            <div className="mt-5 pt-5 border-t border-slate-200">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
                Passengers
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <InfoCell label="Adults" value={tx.flight.adults} mono />
                <InfoCell label="Children" value={tx.flight.children} mono />
                <InfoCell label="Infants" value={tx.flight.infants} mono />
                <InfoCell
                  label="Total"
                  value={tx.flight.adults + tx.flight.children + tx.flight.infants}
                  mono
                  strong
                />
              </div>
            </div>
          </Card>

          {/* Charge breakdown */}
          <Card icon={DollarSign} title="Charge Breakdown">
            <div className="space-y-2">
              <ChargeRow label="Landing Fee" value={tx.charges.landing} />
              <ChargeRow label="Handling Fee" value={tx.charges.handling} />
              <ChargeRow label="Navigation Fee" value={tx.charges.navigation} />
              <ChargeRow
                label={`Domestic Passenger Fee (${tx.flight.adults} pax)`}
                value={tx.charges.domestic_passenger}
              />
              <ChargeRow
                label={`International Passenger Fee`}
                value={tx.charges.international_passenger}
              />
              <ChargeRow
                label={`CHD / INF (${tx.flight.children + tx.flight.infants})`}
                value={tx.charges.chd_inf}
              />
              <ChargeRow label="Cargo Fee" value={tx.charges.cargo} />
              <ChargeRow label="Night Parking" value={tx.charges.night_parking} />
              <ChargeRow label="Other Charges" value={tx.charges.other} />

              <div className="border-t border-slate-200 pt-3 mt-3 space-y-2">
                <ChargeRow label="Subtotal" value={tx.subtotal} bold />
                <ChargeRow label="Tax" value={tx.tax_amount} />
              </div>

              <div className="border-t-2 border-navy-900 pt-3 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-800">Total Amount</span>
                  <span className="text-xl font-bold text-navy-900 tabular-nums">
                    {formatCurrency(tx.total_amount, tx.currency)}
                  </span>
                </div>
              </div>
            </div>

            {tx.notes && (
              <div className="mt-5 pt-5 border-t border-slate-200">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                  Notes
                </p>
                <p className="text-sm text-slate-700">{tx.notes}</p>
              </div>
            )}
          </Card>

          {/* Payment history */}
          <Card
            icon={CreditCard}
            title="Payment History"
            action={
              !isVoided && outstanding > 0 && (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-navy-900 hover:text-navy-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Record Payment
                </button>
              )
            }
          >
            {/* Summary bar */}
            <div className="grid grid-cols-3 gap-4 mb-5 p-3 bg-slate-50 rounded-md">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                  Total
                </p>
                <p className="text-sm font-semibold text-slate-800 tabular-nums">
                  {formatCurrency(tx.total_amount, tx.currency)}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                  Paid
                </p>
                <p className="text-sm font-semibold text-green-700 tabular-nums">
                  {formatCurrency(paidAmount, tx.currency)}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                  Outstanding
                </p>
                <p className={`text-sm font-semibold tabular-nums ${outstanding > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                  {outstanding > 0 ? formatCurrency(outstanding, tx.currency) : '—'}
                </p>
              </div>
            </div>

            {payments.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">
                No payments recorded yet.
              </p>
            ) : (
              <div className="overflow-x-auto -mx-5">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                      <th className="px-5 py-2 font-medium">Date</th>
                      <th className="px-5 py-2 font-medium">Method</th>
                      <th className="px-5 py-2 font-medium">Reference</th>
                      <th className="px-5 py-2 font-medium">Received By</th>
                      <th className="px-5 py-2 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id} className="border-b border-slate-100 last:border-b-0">
                        <td className="px-5 py-3 text-slate-700">{p.date}</td>
                        <td className="px-5 py-3 text-slate-700">
                          {METHOD_LABELS[p.method] || p.method}
                        </td>
                        <td className="px-5 py-3 font-mono text-xs text-slate-600">
                          {p.reference}
                        </td>
                        <td className="px-5 py-3 text-xs text-slate-600">{p.received_by}</td>
                        <td className="px-5 py-3 text-right tabular-nums font-medium text-green-700">
                          {formatCurrency(p.amount, tx.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* ============ RIGHT ============ */}
        <div className="space-y-4">
          {/* Meta card */}
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
              Record Information
            </h3>
            <div className="space-y-3">
              <MetaRow
                icon={UserIcon}
                label="Created By"
                value={`${tx.created_by} · ${fmtDate(tx.created_at)}`}
              />
              <MetaRow
                icon={Clock}
                label="Last Updated"
                value={`${tx.updated_by} · ${fmtDate(tx.updated_at)}`}
              />
              <MetaRow icon={FileText} label="Currency" value={tx.currency} />
            </div>
          </div>

          {/* Audit trail */}
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-4">
              Audit History
            </h3>
            <div className="space-y-4">
              {audit.map((a, i) => (
                <div key={a.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-navy-50 border border-navy-100 flex items-center justify-center flex-shrink-0">
                      {a.action.includes('CREATE') ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-navy-900" />
                      ) : a.action.includes('VOID') ? (
                        <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-slate-600" />
                      )}
                    </div>
                    {i < audit.length - 1 && (
                      <div className="w-px flex-1 bg-slate-200 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <p className="text-xs font-semibold text-slate-800">
                      {a.action.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">{a.details}</p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {a.user} · {fmtDate(a.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center pt-6">
        ⚠️ Demo — real data will load from{' '}
        <code className="font-mono">GET /api/transactions/{id || ':id'}</code>.
      </p>

      {/* ===== Record Payment Modal ===== */}
      {showPaymentModal && (
        <SimpleModal
          title="Record Payment"
          onClose={() => setShowPaymentModal(false)}
          onConfirm={() => {
            alert('Would record payment. Backend will validate against outstanding balance.')
            setShowPaymentModal(false)
          }}
          confirmLabel="Record Payment"
        >
          <p className="text-xs text-slate-500 mb-3">
            Outstanding: <span className="font-semibold text-amber-700">{formatCurrency(outstanding, tx.currency)}</span>
          </p>
          <Field label="Amount">
            <input
              type="number"
              step="0.01"
              defaultValue={outstanding.toFixed(2)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800 tabular-nums"
            />
          </Field>
          <Field label="Method">
            <select className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy-800">
              <option>Cash</option>
              <option>Bank Transfer</option>
              <option>Card</option>
              <option>Mobile Money</option>
              <option>Other</option>
            </select>
          </Field>
          <Field label="Reference">
            <input
              placeholder="e.g. TRF-88422"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800 font-mono"
            />
          </Field>
        </SimpleModal>
      )}

      {/* ===== Void Modal ===== */}
      {showVoidModal && (
        <SimpleModal
          title="Void Transaction"
          onClose={() => setShowVoidModal(false)}
          onConfirm={() => {
            alert('Would void transaction. A reason is required.')
            setShowVoidModal(false)
          }}
          confirmLabel="Void Transaction"
          danger
        >
          <p className="text-xs text-slate-500 mb-3">
            The transaction will not be deleted. It will be marked VOIDED and excluded from
            financial totals.
          </p>
          <Field label="Reason *">
            <textarea
              rows={3}
              placeholder="e.g. Incorrect aircraft information"
              className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-navy-800 resize-none"
            />
          </Field>
        </SimpleModal>
      )}
    </div>
  )
}

// ============================================================
function Card({ icon: Icon, title, action, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg">
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-navy-900" />
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function InfoCell({ label, value, mono, strong }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">{label}</p>
      <p
        className={`mt-0.5 text-slate-800 ${
          mono ? 'font-mono text-sm' : 'text-sm'
        } ${strong ? 'font-semibold' : ''}`}
      >
        {value}
      </p>
    </div>
  )
}

function ChargeRow({ label, value, bold = false }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={bold ? 'font-medium text-slate-800' : 'text-slate-600'}>{label}</span>
      <span
        className={`tabular-nums ${
          bold ? 'font-semibold text-slate-900' : 'text-slate-700'
        }`}
      >
        {formatCurrency(value)}
      </span>
    </div>
  )
}

function MetaRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-md bg-slate-50 flex items-center justify-center flex-shrink-0">
        <Icon className="w-3.5 h-3.5 text-slate-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">{label}</p>
        <p className="text-xs text-slate-800 mt-0.5 truncate">{value}</p>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      {children}
    </div>
  )
}

function SimpleModal({ title, children, onClose, onConfirm, confirmLabel, danger = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
        <div className="flex justify-end gap-2 px-5 py-3 bg-slate-50 border-t border-slate-200 rounded-b-lg">
          <button
            onClick={onClose}
            className="text-sm font-medium text-slate-600 hover:text-slate-800 px-3 py-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`text-sm font-medium text-white px-3 py-2 rounded-md ${
              danger ? 'bg-red-600 hover:bg-red-700' : 'bg-navy-900 hover:bg-navy-800'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}