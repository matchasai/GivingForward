import axios from 'axios';
import { isJwtExpired } from './utils/jwt';

// Prefer explicit API base URL from environment (Vite uses import.meta.env)
const envBase = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL) || '/';

// Normalize to ensure a single trailing slash behavior
let normalizedBase = (() => {
  try {
    // Leave absolute URLs untouched; ensure trailing slash
    if (envBase.startsWith('http')) return envBase.endsWith('/') ? envBase : envBase + '/';
    // Relative: ensure it ends with '/'
    return envBase.endsWith('/') ? envBase : envBase + '/';
  } catch {
    return '/';
  }
})();

// If base contains '/api' suffix and our code uses '/api/...' paths, strip trailing '/api' to avoid double '/api'
if (normalizedBase.startsWith('http')) {
  normalizedBase = normalizedBase.replace(/\/?api\/?$/i, '');
}

axios.defaults.baseURL = normalizedBase;

// If a token is already stored (e.g., after refresh or reload), attach it
// immediately so early API calls don't race React effects/interceptors.
try {
  const bootToken = localStorage.getItem('token');
  if (bootToken && !isJwtExpired(bootToken)) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + bootToken;
  }
} catch {
  // ignore localStorage access issues
}

// Request interceptor is handled by AuthContext - do NOT add Authorization here
// to avoid duplicate/conflicting headers and to ensure proper token validation

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401, try to refresh token only if we had a valid, non-expired token to begin with
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      const token = localStorage.getItem('token');
      
      // If no token stored, this is a genuinely unauthenticated request - fail normally
      if (!token) {
        return Promise.reject(error);
      }

      // If token is already expired/invalid, clear and fail without spamming /refresh
      if (isJwtExpired(token)) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
        try {
          window.dispatchEvent(new CustomEvent('app:logout'));
        } catch (eventErr) {
          // ignore
        }
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      
      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject })
        }).then((newToken) => {
          if (newToken) {
            originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
          }
          return axios(originalRequest);
        }).catch(err => Promise.reject(err));
      }
      
      isRefreshing = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // No refresh token - clear auth and fail
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('refreshToken');
          processQueue(error, null);
          isRefreshing = false;
          return Promise.reject(error);
        }
        
        const res = await axios.post('/api/auth/refresh', { refreshToken });
        const newToken = res.data.token;
        const newRefreshToken = res.data.refreshToken;
        if (newToken) localStorage.setItem('token', newToken);
        if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
        if (newToken) {
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
        }
        processQueue(null, newToken);
        originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
        isRefreshing = false;
        return axios(originalRequest);
      } catch (err) {
        // Refresh failed - clear auth and fail
        processQueue(err, null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
        try {
          window.dispatchEvent(new CustomEvent('app:logout'));
        } catch (eventErr) {
          // ignore dispatch errors
        }
        isRefreshing = false;
        return Promise.reject(error);
      }
    }
    
    // Broadcast non-401 errors for user notification
    try {
      const msg = error.response?.data?.message || error.message || 'Request failed';
      window.dispatchEvent(new CustomEvent('app:error', { detail: { message: msg } }))
    } catch (eventErr) {
      // Swallow dispatch failures silently
    }
    return Promise.reject(error);
  }
);


