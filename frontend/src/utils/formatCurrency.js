export function formatCurrency(amount, currency = 'USD') {
  const num = Number(amount ?? 0)
  if (Number.isNaN(num)) return `${currency} 0.00`
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

export function formatNumber(n) {
  return new Intl.NumberFormat('en-US').format(Number(n ?? 0))
}