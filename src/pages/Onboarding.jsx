import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { updateUserProfile } from '../firebase/firestore'

const STEPS = ['Welcome', 'Your Skills', 'Your Interests', 'Your Role']

export default function Onboarding() {
  const { user, refreshProfile } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ location: '', skills: '', interests: '', role: 'Both' })
  const [saving, setSaving] = useState(false)

  const next = async () => {
    if (step < 3) return setStep(s => s + 1)
    if (!user) return navigate('/dashboard')
    setSaving(true)
    try {
      await updateUserProfile(user.uid, {
        location: form.location,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        interests: form.interests,
        role: form.role,
      })
      await refreshProfile()
      navigate('/dashboard')
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-lg w-full">
        <div className="card-dark p-8 mb-4">
          <div className="section-label" style={{ color: '#9ca3af' }}>ONBOARDING</div>
          <h1 className="font-syne text-3xl font-black">Set up your community identity.</h1>
        </div>

        <div className="card p-8">
          <div className="flex gap-2 mb-6">
            {STEPS.map((s, i) => (
              <div key={s} className="flex-1 h-1 rounded-full transition-all duration-300"
                style={{ background: i <= step ? '#0d9488' : '#e5e7eb' }} />
            ))}
          </div>

          {step === 0 && (
            <div>
              <h2 className="font-syne text-xl font-bold mb-2">Welcome to HelpHub AI</h2>
              <p className="text-gray-500 text-sm mb-6">We'll ask a few quick questions to personalize your experience.</p>
              <label className="text-sm font-medium block mb-1.5">Your location</label>
              <input className="input-field" placeholder="Karachi, Pakistan" value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })} />
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="font-syne text-xl font-bold mb-2">What are your skills?</h2>
              <p className="text-gray-500 text-sm mb-4">Comma-separated. Helps surface relevant requests.</p>
              <input className="input-field" placeholder="React, Figma, Python" value={form.skills}
                onChange={e => setForm({ ...form, skills: e.target.value })} />
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-syne text-xl font-bold mb-2">What are your interests?</h2>
              <p className="text-gray-500 text-sm mb-4">Helps match you with like-minded members.</p>
              <input className="input-field" placeholder="Hackathons, UI/UX, Community" value={form.interests}
                onChange={e => setForm({ ...form, interests: e.target.value })} />
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-syne text-xl font-bold mb-2">How do you want to participate?</h2>
              <p className="text-gray-500 text-sm mb-4">You can change this in your profile anytime.</p>
              {['Need Help', 'Can Help', 'Both'].map(r => (
                <div key={r} onClick={() => setForm({ ...form, role: r })}
                  className="p-4 border-2 rounded-xl mb-3 cursor-pointer transition-all"
                  style={{ borderColor: form.role === r ? '#0d9488' : '#e5e7eb', background: form.role === r ? '#ccfbf1' : '#fff' }}>
                  <div className="font-semibold">{r}</div>
                  <div className="text-gray-400 text-xs mt-0.5">
                    {r === 'Need Help' ? 'Post requests and get matched with helpers'
                      : r === 'Can Help' ? 'Browse requests and offer your expertise'
                      : 'Do both — ask and offer depending on the topic'}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between mt-6">
            {step > 0 ? <button className="btn-ghost" onClick={() => setStep(s => s - 1)}>Back</button> : <div />}
            <button className="btn-primary" onClick={next} disabled={saving}>
              {saving ? 'Saving...' : step === 3 ? 'Go to Dashboard' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
