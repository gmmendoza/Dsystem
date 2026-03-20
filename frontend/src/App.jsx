import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard'
import MiAula from './pages/MiAula'
import Agenda from './pages/Agenda'
import Planificador from './pages/Planificador'
import AulaWorkspace from './pages/AulaWorkspace'
import Historial from './pages/Historial'

function ProtectedRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Navigate to="/" replace />} />

      {/* Rutas Privadas (Sin prefijo /app para mayor simplicidad) */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mi-aula" element={<MiAula />} />
        <Route path="/aula/:id" element={<AulaWorkspace />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/planificador" element={<Planificador />} />
        <Route path="/historial" element={<Historial />} />
      </Route>

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
