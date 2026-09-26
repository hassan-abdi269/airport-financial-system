import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  Send,
  Calculator,
  AlertCircle,
  Info,
  Plane,
  Users,
  DollarSign,
} from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import { formatCurrency } from '../utils/formatCurrency'

// ============================================================
// MOCK MASTER DATA (would come from GET /api/airlines and /api/aircraft)
// ============================================================
const AIRLINES = [
  { id: 1, name: 'BlueSky',   code: 'BS' },
  { id: 2, name: 'Fokkar-50', code: 'FK' },
  { id: 3, name: 'Royal',     code: 'RY' },
  { id: 4, name: 'Salaam',    code: 'SL' },
  { id: 5, name: 'Rayaam',    code: 'RA' },
  { id: 6, name: 'Hilaac',    code: 'HL' },
]

const AIRCRAFT = [
  { id: 1, registration_number: '6O-BSA', aircraft_type: 'EMB30',     airline_id: 1 },
  { id: 2, registration_number: '6O-BSB', aircraft_type: 'EMB30',     airline_id: 1 },
  { id: 3, registration_number: '6O-FKA', aircraft_type: 'Fokker-50', airline_id: 2 },
  { id: 4, registration_number: '6O-RYA', aircraft_type: 'EMB30',     airline_id: 3 },
  { id: 5, registration_number: '6O-SLA', aircraft_type: 'Fokker-50', airline_id: 4 },
  { id: 6, registration_number: '6O-RAA', aircraft_type: 'Fokker-50', airline_id: 5 },
  { id: 7, registration_number: '6O-HLA', aircraft_type: 'EMB30',     airline_id: 6 },
]

// ============================================================
// MOCK FEE RATES (would come from GET /api/fees?active=true)
// ============================================================
const FEES = {
  landing: {
    EMB30: 100,
    'Fokker-50': 200,
    'Boeing 737': 380,
  },
  handling: {
    EMB30: 110,
    'Fokker-50': 210,
    'Boeing 737': 300,
  },
  navigation: 84,
  cargo_per_kg: 1.5,
  night_parking: 65,
  domestic_passenger: 2,
  international_passenger: 5,
  chd_inf: 1,
  tax_percent: 5,
}

// ============================================================
export default function TransactionForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  // -------- Form state --------
  const [airlineId, setAirlineId] = useState('')
  const [aircraftId, setAircraftId] = useState('')
  const [flightNumber, setFlightNumber] = useState('')
  const [flightDate, setFlightDate] = useState(new Date().toISOString().slice(0, 10))
  const [flightType, setFlightType] = useState('DOMESTIC')
  const [direction, setDirection] = useState('ARRIVAL')
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')

  const [adults, setAdults] = useState(0)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)

  // Manual override charges
  const [cargoKg, setCargoKg] = useState(0)
  const [nightParking, setNightParking] = useState(false)
  const [otherCharge, setOtherCharge] = useState(0)
  const [notes, setNotes] = useState('')

  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // -------- Derived --------
  const selectedAircraft = useMemo(
    () => AIRCRAFT.find((a) => a.id === Number(aircraftId)),
    [aircraftId]
  )
  const selectedAirline = useMemo(
    () => AIRLINES.find((a) => a.id === Number(airlineId)),
    [airlineId]
  )

  const airlineAircraft = useMemo(
    () => (airlineId ? AIRCRAFT.filter((a) => a.airline_id === Number(airlineId)) : []),
    [airlineId]
  )

  const calc = useMemo(() => {
    const type = selectedAircraft?.aircraft_type
    const landing = type ? FEES.landing[type] || 0 : 0
    const handling = type ? FEES.handling[type] || 0 : 0
    const navigation = type ? FEES.navigation : 0
    const cargo = cargoKg * FEES.cargo_per_kg
    const parking = nightParking ? FEES.night_parking : 0

    const domesticPax = flightType === 'DOMESTIC' ? adults : 0
    const internationalPax = flightType === 'INTERNATIONAL' ? adults : 0
    const domesticFee = domesticPax * FEES.domestic_passenger
    const internationalFee = internationalPax * FEES.international_passenger
    const chdInfFee = (children + infants) * FEES.chd_inf

    const subtotal =
      landing + handling + navigation + cargo + parking +
      domesticFee + internationalFee + chdInfFee + Number(otherCharge || 0)

    const tax = subtotal * (FEES.tax_percent / 100)
    const total = subtotal + tax

    return {
      landing, handling, navigation, cargo, parking,
      domesticFee, internationalFee, chdInfFee,
      subtotal, tax, total,
    }
  }, [selectedAircraft, cargoKg, nightParking, flightType, adults, children, infants, otherCharge])

  // -------- Submit --------
  const handleSubmit = (status) => {
    setError('')
    if (!airlineId) return setError('Airline is required.')
    if (!aircraftId) return setError('Aircraft is required.')
    if (!flightNumber.trim()) return setError('Flight number is required.')
    if (!flightDate) return setError('Flight date is required.')
    if (adults < 0 || children < 0 || infants < 0) return setError('Passenger counts cannot be negative.')
    if (adults + children + infants === 0) return setError('At least one passenger is required.')

    setSubmitting(true)
    setTimeout(() => {
      alert(
        `Would ${status === 'DRAFT' ? 'save as draft' : 'post'} transaction:\n` +
        `Flight: ${flightNumber} (${selectedAirline?.name})\n` +
        `Aircraft: ${selectedAircraft?.registration_number}\n` +
        `Total: ${formatCurrency(calc.total)}\n\n` +
        `Backend will RE-CALCULATE all values — never trust client totals.`
      )
      setSubmitting(false)
      navigate('/transactions')
    }, 400)
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="mb-4">
        <button
          onClick={() => navigate('/transactions')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Transactions
        </button>
      </div>

      <PageHeader
        title={isEdit ? `Edit Transaction #${id}` : 'New Transaction'}
        subtitle="Record airport revenue for a flight — charges calculated live"
      />

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-3 mb-4">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* ============ LEFT: Flight + Passengers + Charges ============ */}
        <div className="xl:col-span-2 space-y-4">
          {/* Flight */}
          <Card icon={Plane} title="Flight Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Airline" required>
                <select
                  value={airlineId}
                  onChange={(e) => {
                    setAirlineId(e.target.value)
                    setAircraftId('')
                  }}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy-800"
                >
                  <option value="">— Select airline —</option>
                  {AIRLINES.map((a) => (
                    <option key={a.id} value={a.id}>{a.name} ({a.code})</option>
                  ))}
                </select>
              </Field>

              <Field label="Aircraft" required>
                <select
                  value={aircraftId}
                  onChange={(e) => setAircraftId(e.target.value)}
                  disabled={!airlineId}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy-800 disabled:bg-slate-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {airlineId ? '— Select aircraft —' : 'Select an airline first'}
                  </option>
                  {airlineAircraft.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.registration_number} · {a.aircraft_type}
                    </option>
                  ))}
                </select>
                {selectedAircraft && (
                  <p className="text-[11px] text-slate-500 mt-1">
                    Type: <span className="font-medium">{selectedAircraft.aircraft_type}</span>
                  </p>
                )}
              </Field>

              <Field label="Flight Number" required>
                <input
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                  placeholder="BS-101"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800 font-mono uppercase"
                />
              </Field>

              <Field label="Flight Date" required>
                <input
                  type="date"
                  value={flightDate}
                  onChange={(e) => setFlightDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </Field>

              <Field label="Flight Type" required>
                <div className="flex gap-2">
                  {['DOMESTIC', 'INTERNATIONAL'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFlightType(t)}
                      className={`flex-1 text-xs font-medium py-2 rounded-md border transition-colors ${
                        flightType === t
                          ? 'border-navy-900 bg-navy-50 text-navy-900 ring-1 ring-navy-900'
                          : 'border-slate-300 text-slate-600 hover:border-slate-400'
                      }`}
                    >
                      {t === 'DOMESTIC' ? 'Domestic' : 'International'}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Direction" required>
                <div className="flex gap-2">
                  {['ARRIVAL', 'DEPARTURE'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDirection(d)}
                      className={`flex-1 text-xs font-medium py-2 rounded-md border transition-colors ${
                        direction === d
                          ? 'border-navy-900 bg-navy-50 text-navy-900 ring-1 ring-navy-900'
                          : 'border-slate-300 text-slate-600 hover:border-slate-400'
                      }`}
                    >
                      {d === 'ARRIVAL' ? 'Arrival' : 'Departure'}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Origin">
                <input
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. Mogadishu"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </Field>

              <Field label="Destination">
                <input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Kismayo"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </Field>
            </div>
          </Card>

          {/* Passengers */}
          <Card icon={Users} title="Passengers">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <PassengerField label="Adults" value={adults} onChange={setAdults} />
              <PassengerField label="Children" value={children} onChange={setChildren} />
              <PassengerField label="Infants" value={infants} onChange={setInfants} />
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Total passengers:{' '}
              <span className="font-medium text-slate-800">
                {adults + children + infants}
              </span>
            </p>
          </Card>

          {/* Additional charges */}
          <Card icon={DollarSign} title="Additional Charges">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Cargo Weight (kg)">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={cargoKg}
                  onChange={(e) => setCargoKg(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800 tabular-nums"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Billed at {formatCurrency(FEES.cargo_per_kg)} / kg
                </p>
              </Field>

              <Field label="Other Charges (USD)">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={otherCharge}
                  onChange={(e) => setOtherCharge(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800 tabular-nums"
                />
              </Field>

              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={nightParking}
                    onChange={(e) => setNightParking(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-navy-900 focus:ring-navy-800"
                  />
                  Night Parking ({formatCurrency(FEES.night_parking)})
                </label>
              </div>

              <div className="sm:col-span-2">
                <Field label="Notes">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="Optional notes for this transaction"
                    className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-navy-800 resize-none"
                  />
                </Field>
              </div>
            </div>
          </Card>
        </div>

        {/* ============ RIGHT: Live summary ============ */}
        <div className="xl:col-span-1">
          <div className="bg-white border border-slate-200 rounded-lg sticky top-4">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-navy-900" />
              <h3 className="text-sm font-semibold text-slate-800">Charge Summary</h3>
            </div>

            <div className="p-5 space-y-2">
              {!selectedAircraft && (
                <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 mb-3">
                  Select an airline and aircraft to see calculated charges.
                </div>
              )}

              <LineItem label="Landing"         value={calc.landing} />
              <LineItem label="Handling"        value={calc.handling} />
              <LineItem label="Navigation"      value={calc.navigation} />
              <LineItem label="Cargo"           value={calc.cargo} />
              <LineItem label="Night Parking"   value={calc.parking} />
              <LineItem
                label={`Domestic Pax (${flightType === 'DOMESTIC' ? adults : 0} × ${formatCurrency(FEES.domestic_passenger)})`}
                value={calc.domesticFee}
              />
              <LineItem
                label={`International Pax (${flightType === 'INTERNATIONAL' ? adults : 0} × ${formatCurrency(FEES.international_passenger)})`}
                value={calc.internationalFee}
              />
              <LineItem
                label={`CHD/INF (${children + infants} × ${formatCurrency(FEES.chd_inf)})`}
                value={calc.chdInfFee}
              />
              <LineItem label="Other"           value={Number(otherCharge) || 0} />

              <div className="border-t border-slate-200 pt-3 mt-3 space-y-2">
                <LineItem label="Subtotal" value={calc.subtotal} bold />
                <LineItem
                  label={`Tax (${FEES.tax_percent}%)`}
                  value={calc.tax}
                />
                <div className="border-t-2 border-navy-900 pt-3 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-800">TOTAL</span>
                    <span className="text-lg font-bold text-navy-900 tabular-nums">
                      {formatCurrency(calc.total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-md px-3 py-2 text-[11px] text-amber-800 mt-4 flex gap-2">
                <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>
                  The backend re-calculates all values from active fee configs. Client totals are
                  for preview only.
                </span>
              </div>
            </div>

            <div className="border-t border-slate-200 p-4 flex flex-col gap-2">
              <button
                onClick={() => handleSubmit('POSTED')}
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 text-white text-sm font-medium py-2.5 rounded-md disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Posting...' : 'Post Transaction'}
              </button>
              <button
                onClick={() => handleSubmit('DRAFT')}
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium py-2.5 rounded-md disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                Save as Draft
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center pt-6">
        ⚠️ Demo — real fee rates will be fetched from{' '}
        <code className="font-mono">GET /api/fees</code>, and the transaction will submit to{' '}
        <code className="font-mono">POST /api/transactions</code>.
      </p>
    </div>
  )
}

// ============================================================
function Card({ icon: Icon, title, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg">
      <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-2">
        <Icon className="w-4 h-4 text-navy-900" />
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {children}
    </div>
  )
}

function PassengerField({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      <div className="flex items-stretch border border-slate-300 rounded-md overflow-hidden">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="px-3 text-slate-600 hover:bg-slate-50 border-r border-slate-200 font-medium"
        >
          −
        </button>
        <input
          type="number"
          min="0"
          value={value}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
          className="flex-1 min-w-0 text-center text-sm py-2 focus:outline-none tabular-nums"
        />
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="px-3 text-slate-600 hover:bg-slate-50 border-l border-slate-200 font-medium"
        >
          +
        </button>
      </div>
    </div>
  )
}

function LineItem({ label, value, bold = false }) {
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