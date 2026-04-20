import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Avatar from '../components/Avatar'
import { CategoryTag, UrgencyTag, StatusTag } from '../components/Tags'
import { generateAISummary } from '../utils/aiHelpers'
import { getPost, markPostSolved, offerHelp, createNotification } from '../firebase/firestore'
import { Loader } from 'lucide-react'

export default function RequestDetail() {
  const { id } = useParams()
  const { user, profile, users } = useApp()
  const navigate = useNavigate()
  const [req, setReq]   = useState(null)
  const [loading, setLoading]     = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => { getPost(id).then(d => { setReq(d); setLoading(false) }) }, [id])

  const handleMarkSolved = async () => {
    setActionLoading(true)
    await markPostSolved(id)
    if (req?.userId) await createNotification(req.userId, { text:`Your request "${req.title}" was marked as solved`, type:'Status', time:'Just now' })
    setReq(r => ({ ...r, status:'Solved' }))
    setActionLoading(false)
  }

  const handleOfferHelp = async () => {
    if (!user) return navigate('/auth')
    setActionLoading(true)
    await offerHelp(id, user.uid)
    if (req?.userId && req.userId !== user.uid)
      await createNotification(req.userId, { text:`${profile?.name||'Someone'} offered help on "${req.title}"`, type:'Match', time:'Just now' })
    setReq(r => ({ ...r, helpers:(r.helpers||0)+1, helperIds:[...(r.helperIds||[]),user.uid] }))
    setActionLoading(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] text-gray-400">
    <div className="text-center">
      <Loader className="w-10 h-10 mx-auto mb-3 animate-spin text-gray-400" />
      <p>Loading...</p>
    </div>
  </div>
  )
  if (!req) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center text-gray-400">
        <div className="text-5xl mb-4">🔍</div>
        <p className="font-semibold text-lg">Request not found.</p>
        <button className="btn-primary mt-4" onClick={() => navigate('/explore')}>Back to Explore</button>
      </div>
    </div>
  )

  const isOwner  = user?.uid === req.userId
  const hasHelped = req.helperIds?.includes(user?.uid)
  const helperProfiles = users.filter(u => req.helperIds?.includes(u.id))

  return (
    <div className="page">
      <div className="card-dark p-5 sm:p-8 lg:p-10 mb-6 sm:mb-8 rounded-2xl">
        <p className="text-[10px] sm:text-xs font-bold tracking-[0.16em] text-gray-400 uppercase mb-3"
          style={{ fontFamily:"'Instrument Sans', sans-serif" }}>REQUEST DETAIL</p>
        <div className="flex gap-2 flex-wrap mb-3">
          <CategoryTag category={req.category} />
          <UrgencyTag urgency={req.urgency} />
          <StatusTag status={req.status} />
        </div>
        <h1 className="h1 text-white mb-3">{req.title}</h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-2xl leading-relaxed">{req.desc}</p>
      </div>

      <div className="cols-2">
        <div className="flex flex-col gap-4">
          <div className="card p-5 sm:p-6">
            <div className="section-label">AI SUMMARY</div>
            <div className="flex items-center gap-2.5 my-3">
              <div className="w-8 h-8 bg-teal rounded-lg flex items-center justify-center text-white font-bold text-sm">H</div>
              <span className="font-semibold text-sm">Helplytics</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-3">{generateAISummary(req)}</p>
            <div className="flex gap-1.5 flex-wrap">
              {(req.tags||[]).map(t => <span key={t} className="tag tag-gray">{t}</span>)}
            </div>
          </div>

          <div className="card p-5 sm:p-6">
            <div className="section-label mb-3">ACTIONS</div>
            <div className="flex gap-3 flex-wrap">
              {req.status === 'Solved' ? (
                <p className="flex items-center gap-2 text-green-600 font-semibold text-sm">✓ This request has been resolved</p>
              ) : (
                <>
                  {!isOwner && (
                    <button className="btn-primary" onClick={handleOfferHelp} disabled={actionLoading||hasHelped}>
                      {hasHelped ? '✓ You offered help' : 'I can help'}
                    </button>
                  )}
                  {isOwner && (
                    <button className="btn-ghost" onClick={handleMarkSolved} disabled={actionLoading}>
                      {actionLoading ? 'Updating...' : 'Mark as solved'}
                    </button>
                  )}
                  {!user && <button className="btn-primary" onClick={() => navigate('/auth')}>Login to help</button>}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="card p-5 sm:p-6">
            <div className="section-label mb-3">REQUESTER</div>
            <div className="flex items-center gap-3">
              <Avatar user={{ initials:req.userName?.split(' ').map(w=>w[0]).join('').slice(0,2)||'?', color:'#0d9488' }} />
              <div>
                <p className="font-bold">{req.userName||'Anonymous'}</p>
                <p className="text-gray-400 text-sm">{req.location||'Remote'}</p>
              </div>
            </div>
          </div>

          <div className="card p-5 sm:p-6">
            <div className="section-label">HELPERS</div>
            <h3 className="h4 text-gray-900 mb-3">
              {req.helpers||0} {(req.helpers||0)===1?'person':'people'} ready to support
            </h3>
            {helperProfiles.length===0
              ? <p className="text-gray-400 text-sm">No helpers yet. Be the first!</p>
              : helperProfiles.map(u => (
                <div key={u.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl mb-3">
                  <Avatar user={{ initials:u.initials||'?', color:u.color||'#0d9488' }} size={34} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{u.name}</p>
                    <p className="text-gray-400 text-xs">{(u.skills||[]).slice(0,3).join(', ')}</p>
                  </div>
                  <span className="badge-pill flex-shrink-0">Trust {u.trust??100}%</span>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}
