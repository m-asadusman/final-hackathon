import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import HeroBanner from '../components/HeroBanner'
import { generateAISummary } from '../utils/aiHelpers'

export default function Insights() {
  const { posts, users } = useApp()

  const openPosts      = posts.filter(p => p.status === 'Open')
  const solvedPosts    = posts.filter(p => p.status === 'Solved')
  const highUrgency    = openPosts.filter(p => p.urgency === 'High')
  const trustedHelpers = users.filter(u => (u.trust ?? 100) >= 80)
  const solveRate      = posts.length ? Math.round((solvedPosts.length / posts.length) * 100) : 0

  const catCounts = {}
  posts.forEach(p => { catCounts[p.category] = (catCounts[p.category] || 0) + 1 })
  const topCategory = Object.entries(catCounts).sort((a,b) => b[1]-a[1])[0]?.[0] || 'N/A'

  const urgCounts = { High: 0, Medium: 0, Low: 0 }
  openPosts.forEach(p => { urgCounts[p.urgency] = (urgCounts[p.urgency] || 0) + 1 })

  const TRENDS = [
    { label: 'TREND PULSE',   title: topCategory,           desc: 'Most requested support area.' },
    { label: 'URGENCY WATCH', title: highUrgency.length,    desc: 'High-priority open requests.' },
    { label: 'MENTOR POOL',   title: trustedHelpers.length, desc: 'Members with 80%+ trust score.' },
    { label: 'SOLVE RATE',    title: `${solveRate}%`,        desc: 'Requests successfully resolved.' },
  ]

  return (
    <div className="page">
      <HeroBanner
        label="AI CENTER"
        title="See what the platform is learning."
        subtitle="Real-time insights that help you understand activity and trends."
      />

      
      <div className="cols-4 mb-5 sm:mb-6">
        {TRENDS.map(t => (
          <div key={t.label} className="stat-card">
            <div className="section-label">{t.label}</div>
            <p className="h3 text-gray-900 mt-1 break-words">{t.title}</p>
            <p className="text-gray-400 text-[10px] sm:text-xs mt-1 leading-snug">{t.desc}</p>
          </div>
        ))}
      </div>

      
      <div className="cols-2 mb-5 sm:mb-6">
        <div className="card p-5 sm:p-6">
          <div className="section-label">URGENCY DISTRIBUTION</div>
          <h3 className="h4 text-gray-900 mb-4">Open requests by priority</h3>
          {Object.entries(urgCounts).map(([level, count]) => {
            const pct   = openPosts.length ? Math.round((count / openPosts.length) * 100) : 0
            const color = level === 'High' ? '#dc2626' : level === 'Medium' ? '#d97706' : '#6b7280'
            return (
              <div key={level} className="mb-4">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium">{level}</span>
                  <span className="text-gray-400">{count} ({pct}%)</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            )
          })}
        </div>

        <div className="card p-5 sm:p-6">
          <div className="section-label">CATEGORY BREAKDOWN</div>
          <h3 className="h4 text-gray-900 mb-4">Posts by category</h3>
          {Object.entries(catCounts).sort((a,b) => b[1]-a[1]).map(([cat, count]) => {
            const pct = posts.length ? Math.round((count / posts.length) * 100) : 0
            return (
              <div key={cat} className="flex justify-between items-center py-2.5 border-b border-gray-100 text-sm gap-3">
                <span className="font-medium truncate">{cat}</span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-16 sm:w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-teal transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-gray-400 w-5 text-right text-xs">{count}</span>
                </div>
              </div>
            )
          })}
          {Object.keys(catCounts).length === 0 && (
            <p className="text-gray-400 text-sm text-center py-4">No data yet.</p>
          )}
        </div>
      </div>

      
      <div className="card p-5 sm:p-6">
        <div className="section-label">AI RECOMMENDATIONS</div>
        <h3 className="h3 text-gray-900 mb-5">Requests needing attention</h3>

        {posts.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-semibold">No requests in the system yet.</p>
            <Link to="/create"><button className="btn-primary mt-4">Create the first request</button></Link>
          </div>
        ) : (
          [...posts.filter(p => p.status === 'Open' && p.urgency === 'High'),
           ...posts.filter(p => !(p.status === 'Open' && p.urgency === 'High'))]
            .slice(0, 6)
            .map(r => (
              <div key={r.id} className="p-4 sm:p-5 border border-gray-100 rounded-xl mb-3 hover:shadow-sm transition-shadow">
                <div className="flex flex-col xs:flex-row xs:justify-between xs:items-start gap-2 mb-2">
                  <p className="font-bold text-sm flex-1">{r.title}</p>
                  <div className="flex gap-1.5 flex-shrink-0 flex-wrap">
                    <span className={`tag text-xs ${r.urgency==='High'?'tag-red':r.urgency==='Medium'?'tag-yellow':'tag-gray'}`}>{r.urgency}</span>
                    <span className={`tag text-xs ${r.status==='Solved'?'tag-green':'tag-teal'}`}>{r.status}</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-3">{generateAISummary(r)}</p>
                <div className="flex justify-between items-center gap-2 flex-wrap">
                  <div className="flex gap-1.5 flex-wrap">
                    <span className="tag tag-teal text-xs">{r.category}</span>
                    {(r.tags||[]).slice(0,2).map(t => <span key={t} className="tag tag-gray text-xs">{t}</span>)}
                  </div>
                  <Link to={`/request/${r.id}`}>
                    <button className="btn-ghost text-xs py-1 px-3">View →</button>
                  </Link>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  )
}
