import { useState } from 'react'
import { useApp } from '../context/AppContext'
import HeroBanner from '../components/HeroBanner'
import RequestCard from '../components/RequestCard'

const CATS = ['Web Development','Design','Data Science','Career','Community']
const URGS = ['High','Medium','Low']

export default function Explore() {
  const { posts } = useApp()
  const [cat, setCat]     = useState('')
  const [urg, setUrg]     = useState('')
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [mobileFilters, setMobileFilters] = useState(false)

  const filtered = posts.filter(r =>
    (!cat    || r.category === cat) &&
    (!urg    || r.urgency  === urg) &&
    (!status || r.status   === status) &&
    (!search || r.title?.toLowerCase().includes(search.toLowerCase()) ||
               r.desc?.toLowerCase().includes(search.toLowerCase()))
  )
  const clear = () => { setCat(''); setUrg(''); setStatus(''); setSearch('') }
  const hasFilter = cat || urg || status || search

  const Filters = () => (
    <div className="card p-5 sm:p-6">
      <div className="section-label">FILTERS</div>
      <h3 className="h4 text-gray-900 mb-4">Refine the feed</h3>
      <div className="flex flex-col gap-3">
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Search</label>
          <input className="input-field" placeholder="Search requests..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Category</label>
          <select className="select-field" value={cat} onChange={e => setCat(e.target.value)}>
            <option value="">All categories</option>
            {CATS.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Urgency</label>
          <select className="select-field" value={urg} onChange={e => setUrg(e.target.value)}>
            <option value="">All urgency levels</option>
            {URGS.map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Status</label>
          <select className="select-field" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option>Open</option><option>Solved</option>
          </select>
        </div>
        {hasFilter && <button className="btn-ghost w-full text-sm" onClick={clear}>Clear all filters</button>}
        <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-400 font-medium">
          {filtered.length} of {posts.length} requests
        </div>
      </div>
    </div>
  )

  return (
    <div className="page">
      <HeroBanner
        label="EXPLORE / FEED"
        title="Discover help requests"
        subtitle="Quickly find what matters using filters for category, urgency, and status."
      />

      
      <div className="flex items-center justify-between mb-4 lg:hidden">
        <p className="text-sm text-gray-500 font-medium">{filtered.length} request{filtered.length !== 1 ? 's' : ''}</p>
        <button className="btn-ghost text-sm flex items-center gap-2" onClick={() => setMobileFilters(o => !o)}>
          <span>⚙</span>
          {mobileFilters ? 'Hide' : 'Show'} Filters
          {hasFilter && <span className="w-2 h-2 rounded-full bg-teal inline-block" />}
        </button>
      </div>

      {mobileFilters && <div className="mb-4 lg:hidden"><Filters /></div>}

      <div className="with-sidebar">
        <div className="hidden lg:block self-start sticky top-20"><Filters /></div>
        <div>
          {filtered.length > 0
            ? filtered.map(r => <RequestCard key={r.id} req={r} />)
            : (
              <div className="card p-12 text-center text-gray-400">
                <div className="text-4xl mb-3">🔍</div>
                <p className="font-semibold">No requests match your filters.</p>
                <p className="text-sm mt-1">Try adjusting or clearing your filters.</p>
                {hasFilter && <button className="btn-ghost mt-4 text-sm" onClick={clear}>Clear filters</button>}
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
