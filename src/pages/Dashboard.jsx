import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import HeroBanner from '../components/HeroBanner'
import Avatar from '../components/Avatar'
import TrustBar from '../components/TrustBar'
import { StatusTag } from '../components/Tags'

const QUICK = [
  { label: '+ Create a Request', to: '/create' },
  { label: 'Browse Explore Feed', to: '/explore' },
  { label: 'View Leaderboard',   to: '/leaderboard' },
  { label: 'AI Center',          to: '/insights' },
]

export default function Dashboard() {
  const { user, profile, posts, users, notifications } = useApp()
  const myPosts = posts.filter(p => p.userId === user?.uid)
  const unread  = notifications.filter(n => !n.read).length

  return (
    <div className="page">
      <HeroBanner
        label="DASHBOARD"
        title={`Welcome back, ${profile?.name?.split(' ')[0] || 'Friend'}.`}
        subtitle="Your activity hub for requests, helpers, and community progress."
      />

      <div className="cols-4 mb-5 sm:mb-6">
        {[
          { label: 'Trust Score',   val: `${profile?.trust ?? 100}%` },
          { label: 'Contributions', val: profile?.contributions ?? 0 },
          { label: 'My Open',       val: myPosts.filter(p => p.status === 'Open').length },
          { label: 'Unread',        val: unread },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="section-label">{s.label}</div>
            <p className="h2 text-gray-900 mt-1">{s.val}</p>
          </div>
        ))}
      </div>

      <div className="cols-2">
        <div className="card p-5 sm:p-6">
          <div className="section-label">MY REQUESTS</div>
          <h3 className="h3 text-gray-900 mb-4">Your activity</h3>
          {myPosts.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              {/* <div className="text-3xl mb-2">📋</div> */}
              <p className="text-sm font-medium mb-3">No requests yet.</p>
              <Link to="/create"><button className="btn-primary text-xs">Create your first request</button></Link>
            </div>
          ) : myPosts.slice(0, 5).map(r => (
            <Link key={r.id} to={`/request/${r.id}`} className="block">
              <div className="p-3 border border-gray-100 rounded-xl mb-2 hover:shadow-sm hover:border-gray-200 transition-all">
                <div className="flex justify-between items-start gap-2">
                  <p className="font-semibold text-sm text-gray-900 line-clamp-1 flex-1">{r.title}</p>
                  <StatusTag status={r.status} />
                </div>
                <p className="text-gray-400 text-xs mt-0.5">{r.category}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <div className="card p-5 sm:p-6">
            <div className="section-label">QUICK ACTIONS</div>
            <h3 className="h3 text-gray-900 mb-4">Get started</h3>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
              {QUICK.map(({ label, to }) => (
                <Link key={to} to={to}>
                  <button className="btn-ghost w-full text-xs sm:text-sm py-2 justify-start">{label}</button>
                </Link>
              ))}
            </div>
          </div>

          <div className="card p-5 sm:p-6">
            <div className="section-label">TOP HELPERS</div>
            {users.length === 0
              ? <p className="text-gray-400 text-sm py-4 text-center">No members yet.</p>
              : users.slice(0, 4).map(u => (
                <div key={u.id} className="flex items-center gap-3 mb-3 last:mb-0">
                  <Avatar user={{ initials: u.initials || '?', color: u.color || '#0d9488' }} size={34} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{u.name}</p>
                    <TrustBar value={u.trust || 100} />
                  </div>
                  <p className="font-bold text-sm text-gray-700 flex-shrink-0">{u.trust ?? 100}%</p>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}
