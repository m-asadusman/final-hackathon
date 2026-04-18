export default function TrustBar({ value }) {
  return (
    <div className="trust-bar">
      <div className="trust-fill" style={{ width: `${value}%` }} />
    </div>
  )
}
