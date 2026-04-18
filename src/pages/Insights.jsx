import { useApp } from '../context/AppContext'
import HeroBanner from '../components/HeroBanner'
import { generateAISummary } from '../utils/aiHelpers'
import { Link } from 'react-router-dom'

export default function Insights() {
  const { posts, users } = useApp()

  // Derive all stats from live Firestore data
  const openPosts = posts.filter(p => p.status === 'Open')
  const solvedPosts = posts.filter(p => p.status === 'Solved')
  const highUrgency = posts.filter(p => p.urgency === 'High' && p.status === 'Open')

  // Top category
  const catCounts = {}
  posts.forEach(p => { catCounts[p.category] = (catCounts[p.category] || 0) + 1 })
  const topCategory = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

  // Top urgency category
  const urgCounts = { High: 0, Medium: 0, Low: 0 }
  openPosts.forEach(p => { urgCounts[p.urgency] = (urgCounts[p.urgency] || 0) + 1 })

  // Trusted helpers = users with trust >= 80
  const trustedHelpers = users.filter(u => (u.trust ?? 100) >= 80)

  // Solve rate
  const solveRate = posts.length ? Math.round((solvedPosts.length / posts.length) * 100) : 0

  const TREND_CARDS = [
    {
      label: 'TREND PULSE',
      title: topCategory,
      desc: 'Most requested support area based on all community posts.',
      color: 'bg-teal-light',
    },
    {
      label: 'URGENCY WATCH',
      title: highUrgency.length,
      desc: 'Open requests currently flagged as high priority.',
      color: 'bg-red-50',
    },
    {
      label: 'MENTOR POOL',
      title: trustedHelpers.length,
      desc: 'Members with 80%+ trust score and strong contribution signals.',
      color: 'bg-yellow-50',
    },
    {
      label: 'SOLVE RATE',
      title: `${solveRate}%`,
      desc: 'Percentage of all posted requests that have been resolved.',
      color: 'bg-green-50',
    },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <HeroBanner
        label="AI CENTER"
        title="See what the platform intelligence is noticing."
        subtitle="Insights are derived in real-time from live Firestore data — no static values."
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        {TREND_CARDS.map(t => (
          <div key={t.label} className={`stat-card ${t.color}`}>
            <div className="section-label">{t.label}</div>
            <div className="font-syne text-3xl font-black mb-1">{t.title}</div>
            <div className="text-gray-500 text-xs">{t.desc}</div>
          </div>
        ))}
      </div>

      {/* Urgency distribution */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="card p-6">
          <div className="section-label">URGENCY DISTRIBUTION</div>
          <h3 className="font-syne text-xl font-bold mb-4">Open requests by priority</h3>
          {Object.entries(urgCounts).map(([level, count]) => {
            const pct = openPosts.length ? Math.round((count / openPosts.length) * 100) : 0
            const color = level === 'High' ? '#dc2626' : level === 'Medium' ? '#d97706' : '#6b7280'
            return (
              <div key={level} className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{level}</span>
                  <span className="text-gray-500">{count} requests ({pct}%)</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            )
          })}
        </div>

        <div className="card p-6">
          <div className="section-label">CATEGORY BREAKDOWN</div>
          <h3 className="font-syne text-xl font-bold mb-4">Posts by category</h3>
          {Object.entries(catCounts).sort((a, b) => b[1] - a[1]).map(([cat, count]) => {
            const pct = posts.length ? Math.round((count / posts.length) * 100) : 0
            return (
              <div key={cat} className="flex justify-between items-center py-2 border-b border-gray-100 text-sm">
                <span className="font-medium">{cat}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-teal" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-gray-400 w-8 text-right">{count}</span>
                </div>
              </div>
            )
          })}
          {Object.keys(catCounts).length === 0 && (
            <div className="text-gray-400 text-sm text-center py-4">No data yet.</div>
          )}
        </div>
      </div>

      {/* AI recommendations */}
      <div className="card p-6">
        <div className="section-label">AI RECOMMENDATIONS</div>
        <h3 className="font-syne text-2xl font-black mb-5">Requests needing attention</h3>

        {posts.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <div className="text-4xl mb-3">📭</div>
            <div className="font-semibold">No requests in the system yet.</div>
            <Link to="/create">
              <button className="btn-primary mt-4">Create the first request</button>
            </Link>
          </div>
        ) : (
          // Show open high-urgency first, then the rest
          [...posts.filter(p => p.status === 'Open' && p.urgency === 'High'),
           ...posts.filter(p => !(p.status === 'Open' && p.urgency === 'High'))]
            .slice(0, 6)
            .map(r => (
              <div key={r.id} className="p-5 border border-gray-100 rounded-xl mb-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-sm flex-1 mr-3">{r.title}</div>
                  <div className="flex gap-2 flex-shrink-0">
                    <span className={`tag text-xs ${r.urgency === 'High' ? 'tag-red' : r.urgency === 'Medium' ? 'tag-yellow' : 'tag-gray'}`}>
                      {r.urgency}
                    </span>
                    <span className={`tag text-xs ${r.status === 'Solved' ? 'tag-green' : 'tag-teal'}`}>
                      {r.status}
                    </span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-3">{generateAISummary(r)}</p>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 flex-wrap">
                    <span className="tag tag-teal text-xs">{r.category}</span>
                    {(r.tags || []).slice(0, 2).map(t => (
                      <span key={t} className="tag tag-gray text-xs">{t}</span>
                    ))}
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
