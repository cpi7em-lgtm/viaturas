import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config - Sistema de Viaturas CPI-7
// Build output vai pro /opt/convex-viaturas/dist/

export default defineConfig({
  // FIX (William 2026-08-26): base relativo ('') pra funcionar tanto em
  // https://app.vercel.app/ (raiz) quanto em https://x.com/viaturas/ (subpath do nginx local)
  // Browser resolve os assets relativamente ao URL atual
  base: '',
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:8002',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
