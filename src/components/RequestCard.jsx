import { Link } from 'react-router-dom'
import { CategoryTag, UrgencyTag, StatusTag } from './Tags'

export default function RequestCard({ req }) {
  const tags = Array.isArray(req.tags) ? req.tags : []

  return (
    <div className="request-card">
      <div className="flex gap-2 flex-wrap mb-3">
        <CategoryTag category={req.category} />
        <UrgencyTag urgency={req.urgency} />
        <StatusTag status={req.status} />
      </div>
      <h3 className="font-syne font-bold text-base mb-1.5">{req.title}</h3>
      <p className="text-muted text-sm mb-3 leading-relaxed line-clamp-2">{req.desc}</p>
      {tags.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-3">
          {tags.map(t => <span key={t} className="tag tag-gray">{t}</span>)}
        </div>
      )}
      <div className="flex justify-between items-center">
        <div>
          <div className="font-semibold text-sm">{req.userName || 'Anonymous'}</div>
          <div className="text-muted text-xs">
            {req.location || 'Remote'} • {req.helpers || 0} helper{req.helpers !== 1 ? 's' : ''} interested
          </div>
        </div>
        <Link to={`/request/${req.id}`}>
          <button className="btn-ghost text-xs py-1.5 px-4">Open details</button>
        </Link>
      </div>
    </div>
  )
}
