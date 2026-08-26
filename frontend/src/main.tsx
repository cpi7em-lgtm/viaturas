import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// FIX (William 2026-08-10): sub-path /viaturas/ via proxy reverso
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* FIX (William 2026-08-26): basename dinâmico baseado na URL.
        - Vercel (raiz): basename=''
        - Nginx local /viaturas/: basename='/viaturas' */}
    <BrowserRouter basename={(() => {
      const path = window.location.pathname;
      return path.startsWith('/viaturas/') || path === '/viaturas' ? '/viaturas' : '';
    })()}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
