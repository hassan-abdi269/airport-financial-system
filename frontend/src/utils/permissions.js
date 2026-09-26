export const ROLES = {
  ADMIN: 'ADMIN',
  FINANCE_OFFICER: 'FINANCE_OFFICER',
  FINANCE_ASSISTANT: 'FINANCE_ASSISTANT',
  MANAGEMENT: 'MANAGEMENT',
}

// Central permissions map — one place to control what each role sees.
export const PERMISSIONS = {
  viewDashboard:     [ROLES.ADMIN, ROLES.FINANCE_OFFICER, ROLES.FINANCE_ASSISTANT, ROLES.MANAGEMENT],
  manageUsers:       [ROLES.ADMIN],
  manageFees:        [ROLES.ADMIN],
  manageSettings:    [ROLES.ADMIN],
  viewAuditLogs:     [ROLES.ADMIN],
  manageAirlines:    [ROLES.ADMIN, ROLES.FINANCE_OFFICER],
  manageAircraft:    [ROLES.ADMIN, ROLES.FINANCE_OFFICER],
  createFlight:      [ROLES.ADMIN, ROLES.FINANCE_OFFICER, ROLES.FINANCE_ASSISTANT],
  createTransaction: [ROLES.ADMIN, ROLES.FINANCE_OFFICER, ROLES.FINANCE_ASSISTANT],
  voidTransaction:   [ROLES.ADMIN],
  recordPayment:     [ROLES.ADMIN, ROLES.FINANCE_OFFICER],
  viewReports:       [ROLES.ADMIN, ROLES.FINANCE_OFFICER, ROLES.FINANCE_ASSISTANT, ROLES.MANAGEMENT],
  approveReports:    [ROLES.ADMIN, ROLES.MANAGEMENT],
  exportReports:     [ROLES.ADMIN, ROLES.FINANCE_OFFICER, ROLES.MANAGEMENT],
}

export function hasPermission(role, action) {
  if (!role) return false
  const allowed = PERMISSIONS[action]
  return Array.isArray(allowed) && allowed.includes(role)
}