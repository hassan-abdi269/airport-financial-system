import { useAuth } from './useAuth'
import { hasPermission } from '../utils/permissions'

export function usePermissions() {
  const { user } = useAuth()
  const role = user?.role

  return {
    role,
    can: (action) => hasPermission(role, action),
    isAdmin: role === 'ADMIN',
    isManagement: role === 'MANAGEMENT',
    isFinanceOfficer: role === 'FINANCE_OFFICER',
    isFinanceAssistant: role === 'FINANCE_ASSISTANT',
  }
}