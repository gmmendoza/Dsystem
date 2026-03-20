import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard'
import MiAula from './pages/MiAula'
import Agenda from './pages/Agenda'
import Planificador from './pages/Planificador'

function ProtectedRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="mi-aula" element={<MiAula />} />
        <Route path="agenda" element={<Agenda />} />
        <Route path="planificador" element={<Planificador />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
