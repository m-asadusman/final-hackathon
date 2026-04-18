import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import HeroBanner from '../components/HeroBanner'
import Avatar from '../components/Avatar'
import { CategoryTag, UrgencyTag, StatusTag } from '../components/Tags'
import { generateAISummary } from '../utils/aiHelpers'
import { getPost, markPostSolved, offerHelp, createNotification } from '../firebase/firestore'

export default function RequestDetail() {
  const { id } = useParams()
  const { user, profile, users } = useApp()
  const navigate = useNavigate()
  const [req, setReq] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    getPost(id).then(data => {
      setReq(data)
      setLoading(false)
    })
  }, [id])

  const handleMarkSolved = async () => {
    setActionLoading(true)
    await markPostSolved(id)
    if (req?.userId) {
      await createNotification(req.userId, {
        text: `Your request "${req.title}" was marked as solved`,
        type: 'Status',
        time: 'Just now',
      })
    }
    setReq(r => ({ ...r, status: 'Solved' }))
    setActionLoading(false)
  }

  const handleOfferHelp = async () => {
    if (!user) return navigate('/auth')
    setActionLoading(true)
    await offerHelp(id, user.uid)
    if (req?.userId && req.userId !== user.uid) {
      await createNotification(req.userId, {
        text: `${profile?.name || 'Someone'} offered help on "${req.title}"`,
        type: 'Match',
        time: 'Just now',
      })
    }
    setReq(r => ({ ...r, helpers: (r.helpers || 0) + 1 }))
    setActionLoading(false)
  }

  if (loading) return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center text-gray-400">
      <div className="text-4xl animate-pulse mb-3">⏳</div>
      <div>Loading request...</div>
    </div>
  )

  if (!req) return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center text-gray-400">
      <div className="text-5xl mb-4">🔍</div>
      <div className="font-semibold text-lg">Request not found.</div>
      <button className="btn-primary mt-4" onClick={() => navigate('/explore')}>Back to Explore</button>
    </div>
  )

  const isOwner = user?.uid === req.userId
  const hasHelped = req.helperIds?.includes(user?.uid)
  const helperProfiles = users.filter(u => req.helperIds?.includes(u.id))

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="card-dark p-10 mb-8">
        <div className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">REQUEST DETAIL</div>
        <div className="flex gap-2 mb-4">
          <CategoryTag category={req.category} />
          <UrgencyTag urgency={req.urgency} />
          <StatusTag status={req.status} />
        </div>
        <h1 className="font-syne text-4xl font-black leading-tight mb-3">{req.title}</h1>
        <p className="text-gray-400 text-sm max-w-2xl">{req.desc}</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <div className="card p-6">
            <div className="section-label">AI SUMMARY</div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-teal rounded-lg flex items-center justify-center text-white font-black text-sm">H</div>
              <span className="font-bold">HelpHub AI</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">{generateAISummary(req)}</p>
            <div className="flex gap-2 flex-wrap">
              {(req.tags || []).map(t => <span key={t} className="tag tag-gray">{t}</span>)}
            </div>
          </div>

          <div className="card p-6">
            <div className="section-label">ACTIONS</div>
            <div className="flex gap-3 mt-2 flex-wrap">
              {req.status === 'Solved' ? (
                <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
                  ✓ This request has been resolved
                </div>
              ) : (
                <>
                  {!isOwner && (
                    <button className="btn-primary" onClick={handleOfferHelp}
                      disabled={actionLoading || hasHelped}>
                      {hasHelped ? '✓ You offered help' : 'I can help'}
                    </button>
                  )}
                  {isOwner && (
                    <button className="btn-ghost" onClick={handleMarkSolved} disabled={actionLoading}>
                      {actionLoading ? 'Updating...' : 'Mark as solved'}
                    </button>
                  )}
                  {!user && (
                    <button className="btn-primary" onClick={() => navigate('/auth')}>Login to help</button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="card p-6">
            <div className="section-label">REQUESTER</div>
            <div className="flex items-center gap-3 mt-2">
              <Avatar user={{
                initials: req.userName?.split(' ').map(w => w[0]).join('').slice(0, 2) || '?',
                color: '#0d9488',
              }} />
              <div>
                <div className="font-bold">{req.userName || 'Anonymous'}</div>
                <div className="text-gray-400 text-sm">{req.location || 'Remote'}</div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="section-label">HELPERS</div>
            <h3 className="font-syne font-bold text-lg mb-4">
              {req.helpers || 0} {(req.helpers || 0) === 1 ? 'person' : 'people'} ready to support
            </h3>
            {helperProfiles.length === 0 && (
              <div className="text-gray-400 text-sm py-2">No helpers yet. Be the first!</div>
            )}
            {helperProfiles.map(u => (
              <div key={u.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl mb-3">
                <Avatar user={{ initials: u.initials || '?', color: u.color || '#0d9488' }} />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm">{u.name}</div>
                  <div className="text-gray-400 text-xs">{(u.skills || []).slice(0, 3).join(', ')}</div>
                </div>
                <span className="badge-pill flex-shrink-0">Trust {u.trust ?? 100}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
