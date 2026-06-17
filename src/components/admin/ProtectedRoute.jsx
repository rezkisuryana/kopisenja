import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-caramel-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-espresso-400">Memuat...</p>
      </div>
    </div>
  )

  if (!user) return <Navigate to="/login" replace />
  return children
}
