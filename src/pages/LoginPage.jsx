import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const { signIn }  = useAuth()
  const navigate    = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    const err = await signIn(email, password)
    setLoading(false)
    if (err) setError(err.message || 'Email atau password salah.')
    else navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-espresso-800 flex items-center justify-center px-4"
      style={{ backgroundImage: "radial-gradient(ellipse at 70% 30%, rgba(232,144,42,.15) 0%, transparent 60%)" }}>

      {/* Decorative blur circles */}
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-caramel-400/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-espresso-600/20 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-3xl font-bold text-cream-50 inline-flex items-center gap-2">
            <span className="text-caramel-400">☕</span> Kopi <span className="text-caramel-400">Senja</span>
          </Link>
          <p className="text-cream-400 text-sm mt-2">Masuk ke Dashboard Admin</p>
        </div>

        {/* Card */}
        <div className="bg-espresso-700/60 backdrop-blur-sm rounded-3xl border border-white/10 p-8 shadow-2xl">
          <h1 className="font-display text-xl font-bold text-cream-50 mb-6">Selamat Datang</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-cream-300 mb-1.5">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@kopisenja.id"
                className="w-full bg-espresso-800/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm
                           outline-none focus:border-caramel-400 transition-colors text-cream-100 placeholder-cream-600" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-cream-300 mb-1.5">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-espresso-800/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm
                           outline-none focus:border-caramel-400 transition-colors text-cream-100 placeholder-cream-600" />
            </div>

            {error && (
              <div className="bg-red-500/15 border border-red-400/30 text-red-300 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-caramel-400 hover:bg-caramel-300 disabled:opacity-60
                         text-espresso-900 font-semibold py-3 rounded-xl transition-colors text-sm mt-2 shadow-lg">
              {loading ? 'Memproses...' : 'Masuk ke Dashboard ☕'}
            </button>
          </form>

          <p className="text-xs text-cream-500 text-center mt-5">
            User dibuat melalui Supabase Authentication Dashboard.
          </p>
        </div>

        <p className="text-center mt-5">
          <Link to="/" className="text-sm text-cream-500 hover:text-caramel-400 transition-colors">
            ← Kembali ke Website
          </Link>
        </p>
      </div>
    </div>
  )
}
