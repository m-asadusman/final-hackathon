import { useState } from 'react'
import { useApp } from '../context/AppContext'
import HeroBanner from '../components/HeroBanner'
import Avatar from '../components/Avatar'
import TrustBar from '../components/TrustBar'
import { updateUserProfile } from '../firebase/firestore'

export default function Profile() {
  const { user, profile, refreshProfile, posts } = useApp()
  const u = profile || {}
  const [form, setForm] = useState({
    name: u.name||'', location: u.location||'',
    skills: Array.isArray(u.skills) ? u.skills.join(', ') : '',
    interests: u.interests||'',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [error, setError]   = useState('')

  const myPosts     = posts.filter(p => p.userId===user?.uid)
  const solvedPosts = myPosts.filter(p => p.status==='Solved')
  const avatarUser  = { initials:u.initials||u.name?.split(' ').map(w=>w[0]).join('').slice(0,2)||'?', color:u.color||'#0d9488' }

  const handleSave = async () => {
    if (!user) return
    setSaving(true); setError('')
    try {
      const skillsArr = form.skills.split(',').map(s=>s.trim()).filter(Boolean)
      const initials  = form.name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)
      await updateUserProfile(user.uid, { name:form.name, location:form.location, skills:skillsArr, interests:form.interests, initials })
      await refreshProfile()
      setSaved(true); setTimeout(()=>setSaved(false),2500)
    } catch(e) { setError('Failed to save. Please try again.'); console.error(e) }
    finally { setSaving(false) }
  }

  return (
    <div className="page">
      <HeroBanner label="PROFILE" title={u.name||'Your Profile'} subtitle={`${u.role||'Both'} · ${u.location||'Location not set'}`} />

      <div className="cols-2">
        <div className="card p-5 sm:p-6">
          <div className="section-label">PUBLIC PROFILE</div>
          <h3 className="h3 text-gray-900 mb-5">Skills and reputation</h3>

          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
            <Avatar user={avatarUser} size={52} />
            <div>
              <p className="font-bold text-base sm:text-lg">{u.name||'—'}</p>
              <p className="text-gray-400 text-sm">{u.email||user?.email}</p>
              <p className="text-gray-400 text-sm">{u.location||'No location set'}</p>
            </div>
          </div>

          {[
            { label:'Trust score',     val:`${u.trust??100}%` },
            { label:'Contributions',   val:u.contributions??0 },
            { label:'Total requests',  val:myPosts.length },
            { label:'Solved requests', val:solvedPosts.length },
          ].map(r => (
            <div key={r.label} className="flex justify-between py-2.5 border-b border-gray-100">
              <span className="text-gray-500 text-sm">{r.label}</span>
              <span className="font-bold text-sm">{r.val}</span>
            </div>
          ))}

          <div className="py-4 border-b border-gray-100">
            <p className="font-semibold text-sm mb-2">Trust</p>
            <TrustBar value={u.trust??100} />
            <p className="text-xs text-gray-400 mt-1">{u.trust??100}% community trust</p>
          </div>

          {(u.skills||[]).length>0 && (
            <div className="py-4 border-b border-gray-100">
              <p className="font-semibold text-sm mb-2">Skills</p>
              <div className="flex gap-1.5 flex-wrap">{u.skills.map(s=><span key={s} className="tag tag-teal">{s}</span>)}</div>
            </div>
          )}

          <div className="py-4">
            <p className="font-semibold text-sm mb-2">Badges</p>
            {(u.badges||[]).length>0
              ? <div className="flex gap-1.5 flex-wrap">{u.badges.map(b=><span key={b} className="tag tag-gray">{b}</span>)}</div>
              : <p className="text-gray-400 text-sm">No badges yet — start helping others to earn them!</p>
            }
          </div>
        </div>

        <div className="card p-5 sm:p-6">
          <div className="section-label">EDIT PROFILE</div>
          <h3 className="h3 text-gray-900 mb-5">Update your identity</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">Full name</label>
              <input className="input-field" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Location</label>
              <input className="input-field" placeholder="Karachi, Pakistan" value={form.location}
                onChange={e=>setForm({...form,location:e.target.value})} />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium block mb-1.5">Skills <span className="text-gray-400 font-normal">(comma-separated)</span></label>
            <input className="input-field" placeholder="Figma, UI/UX, HTML/CSS" value={form.skills}
              onChange={e=>setForm({...form,skills:e.target.value})} />
          </div>

          <div className="mb-5">
            <label className="text-sm font-medium block mb-1.5">Interests</label>
            <input className="input-field" placeholder="Hackathons, UI/UX, Community Building" value={form.interests}
              onChange={e=>setForm({...form,interests:e.target.value})} />
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}
          <button className="btn-primary w-full" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : saved ? '✓ Profile saved!' : 'Save profile'}
          </button>
          {saved && <p className="mt-3 text-center text-teal text-sm font-medium">Changes saved ✓</p>}

          {myPosts.length>0 && (
            <div className="mt-6">
              <div className="section-label mb-3">MY RECENT REQUESTS</div>
              {myPosts.slice(0,3).map(p => (
                <div key={p.id} className="flex justify-between items-center py-2.5 border-b border-gray-100 text-sm gap-2">
                  <span className="truncate flex-1 text-gray-700">{p.title}</span>
                  <span className={`tag flex-shrink-0 ${p.status==='Solved'?'tag-green':'tag-teal'}`}>{p.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
