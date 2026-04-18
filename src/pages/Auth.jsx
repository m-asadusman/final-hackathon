import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Auth() {
  const { signup, login } = useApp()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    setError('')
    if (!form.email || !form.password) return setError('Email and password are required.')
    if (mode === 'signup' && !form.name) return setError('Display name is required.')
    setLoading(true)
    try {
      if (mode === 'signup') {
        await signup(form.email, form.password, form.name)
        navigate('/onboarding')
      } else {
        await login(form.email, form.password)
        navigate('/dashboard')
      }
    } catch (e) {
      setError(e.message.replace('Firebase: ', '').replace(/\(auth.*\)/, '').trim())
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="grid grid-cols-2 gap-6 max-w-4xl w-full">
        <div className="card-dark p-10">
          <div className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">COMMUNITY ACCESS</div>
          <h1 className="font-syne text-4xl font-black leading-tight mb-4">Enter the support network.</h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Create an account or sign in to start asking for help, offering support, and tracking your community impact.
          </p>
          {[
            'Role-based entry for Need Help, Can Help, or Both',
            'Direct path into dashboard, requests, AI Center, and community feed',
            'Real-time messaging and notifications',
          ].map(b => (
            <div key={b} className="flex gap-2 mb-2 text-gray-300 text-sm">
              <span>•</span><span>{b}</span>
            </div>
          ))}
        </div>

        <div className="card p-10">
          <div className="flex gap-2 mb-6">
            {['login', 'signup'].map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${mode === m ? 'bg-dark text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                style={mode === m ? { background: '#1c2b2a' } : {}}>
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <h2 className="font-syne text-2xl font-black mb-6">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>

          {mode === 'signup' && (
            <div className="mb-4">
              <label className="text-sm font-medium block mb-1.5">Full name</label>
              <input className="input-field" placeholder="Ayesha Khan" value={form.name}
                onChange={e => set('name', e.target.value)} />
            </div>
          )}

          <div className="mb-4">
            <label className="text-sm font-medium block mb-1.5">Email</label>
            <input className="input-field" type="email" placeholder="you@example.com" value={form.email}
              onChange={e => set('email', e.target.value)} />
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium block mb-1.5">Password</label>
            <input className="input-field" type="password" placeholder="Min. 6 characters" value={form.password}
              onChange={e => set('password', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
          )}

          <button className="btn-primary w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </div>
      </div>
    </div>
  )
}
