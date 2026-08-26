import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config - Sistema de Viaturas CPI-7
// Build output vai pro /opt/convex-viaturas/dist/

export default defineConfig({
  base: '/viaturas/',  // FIX (William 2026-08-10): sub-path via proxy reverso no nginx do Materiais (8080)
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
