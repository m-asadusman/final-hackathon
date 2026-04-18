import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import HeroBanner from '../components/HeroBanner'
import Avatar from '../components/Avatar'
import TrustBar from '../components/TrustBar'
import { StatusTag } from '../components/Tags'

const QUICK_ACTIONS = [
  { label: '+ Create a Request', to: '/create' },
  { label: 'Browse Explore Feed', to: '/explore' },
  { label: 'View Leaderboard', to: '/leaderboard' },
  { label: 'AI Center', to: '/insights' },
]

export default function Dashboard() {
  const { user, profile, posts, users, notifications } = useApp()

  const myPosts = posts.filter(p => p.userId === user?.uid)
  const solved = myPosts.filter(p => p.status === 'Solved').length
  const open = myPosts.filter(p => p.status === 'Open').length
  const unread = notifications.filter(n => !n.read).length

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <HeroBanner
        label="DASHBOARD"
        title={`Welcome back, ${profile?.name?.split(' ')[0] || 'Friend'}.`}
        subtitle="Your activity hub for requests, helpers, and community progress."
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Trust Score', val: `${profile?.trust ?? 100}%`, desc: 'Your community trust' },
          { label: 'Contributions', val: profile?.contributions ?? 0, desc: 'Total requests helped' },
          { label: 'My Open', val: open, desc: 'Awaiting helpers' },
          { label: 'Unread Notifs', val: unread, desc: 'Notifications' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="section-label">{s.label}</div>
            <div className="font-syne text-4xl font-black">{s.val}</div>
            <div className="text-gray-400 text-sm mt-1">{s.desc}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="section-label">MY REQUESTS</div>
          <h3 className="font-syne text-xl font-bold mb-4">Your activity</h3>
          {myPosts.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">
              You haven't posted any requests yet.
              <br />
              <Link to="/create"><button className="btn-primary mt-3">Create your first request</button></Link>
            </div>
          )}
          {myPosts.slice(0, 5).map(r => (
            <Link key={r.id} to={`/request/${r.id}`} className="block no-underline">
              <div className="p-3 border border-gray-100 rounded-xl mb-3 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start mb-1">
                  <div className="font-semibold text-sm text-gray-900 line-clamp-1 flex-1 mr-2">{r.title}</div>
                  <StatusTag status={r.status} />
                </div>
                <div className="text-gray-400 text-xs">{r.category}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <div className="card p-6">
            <div className="section-label">QUICK ACTIONS</div>
            <h3 className="font-syne text-xl font-bold mb-4">Get started</h3>
            {QUICK_ACTIONS.map(({ label, to }) => (
              <Link key={to} to={to} className="block no-underline">
                <button className="btn-ghost w-full mb-2 text-left">{label}</button>
              </Link>
            ))}
          </div>

          <div className="card p-6">
            <div className="section-label">TOP HELPERS</div>
            {users.length === 0 && <div className="text-gray-400 text-sm py-4 text-center">No members yet.</div>}
            {users.slice(0, 4).map(u => (
              <div key={u.id} className="flex items-center gap-3 mb-4">
                <Avatar user={{ initials: u.initials || '?', color: u.color || '#0d9488' }} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{u.name}</div>
                  <TrustBar value={u.trust || 100} />
                </div>
                <div className="font-bold text-sm">{u.trust ?? 100}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
