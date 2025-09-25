// Simple INR currency formatter for UI
export const formatINR = (value) => {
  const n = Number(value)
  if (!Number.isFinite(n)) return '₹0'
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n)
  } catch {
    // Fallback if Intl not available
    return `₹${n.toFixed(2)}`
  }
}
