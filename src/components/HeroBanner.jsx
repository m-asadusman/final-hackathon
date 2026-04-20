export default function HeroBanner({ label, title, subtitle, children }) {
  return (
    <div className="hero-banner">
      {label && (
        <p className="text-[10px] sm:text-xs font-bold tracking-[0.16em] text-teal/70 uppercase mb-3"
          style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
          {label}
        </p>
      )}
      <h1 className="h1 text-white mb-3">{title}</h1>
      {subtitle && <p className="text-gray-400 text-sm sm:text-base max-w-2xl leading-relaxed">{subtitle}</p>}
      {children}
    </div>
  )
}
