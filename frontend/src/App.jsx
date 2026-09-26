import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import DashboardLayout from './layouts/DashboardLayout'

// Lazy-friendly direct imports for the demo
import Flights from './pages/Flights'
import FlightForm from './pages/FlightForm'
import Transactions from './pages/Transactions'
import TransactionForm from './pages/TransactionForm'
import TransactionDetails from './pages/TransactionDetails'
import Airlines from './pages/Airlines'
import Aircraft from './pages/Aircraft'
import Payments from './pages/Payments'
import DailyReport from './pages/DailyReport'
import MonthlyReport from './pages/MonthlyReport'
import AirlineReport from './pages/AirlineReport'
import RevenueReport from './pages/RevenueReport'
import Users from './pages/Users'
import FeeConfiguration from './pages/FeeConfiguration'
import AuditLogs from './pages/AuditLogs'
import Settings from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Operations */}
            <Route path="/flights" element={<Flights />} />
            <Route path="/flights/new" element={<FlightForm />} />
            <Route path="/flights/:id" element={<FlightForm />} />

            <Route path="/transactions" element={<Transactions />} />
            <Route path="/transactions/new" element={<TransactionForm />} />
            <Route path="/transactions/:id" element={<TransactionDetails />} />

            {/* Financial */}
            <Route path="/payments" element={<Payments />} />
            <Route path="/reports/daily" element={<DailyReport />} />
            <Route path="/reports/monthly" element={<MonthlyReport />} />
            <Route path="/reports/airlines" element={<AirlineReport />} />
            <Route path="/reports/revenue" element={<RevenueReport />} />

            {/* Master Data */}
            <Route path="/airlines" element={<Airlines />} />
            <Route path="/aircraft" element={<Aircraft />} />
            <Route path="/fees" element={<FeeConfiguration />} />

            {/* Administration */}
            <Route path="/users" element={<Users />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}