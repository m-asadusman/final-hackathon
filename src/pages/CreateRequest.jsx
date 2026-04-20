import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import HeroBanner from '../components/HeroBanner'
import { detectCategory, suggestTags, detectUrgency } from '../utils/aiHelpers'
import { createPost, createNotification } from '../firebase/firestore'

const CATS = ['Web Development','Design','Data Science','Career','Community']

export default function CreateRequest() {
  const { user, profile } = useApp()
  const navigate = useNavigate()
  const [form, setForm]   = useState({ title:'', desc:'', tags:'', category:'Web Development', urgency:'High' })
  const [ai, setAi]       = useState({ cat:'Community', urg:'Low', tags:'Add more detail for smarter tags', rewrite:'Start describing your challenge.' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const update = (key, val) => {
    const nf = { ...form, [key]: val }
    setForm(nf)
    const combined = `${nf.title} ${nf.desc}`
    if (combined.trim().length > 3) {
      const suggested = suggestTags(combined)
      setAi({
        cat: detectCategory(combined), urg: detectUrgency(combined),
        tags: suggested || 'Add more detail for smarter tags',
        rewrite: nf.desc.length > 15
          ? `"${nf.desc.trim()} — Looking for hands-on support from someone with direct experience."`
          : 'Start describing your challenge.',
      })
    }
  }

  const applyAI = () => setForm(f => ({
    ...f, category: ai.cat, urgency: ai.urg,
    tags: ai.tags !== 'Add more detail for smarter tags' ? ai.tags : f.tags,
  }))

  const publish = async () => {
    if (!form.title.trim()) return setError('Title is required.')
    if (!user) return setError('You must be logged in to post.')
    setLoading(true); setError('')
    try {
      const ref = await createPost({
        title: form.title.trim(), desc: form.desc.trim(),
        category: form.category, urgency: form.urgency,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        userId: user.uid, userName: profile?.name || user.email,
        location: profile?.location || 'Remote',
      })
      await createNotification(user.uid, { text: `Your request "${form.title.trim()}" is now live`, type:'Request', time:'Just now' })
      navigate(`/request/${ref.id}`)
    } catch (e) { setError('Failed to publish. Please try again.'); console.error(e) }
    finally { setLoading(false) }
  }

  return (
    <div className="page">
      <HeroBanner
        label="CREATE REQUEST"
        title="Turn a rough problem into a clear help request."
        subtitle="Use built-in AI suggestions for category, urgency, tags, and a stronger description rewrite."
      />

      <div className="cols-2">
        <div className="card p-5 sm:p-7">
          <div className="mb-4">
            <label className="text-sm font-medium block mb-1.5">Title *</label>
            <input className="input-field" placeholder="Need review on my JavaScript quiz app before submission"
              value={form.title} onChange={e => update('title', e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium block mb-1.5">Description</label>
            <textarea className="input-field resize-none" rows={4}
              placeholder="Explain the challenge, current progress, deadline, and what kind of help would be useful."
              value={form.desc} onChange={e => update('desc', e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">Tags</label>
              <input className="input-field" placeholder="JavaScript, Debugging"
                value={form.tags} onChange={e => update('tags', e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Category</label>
              <select className="select-field" value={form.category} onChange={e => update('category', e.target.value)}>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-5">
            <label className="text-sm font-medium block mb-1.5">Urgency</label>
            <select className="select-field" value={form.urgency} onChange={e => update('urgency', e.target.value)}>
              {['High','Medium','Low'].map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}
          <div className="flex gap-3 flex-wrap">
            <button className="btn-ghost" onClick={applyAI}>Apply AI suggestions</button>
            <button className="btn-primary" onClick={publish} disabled={loading}>
              {loading ? 'Publishing...' : 'Publish request'}
            </button>
          </div>
        </div>

        <div className="card p-5 sm:p-7">
          <div className="section-label">AI ASSISTANT</div>
          <h2 className="h3 text-gray-900 mb-5">Smart request guidance</h2>
          {[{ label:'Suggested category', val:ai.cat }, { label:'Detected urgency', val:ai.urg }].map(r => (
            <div key={r.label} className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-500 text-sm">{r.label}</span>
              <span className="font-bold text-sm">{r.val}</span>
            </div>
          ))}
          <div className="py-3 border-b border-gray-100">
            <p className="text-gray-500 text-sm mb-1">Suggested tags</p>
            <p className="font-semibold text-sm">{ai.tags}</p>
          </div>
          <div className="py-3">
            <p className="text-gray-500 text-sm mb-1">Rewrite suggestion</p>
            <p className="font-semibold text-sm leading-relaxed text-gray-700">{ai.rewrite}</p>
          </div>
          <div className="mt-5 p-3.5 bg-teal-light rounded-xl">
            <p className="text-teal-dark text-xs font-semibold leading-relaxed">
              💡 Click "Apply AI suggestions" to auto-fill category, urgency, and tags based on your text.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
