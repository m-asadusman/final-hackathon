import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Auth() {
  const { signup, login } = useApp()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
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
      if (mode === 'signup') { await signup(form.email, form.password, form.name); navigate('/onboarding') }
      else { await login(form.email, form.password); navigate('/dashboard') }
    } catch (e) {
      setError(e.message.replace('Firebase: ', '').replace(/\(auth.*\)/, '').trim())
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="card-dark p-7 sm:p-10 order-2 md:order-1">
          <p className="text-[10px] font-bold tracking-[0.18em] text-teal/60 uppercase mb-4"
            style={{ fontFamily: "'Instrument Sans', sans-serif" }}>COMMUNITY ACCESS</p>
          <h1 className="h2 text-white mb-4">Enter the support network.</h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Create an account or sign in to ask for help, support others, and track your impact in the community.
          </p>
          {[
            'Choose your role: Need help, can help, or both',
            'Access your dashboard, requests, and community feed',
            'Chat and get updates in real time',
          ].map(b => (
            <div key={b} className="flex gap-2.5 mb-2.5 text-gray-300 text-sm">
              <span className="text-teal mt-0.5 flex-shrink-0">✓</span><span>{b}</span>
            </div>
          ))}
        </div>

        
        <div className="card p-7 sm:p-10 order-1 md:order-2">
          <div className="flex gap-1.5 mb-6 p-1 bg-gray-100 rounded-xl">
            {['login', 'signup'].map(m => (
              <button key={m} onClick={() => setMode(m)}
                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                style={mode === m
                  ? { background: '#1c2b2a', color: '#fff', fontFamily: "'Instrument Sans', sans-serif" }
                  : { color: '#6b7280', fontFamily: "'Instrument Sans', sans-serif" }}>
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <h2 className="h3 text-gray-900 mb-5">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>

          {mode === 'signup' && (
            <div className="mb-4">
              <label className="text-sm font-medium block mb-1.5">Full name</label>
              <input className="input-field" placeholder="John Doe" value={form.name}
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

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}
          <button className="btn-primary w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </div>
      </div>
    </div>
  )
}
