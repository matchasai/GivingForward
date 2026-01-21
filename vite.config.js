import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE || 'http://localhost:8081',
        changeOrigin: true,
      },
      '/uploads': {
        target: process.env.VITE_API_BASE || 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Skip certain warnings
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return
        }
        warn(warning)
      }
    }
  },
  define: command === 'build' ? {
    // Reduce React DevTools message in production only
    __REACT_DEVTOOLS_GLOBAL_HOOK__: ({ isDisabled: true })
  } : {}
})) 