import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import RequestCard from '../components/RequestCard'

const FLOW = [
  { n: '01', t: 'Ask for help clearly', d: 'Create structured requests with category, urgency, AI suggestions, and tags that attract the right people.' },
  { n: '02', t: 'Discover the right people', d: 'Use the explore feed, helper lists, notifications, and messaging to move quickly once a match happens.' },
  { n: '03', t: 'Track real contribution', d: 'Trust scores, badges, solved requests, and rankings help the community recognize meaningful support.' },
]
const FEATURES = [
  { t: 'Smart request assistance', d: 'Automatically categorize requests, detect urgency, and get helpful rewrite suggestions.' },
  { t: 'Community trust system', d: 'Earn badges, climb rankings, and build a visible history of meaningful contributions.' },
  { t: 'Real-time experience', d: 'Posts, messages, and notifications update instantly as things happen.' },
]

export default function Landing() {
  const { posts, users } = useApp()
  const solved = posts.filter(p => p.status === 'Solved').length

  return (
    <div className="page">
      
      <div className="cols-2 mb-10 items-start">
        <div className="py-4 sm:py-8">
          <p className="text-xs font-bold tracking-[0.18em] text-gray-400 uppercase mb-4"
            style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
            COMMUNITY PLATFORM
          </p>
          <h1 className="h1 mb-5 text-gray-900">
            Find help faster.<br />
            <span className="text-teal">Become</span> help<br className="hidden xs:block" /> that matters.
          </h1>
          <p className="text-gray-500 leading-relaxed mb-7 max-w-sm text-sm sm:text-base">
            Helplytics is a community-powered support network for students, mentors, creators, and builders.
          </p>
          <div className="flex gap-3 flex-wrap mb-8">
            <Link to="/auth"><button className="btn-primary">Join the community</button></Link>
            <Link to="/explore"><button className="btn-ghost">Browse requests</button></Link>
          </div>

          
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { label: 'MEMBERS',  val: users.length || '0', desc: 'Helpers in the loop.' },
              { label: 'REQUESTS', val: posts.length || '0', desc: 'Support posts live.' },
              { label: 'SOLVED',   val: solved || '0',       desc: 'Problems resolved.' },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <p className="hidden xs:block text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-1"
                  style={{ fontFamily: "'Instrument Sans', sans-serif" }}>{s.label}</p>
                <p className="h3 text-gray-900">{s.val}</p>
                <p className="text-gray-400 text-[10px] sm:text-xs leading-snug mt-0.5">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card-dark p-5 sm:p-7 lg:p-8">
          <p className="text-[10px] font-bold tracking-[0.18em] text-teal/60 uppercase mb-3"
            style={{ fontFamily: "'Instrument Sans', sans-serif" }}>LIVE PRODUCT FEEL</p>
          <h2 className="h2 text-white mb-3">More than a form.<br />More like an ecosystem.</h2>
          <p className="text-gray-400 text-sm mb-5 leading-relaxed">
            Connect, get help, and build trust — all in real time.
          </p>
          {FEATURES.map(f => (
            <div key={f.t} className="rounded-xl p-3.5 sm:p-4 mb-2.5" style={{ background: 'rgba(255,255,255,.08)' }}>
              <p className="font-semibold text-sm mb-0.5 text-white">{f.t}</p>
              <p className="text-gray-400 text-xs leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </div>

      
      <div className="mb-10">
        <div className="section-label">CORE FLOW</div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-5">
          <h2 className="h2 text-gray-900">From struggling alone to solving together</h2>
          <Link to="/onboarding" className="self-start sm:self-auto flex-shrink-0">
            <button className="btn-ghost text-sm">Try onboarding →</button>
          </Link>
        </div>
        <div className="cols-3">
          {FLOW.map(f => (
            <div key={f.t} className="card p-5 sm:p-6">
              <p className="text-2xl font-bold text-teal/30 mb-3 tabular-nums"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{f.n}</p>
              <h3 className="h4 mb-2 text-gray-900">{f.t}</h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </div>

      
      <div>
        <div className="section-label">LIVE REQUESTS</div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-5">
          <h2 className="h2 text-gray-900">Community problems currently in motion</h2>
          <Link to="/explore" className="self-start sm:self-auto flex-shrink-0">
            <button className="btn-ghost text-sm">View full feed →</button>
          </Link>
        </div>
        {posts.length === 0 ? (
          <div className="card p-12 text-center text-gray-400">
            <div className="text-4xl mb-3">🌱</div>
            <p className="font-semibold">No requests yet.</p>
            <p className="text-sm mt-1">Be the first to post a help request!</p>
            <Link to="/create"><button className="btn-primary mt-4">Post a request</button></Link>
          </div>
        ) : (
          <div className="cols-3">
            {posts.slice(0, 3).map(r => <RequestCard key={r.id} req={r} />)}
          </div>
        )}
      </div>
    </div>
  )
}
