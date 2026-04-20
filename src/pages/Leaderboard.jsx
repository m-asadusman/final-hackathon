import { useApp } from '../context/AppContext'
import HeroBanner from '../components/HeroBanner'
import Avatar from '../components/Avatar'
import TrustBar from '../components/TrustBar'

const MEDALS = ['🥇','🥈','🥉']

export default function Leaderboard() {
  const { users } = useApp()
  const ranked = [...users].sort((a,b) => (b.trust??100)-(a.trust??100))

  return (
    <div className="page">
      <HeroBanner
        label="LEADERBOARD"
        title="Recognize the people who keep the community moving."
        subtitle="Trust score, contribution count, and badges create visible momentum for reliable helpers."
      />
      {users.length===0 ? (
        <div className="card p-12 text-center text-gray-400">
          <div className="text-4xl mb-3">🏆</div>
          <p className="font-semibold">No members yet. Be the first to join!</p>
        </div>
      ) : (
        <div className="cols-2">
          <div className="card p-5 sm:p-6">
            <div className="section-label">TOP HELPERS</div>
            <h3 className="h3 text-gray-900 mb-5">Rankings</h3>
            {ranked.map((u,i) => (
              <div key={u.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-100 rounded-xl mb-3 hover:shadow-sm transition-shadow">
                <div className="text-xl sm:text-2xl w-7 sm:w-8 text-center flex-shrink-0">{MEDALS[i]||`#${i+1}`}</div>
                <Avatar user={{ initials:u.initials||'?', color:u.color||'#0d9488' }} size={36} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">#{i+1} {u.name}</p>
                  <p className="text-gray-400 text-xs mt-0.5 truncate">{(u.skills||[]).slice(0,3).join(', ')||'No skills listed'}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="h4 text-gray-900">{u.trust??100}%</p>
                  <p className="text-gray-400 text-xs">{u.contributions??0} contributions</p>
                </div>
              </div>
            ))}
          </div>

          <div className="card p-5 sm:p-6">
            <div className="section-label">TRUST & BADGES</div>
            <h3 className="h3 text-gray-900 mb-5">Achievement board</h3>
            {ranked.map(u => (
              <div key={u.id} className="p-3 sm:p-4 border border-gray-100 rounded-xl mb-3">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-bold text-sm">{u.name}</p>
                  <span className="font-bold text-sm text-gray-700">{u.trust??100}%</span>
                </div>
                <p className="text-gray-400 text-xs mb-2">{(u.badges||[]).join(' • ')||'No badges yet'}</p>
                <TrustBar value={u.trust??100} />
                {(u.badges||[]).length>0 && (
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    {u.badges.map(b => <span key={b} className="tag tag-gray">{b}</span>)}
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
