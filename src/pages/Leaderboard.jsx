import { useApp } from '../context/AppContext'
import HeroBanner from '../components/HeroBanner'
import Avatar from '../components/Avatar'
import TrustBar from '../components/TrustBar'

const MEDALS = ['🥇', '🥈', '🥉']

export default function Leaderboard() {
  const { users, posts } = useApp()
  const ranked = [...users].sort((a, b) => (b.trust ?? 100) - (a.trust ?? 100))

  // Count solved posts per user
  const solvedByUser = {}
  posts.filter(p => p.status === 'Solved').forEach(p => {
    solvedByUser[p.userId] = (solvedByUser[p.userId] || 0) + 1
  })

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <HeroBanner
        label="LEADERBOARD"
        title="Recognize the people who keep the community moving."
        subtitle="Trust score, contribution count, and badges create visible momentum for reliable helpers."
      />

      {users.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">
          <div className="text-4xl mb-3">🏆</div>
          <div className="font-semibold">No members yet. Be the first to join!</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          <div className="card p-6">
            <div className="section-label">TOP HELPERS</div>
            <h3 className="font-syne text-2xl font-black mb-5">Rankings</h3>
            {ranked.map((u, i) => (
              <div key={u.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl mb-3 hover:shadow-sm transition-shadow">
                <div className="text-2xl w-8 text-center">{MEDALS[i] || `#${i + 1}`}</div>
                <Avatar user={{ initials: u.initials || '?', color: u.color || '#0d9488' }} />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm">#{i + 1} {u.name}</div>
                  <div className="text-gray-400 text-xs mt-0.5">
                    {(u.skills || []).slice(0, 3).join(', ') || 'No skills listed'}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-black text-lg">{u.trust ?? 100}%</div>
                  <div className="text-gray-400 text-xs">{u.contributions ?? 0} contributions</div>
                </div>
              </div>
            ))}
          </div>

          <div className="card p-6">
            <div className="section-label">TRUST & BADGES</div>
            <h3 className="font-syne text-2xl font-black mb-5">Achievement board</h3>
            {ranked.map((u, i) => (
              <div key={u.id} className="p-4 border border-gray-100 rounded-xl mb-3">
                <div className="flex justify-between items-center mb-1">
                  <div className="font-bold text-sm">{u.name}</div>
                  <span className="font-black text-sm">{u.trust ?? 100}%</span>
                </div>
                <div className="text-gray-400 text-xs mb-2">
                  {(u.badges || []).join(' • ') || 'No badges yet'}
                </div>
                <TrustBar value={u.trust ?? 100} />
                {(u.badges || []).length > 0 && (
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    {u.badges.map(b => <span key={b} className="tag tag-gray text-xs">{b}</span>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
