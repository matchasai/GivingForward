import axios from 'axios';

// Prefer explicit API base URL from environment (Vite)
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

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axios(originalRequest);
        }).catch(err => Promise.reject(err));
      }
      isRefreshing = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw error;
        const res = await axios.post('/api/auth/refresh', { refreshToken });
        const newToken = res.data.token;
        const newRefreshToken = res.data.refreshToken;
        if (newToken) localStorage.setItem('token', newToken);
        if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
        processQueue(null, newToken);
        originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
        return axios(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    // Broadcast non-401 errors
    try {
      const msg = error.response?.data?.message || error.message || 'Request failed';
      window.dispatchEvent(new CustomEvent('app:error', { detail: { message: msg } }))
    } catch (_) {}
    return Promise.reject(error);
  }
);


