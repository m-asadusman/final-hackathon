import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import RequestCard from '../components/RequestCard'

const FLOW = [
  { t: 'Ask for help clearly', d: 'Create structured requests with category, urgency, AI suggestions, and tags that attract the right people.' },
  { t: 'Discover the right people', d: 'Use the explore feed, helper lists, notifications, and messaging to move quickly once a match happens.' },
  { t: 'Track real contribution', d: 'Trust scores, badges, solved requests, and rankings help the community recognize meaningful support.' },
]

export default function Landing() {
  const { posts, users } = useApp()
  const solved = posts.filter(p => p.status === 'Solved').length

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid grid-cols-2 gap-6 mb-10">
        <div className="py-8">
          <div className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">COMMUNITY PLATFORM</div>
          <h1 className="font-syne text-5xl font-black leading-tight mb-4">
            Find help faster.<br />Become help that matters.
          </h1>
          <p className="text-gray-500 leading-relaxed mb-8 max-w-md">
            HelpHub AI is a community-powered support network for students, mentors, creators, and builders.
          </p>
          <div className="flex gap-4">
            <Link to="/auth"><button className="btn-primary">Join the community</button></Link>
            <Link to="/explore"><button className="btn-ghost">Browse requests</button></Link>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { label: 'MEMBERS', val: users.length || '0', desc: 'Students, mentors, and helpers in the loop.' },
              { label: 'REQUESTS', val: posts.length || '0', desc: 'Support posts shared across learning journeys.' },
              { label: 'SOLVED', val: solved || '0', desc: 'Problems resolved through fast community action.' },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">{s.label}</div>
                <div className="font-syne text-3xl font-black mb-1">{s.val}</div>
                <div className="text-gray-400 text-xs">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-dark p-8">
          <div className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">LIVE PRODUCT FEEL</div>
          <h2 className="font-syne text-2xl font-black mb-4 leading-tight">More than a form.<br />More like an ecosystem.</h2>
          <p className="text-gray-400 text-sm mb-6">A real-time community platform with AI summaries, trust scores, Firestore-backed messaging, and leaderboard momentum.</p>
          {[
            { t: 'AI request intelligence', d: 'Auto-categorization, urgency detection, tags, and rewrite suggestions.' },
            { t: 'Community trust graph', d: 'Badges, helper rankings, trust score boosts, and visible contribution history.' },
            { t: 'Real-time Firestore backend', d: 'All posts, messages, and notifications are live and persisted.' },
          ].map(f => (
            <div key={f.t} className="rounded-xl p-4 mb-3" style={{ background: 'rgba(255,255,255,.07)' }}>
              <div className="font-bold text-sm mb-1">{f.t}</div>
              <div className="text-gray-400 text-xs">{f.d}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <div className="section-label">CORE FLOW</div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-syne text-2xl font-black">From struggling alone to solving together</h2>
          <Link to="/onboarding"><button className="btn-ghost text-sm">Try onboarding</button></Link>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {FLOW.map(f => (
            <div key={f.t} className="card p-6">
              <div className="font-bold mb-2">{f.t}</div>
              <div className="text-gray-500 text-sm">{f.d}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="section-label">LIVE REQUESTS</div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-syne text-2xl font-black">Community problems currently in motion</h2>
          <Link to="/explore"><button className="btn-ghost text-sm">View full feed</button></Link>
        </div>
        {posts.length === 0 ? (
          <div className="card p-12 text-center text-gray-400">
            <div className="text-4xl mb-3">🌱</div>
            <div className="font-semibold">No requests yet.</div>
            <div className="text-sm mt-1">Be the first to post a help request!</div>
            <Link to="/create"><button className="btn-primary mt-4">Post a request</button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {posts.slice(0, 3).map(r => <RequestCard key={r.id} req={r} />)}
          </div>
        )}
      </div>
    </div>
  )
}
