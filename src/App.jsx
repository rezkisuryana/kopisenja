import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage    from './pages/HomePage.jsx'
import AdminPage   from './pages/AdminPage.jsx'
import LoginPage   from './pages/LoginPage.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/admin/ProtectedRoute.jsx'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/"       element={<HomePage />} />
        <Route path="/login"  element={<LoginPage />} />
        <Route path="/admin"  element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
