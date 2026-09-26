import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  Plane,
  Users,
  MapPin,
  Calendar,
  AlertCircle,
  Info,
} from 'lucide-react'
import PageHeader from '../components/common/PageHeader'

// ============================================================
// MOCK MASTER DATA
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
export default function FlightForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

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

  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const airlineAircraft = useMemo(
    () => (airlineId ? AIRCRAFT.filter((a) => a.airline_id === Number(airlineId)) : []),
    [airlineId]
  )

  const selectedAirline = useMemo(
    () => AIRLINES.find((a) => a.id === Number(airlineId)),
    [airlineId]
  )
  const selectedAircraft = useMemo(
    () => AIRCRAFT.find((a) => a.id === Number(aircraftId)),
    [aircraftId]
  )

  const totalPax = adults + children + infants

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!airlineId) return setError('Airline is required.')
    if (!aircraftId) return setError('Aircraft is required.')
    if (!flightNumber.trim()) return setError('Flight number is required.')
    if (!flightDate) return setError('Flight date is required.')
    if (adults < 0 || children < 0 || infants < 0) return setError('Passenger counts cannot be negative.')
    if (totalPax === 0) return setError('At least one passenger is required.')

    setSubmitting(true)
    setTimeout(() => {
      alert(
        `Would ${isEdit ? 'update' : 'create'} flight:\n` +
        `${flightNumber} · ${selectedAirline?.name} · ${selectedAircraft?.registration_number}\n` +
        `${flightDate} · ${flightType} · ${direction}\n` +
        `Passengers: ${adults}A / ${children}C / ${infants}I\n\n` +
        `After saving, you would create a transaction for this flight to record charges.`
      )
      setSubmitting(false)
      navigate('/flights')
    }, 400)
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="mb-4">
        <button
          onClick={() => navigate('/flights')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Flights
        </button>
      </div>

      <PageHeader
        title={isEdit ? `Edit Flight #${id}` : 'New Flight'}
        subtitle="Record a flight and its passenger counts"
      />

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-3 mb-4">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* ============ Left: Form ============ */}
        <div className="xl:col-span-2 space-y-4">
          {/* Flight identity */}
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
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.code})
                    </option>
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
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    value={flightDate}
                    onChange={(e) => setFlightDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-800"
                  />
                </div>
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
            </div>
          </Card>

          {/* Route */}
          <Card icon={MapPin} title="Route">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </Card>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate('/flights')}
              className="text-sm font-medium text-slate-600 hover:text-slate-800 px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 bg-navy-900 hover:bg-navy-800 text-white text-sm font-medium px-4 py-2 rounded-md disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {submitting ? 'Saving...' : isEdit ? 'Update Flight' : 'Create Flight'}
            </button>
          </div>
        </div>

        {/* ============ Right: Summary ============ */}
        <div className="xl:col-span-1">
          <div className="bg-white border border-slate-200 rounded-lg sticky top-4">
            <div className="px-5 py-4 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-800">Flight Summary</h3>
            </div>

            <div className="p-5 space-y-4">
              {/* Airline */}
              <SummaryBlock label="Airline">
                {selectedAirline ? (
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {selectedAirline.name}
                    </p>
                    <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                      {selectedAirline.code}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">Not selected</p>
                )}
              </SummaryBlock>

              {/* Aircraft */}
              <SummaryBlock label="Aircraft">
                {selectedAircraft ? (
                  <div>
                    <p className="text-sm font-mono font-semibold text-navy-900">
                      {selectedAircraft.registration_number}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {selectedAircraft.aircraft_type}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">Not selected</p>
                )}
              </SummaryBlock>

              {/* Flight */}
              <SummaryBlock label="Flight">
                <p className="text-sm font-medium text-slate-800">
                  {flightNumber || '—'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {flightDate} · {flightType} · {direction}
                </p>
              </SummaryBlock>

              {/* Route */}
              {(origin || destination) && (
                <SummaryBlock label="Route">
                  <p className="text-sm text-slate-800">
                    {origin || '—'} → {destination || '—'}
                  </p>
                </SummaryBlock>
              )}

              {/* Passengers */}
              <SummaryBlock label="Passengers">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <PaxBox label="Adults" value={adults} />
                  <PaxBox label="Child" value={children} />
                  <PaxBox label="Infant" value={infants} />
                </div>
                <div className="mt-2 text-center">
                  <p className="text-[10px] uppercase tracking-wide text-slate-500 font-medium">
                    Total
                  </p>
                  <p className="text-xl font-bold text-navy-900 tabular-nums">
                    {totalPax}
                  </p>
                </div>
              </SummaryBlock>

              <div className="bg-blue-50 border border-blue-200 rounded-md px-3 py-2 text-[11px] text-blue-800 flex gap-2">
                <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>
                  Saving this flight only creates the flight record. Charges are recorded
                  separately by creating a transaction for this flight.
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>

      <p className="text-xs text-slate-400 text-center pt-6">
        ⚠️ Demo — real data will load from <code className="font-mono">GET /api/airlines</code> and{' '}
        <code className="font-mono">GET /api/aircraft</code>, and this form will submit to{' '}
        <code className="font-mono">POST /api/flights</code>.
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

function SummaryBlock({ label, children }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium mb-1.5">
        {label}
      </p>
      {children}
    </div>
  )
}

function PaxBox({ label, value }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded px-2 py-1.5">
      <p className="text-[10px] uppercase tracking-wide text-slate-500 font-medium">
        {label}
      </p>
      <p className="text-sm font-semibold text-slate-800 tabular-nums">{value}</p>
    </div>
  )
}