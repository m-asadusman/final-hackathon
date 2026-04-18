import { useState } from 'react'
import { useApp } from '../context/AppContext'
import HeroBanner from '../components/HeroBanner'
import RequestCard from '../components/RequestCard'

const CATEGORIES = ['Web Development', 'Design', 'Data Science', 'Career', 'Community']
const URGENCIES = ['High', 'Medium', 'Low']
const STATUSES = ['Open', 'Solved']

export default function Explore() {
  const { posts } = useApp()
  const [cat, setCat] = useState('')
  const [urg, setUrg] = useState('')
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')

  const filtered = posts.filter(r =>
    (!cat || r.category === cat) &&
    (!urg || r.urgency === urg) &&
    (!status || r.status === status) &&
    (!search || r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.desc?.toLowerCase().includes(search.toLowerCase()))
  )

  const clearAll = () => { setCat(''); setUrg(''); setStatus(''); setSearch('') }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <HeroBanner
        label="EXPLORE / FEED"
        title="Browse help requests with filterable community context."
        subtitle="Filter by category, urgency, and status to surface the best matches."
      />

      <div className="grid gap-6" style={{ gridTemplateColumns: '260px 1fr' }}>
        <div className="card p-6 self-start">
          <div className="section-label">FILTERS</div>
          <h3 className="font-syne text-xl font-bold mb-5">Refine the feed</h3>

          <div className="mb-4">
            <label className="text-sm font-medium block mb-1.5">Search</label>
            <input className="input-field" placeholder="Search requests..." value={search}
              onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium block mb-1.5">Category</label>
            <select className="select-field" value={cat} onChange={e => setCat(e.target.value)}>
              <option value="">All categories</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium block mb-1.5">Urgency</label>
            <select className="select-field" value={urg} onChange={e => setUrg(e.target.value)}>
              <option value="">All urgency levels</option>
              {URGENCIES.map(u => <option key={u}>{u}</option>)}
            </select>
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium block mb-1.5">Status</label>
            <select className="select-field" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="">All statuses</option>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          {(cat || urg || status || search) && (
            <button className="btn-ghost w-full text-sm" onClick={clearAll}>Clear filters</button>
          )}

          <div className="mt-4 p-3 bg-gray-50 rounded-xl">
            <div className="text-xs text-gray-400 font-medium">
              Showing {filtered.length} of {posts.length} requests
            </div>
          </div>
        </div>

        <div>
          {filtered.length > 0
            ? filtered.map(r => <RequestCard key={r.id} req={r} />)
            : (
              <div className="card p-10 text-center text-gray-400">
                <div className="text-4xl mb-3">🔍</div>
                <div className="font-semibold">No requests match your filters.</div>
                <div className="text-sm mt-1">Try adjusting the filters or clear them all.</div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
