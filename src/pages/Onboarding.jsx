import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { updateUserProfile } from '../firebase/firestore'

const STEPS = ['Welcome', 'Skills', 'Interests', 'Role']

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
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-md">
        <div className="card-dark p-6 sm:p-8 mb-4 rounded-2xl">
          <p className="text-[10px] font-bold tracking-[0.18em] text-teal/60 uppercase mb-2"
            style={{ fontFamily: "'Instrument Sans', sans-serif" }}>ONBOARDING</p>
          <h1 className="h2 text-white">Set up your community identity.</h1>
        </div>

        <div className="card p-6 sm:p-8">
          
          <div className="flex gap-1.5 mb-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex-1 h-1 rounded-full transition-all duration-300"
                style={{ background: i <= step ? '#0d9488' : '#e5e7eb' }} />
            ))}
          </div>
          <p className="text-xs text-gray-400 font-medium mb-5">
            {STEPS[step]} — Step {step + 1} of {STEPS.length}
          </p>

          {step === 0 && (
            <div>
              <h2 className="h3 text-gray-900 mb-2">Welcome to Helplytics</h2>
              <p className="text-gray-500 text-sm mb-5">A few quick questions to personalize your experience.</p>
              <label className="text-sm font-medium block mb-1.5">Your location</label>
              <input className="input-field" placeholder="Karachi, Pakistan" value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })} />
            </div>
          )}
          {step === 1 && (
            <div>
              <h2 className="h3 text-gray-900 mb-2">What are your skills?</h2>
              <p className="text-gray-500 text-sm mb-5">Comma-separated — helps surface relevant requests.</p>
              <input className="input-field" placeholder="React, Figma, Python" value={form.skills}
                onChange={e => setForm({ ...form, skills: e.target.value })} />
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 className="h3 text-gray-900 mb-2">What are your interests?</h2>
              <p className="text-gray-500 text-sm mb-5">Helps match you with like-minded members.</p>
              <input className="input-field" placeholder="Hackathons, UI/UX, Community" value={form.interests}
                onChange={e => setForm({ ...form, interests: e.target.value })} />
            </div>
          )}
          {step === 3 && (
            <div>
              <h2 className="h3 text-gray-900 mb-2">How do you want to participate?</h2>
              <p className="text-gray-500 text-sm mb-4">You can change this anytime in your profile.</p>
              {[
                { r: 'Need Help', d: 'Post requests and get matched with helpers' },
                { r: 'Can Help',  d: 'Browse requests and offer your expertise' },
                { r: 'Both',      d: 'Ask and offer depending on the topic' },
              ].map(({ r, d }) => (
                <div key={r} onClick={() => setForm({ ...form, role: r })}
                  className="p-4 border-2 rounded-xl mb-3 cursor-pointer transition-all"
                  style={{ borderColor: form.role === r ? '#0d9488' : '#e5e7eb', background: form.role === r ? '#ccfbf1' : '#fff' }}>
                  <p className="font-semibold text-sm">{r}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{d}</p>
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
