export default function HeroBanner({ label, title, subtitle, children }) {
  return (
    <div className="hero-banner mb-8">
      {label && <div className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">{label}</div>}
      <h1 className="font-syne text-4xl font-black leading-tight mb-3">{title}</h1>
      {subtitle && <p className="text-gray-400 text-sm max-w-xl">{subtitle}</p>}
      {children}
    </div>
  )
}
