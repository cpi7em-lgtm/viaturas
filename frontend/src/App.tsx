import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import AgendarPage from './pages/AgendarPage'
import AgendamentosPage from './pages/AgendamentosPage'
import CalendarioPage from './pages/CalendarioPage'
import ViaturasPage from './pages/ViaturasPage'
import DashboardPage from './pages/DashboardPage'
import GestaoUsuariosPage from './pages/GestaoUsuariosPage'
import ProcessoDescargaPage from './pages/ProcessoDescargaPage'
import DesempenhoPage from './pages/DesempenhoPage'
import Sidebar from './components/Sidebar'
import { isLoggedIn, getUser, refreshUserFromServer } from './lib/auth'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

// FIX (William 2026-08-24): Sidebar reativo com refresh automatico do user.
// A cada mudança de rota, busca o user atualizado do Convex pra que:
// - Promoção nova (gestor) apareça sem precisar logout/login
// - Mudança de escopo/unidades propague imediatamente
// - isMaster novo seja reconhecido na hora
function SidebarRefresher() {
  const location = useLocation()
  useEffect(() => {
    if (!getUser()) return
    refreshUserFromServer().catch(() => {})
  }, [location.pathname])
  return null
}

function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-container">
      <SidebarRefresher />
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <PrivateLayout><HomePage /></PrivateLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/agendar"
        element={
          <PrivateRoute>
            <PrivateLayout><AgendarPage /></PrivateLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/agendamentos"
        element={
          <PrivateRoute>
            <PrivateLayout><AgendamentosPage /></PrivateLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/calendario"
        element={
          <PrivateRoute>
            <PrivateLayout><CalendarioPage /></PrivateLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/viaturas"
        element={
          <PrivateRoute>
            <PrivateLayout><ViaturasPage /></PrivateLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <PrivateLayout><DashboardPage /></PrivateLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/desempenho"
        element={
          <PrivateRoute>
            <PrivateLayout><DesempenhoPage /></PrivateLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/descarga"
        element={
          <PrivateRoute>
            <PrivateLayout><ProcessoDescargaPage /></PrivateLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/gestão"
        element={
          <PrivateRoute>
            <PrivateLayout><GestaoUsuariosPage /></PrivateLayout>
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
