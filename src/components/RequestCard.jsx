import { Link } from 'react-router-dom'
import { CategoryTag, UrgencyTag, StatusTag } from './Tags'

export default function RequestCard({ req }) {
  const tags = Array.isArray(req.tags) ? req.tags : []
  return (
    <div className="request-card">
      <div className="flex gap-1.5 flex-wrap mb-3">
        <CategoryTag category={req.category} />
        <UrgencyTag urgency={req.urgency} />
        <StatusTag status={req.status} />
      </div>
      <h3 className="h4 mb-1.5 line-clamp-2">{req.title}</h3>
      <p className="text-gray-400 text-xs sm:text-sm mb-3 leading-relaxed line-clamp-2">{req.desc}</p>
      {tags.length > 0 && (
        <div className="flex gap-1.5 flex-wrap mb-3">
          {tags.slice(0, 4).map(t => <span key={t} className="tag tag-gray">{t}</span>)}
        </div>
      )}
      <div className="flex justify-between items-center gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{req.userName || 'Anonymous'}</p>
          <p className="text-gray-400 text-xs">{req.location || 'Remote'} · {req.helpers || 0} helper{req.helpers !== 1 ? 's' : ''}</p>
        </div>
        <Link to={`/request/${req.id}`} className="flex-shrink-0">
          <button className="btn-ghost text-xs py-1.5 px-3">Details</button>
        </Link>
      </div>
    </div>
  )
}
