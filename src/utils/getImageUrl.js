export function getImageUrl(url) {
  if (!url) return url
  try {
    // If already absolute, return as-is
    if (/^https?:\/\//i.test(url)) return url

    // Prefer explicit API base URL from environment (Vite)
    // Vite projects sometimes set VITE_API_BASE or VITE_API_BASE_URL depending on config/build.
    const env = (import.meta && import.meta.env) || {}
    const envBase = env.VITE_API_BASE_URL || env.VITE_API_BASE || ''
    const trimmedBase = envBase.replace(/\/$/, '')
    if (!trimmedBase) {
      // No explicit backend base — return relative URL (works when frontend and backend share origin)
      // In dev the Vite server proxies `/uploads` to the backend (see vite.config.js). Return relative URL so proxy can apply.
      return url
    }

    // Ensure url starts with '/'
    const path = url.startsWith('/') ? url : '/' + url
    return trimmedBase + path
  } catch (e) {
    return url
  }
}
