export function getImageUrl(url) {
  if (!url) return ''
  try {
    // Normalize windows-style slashes and trim whitespace to avoid broken paths
    const normalized = String(url).trim().replace(/\\/g, '/')
    if (!normalized) return ''

    // If already absolute, return as-is
    if (/^https?:\/\//i.test(normalized)) return normalized

    // Prefer explicit API base URL from environment (Vite)
    // Vite projects sometimes set VITE_API_BASE or VITE_API_BASE_URL depending on config/build.
    const env = (import.meta && import.meta.env) || {}
    const envBase = env.VITE_API_BASE_URL || env.VITE_API_BASE || ''
    const trimmedBase = envBase.replace(/\/$/, '')

    // Heuristic: if only a filename (no slash), assume it lives under /uploads
    const looksLikeFile = !normalized.includes('/') || /^uploads\//i.test(normalized)
    let path = normalized
    if (normalized.startsWith('/uploads/')) {
      path = normalized
    } else if (/^uploads\//i.test(normalized)) {
      path = '/' + normalized.replace(/^uploads\//i, 'uploads/')
    } else if (looksLikeFile) {
      path = '/uploads/' + normalized.replace(/^\//, '')
    } else if (!normalized.startsWith('/')) {
      path = '/' + normalized
    }

    if (!trimmedBase) {
      // No explicit backend base — return relative URL (works when frontend and backend share origin)
      // In dev the Vite server proxies `/uploads` to the backend (see vite.config.js). Return relative URL so proxy can apply.
      return path
    }

    return trimmedBase + path
  } catch (e) {
    return ''
  }
}
