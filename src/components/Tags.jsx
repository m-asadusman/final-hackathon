export function UrgencyTag({ urgency }) {
  const cls = urgency === 'High' ? 'tag-red' : urgency === 'Medium' ? 'tag-yellow' : 'tag-gray'
  return <span className={`tag ${cls}`}>{urgency}</span>
}

export function StatusTag({ status }) {
  return <span className={`tag ${status === 'Solved' ? 'tag-green' : 'tag-teal'}`}>{status}</span>
}

export function CategoryTag({ category }) {
  return <span className="tag tag-teal">{category}</span>
}
