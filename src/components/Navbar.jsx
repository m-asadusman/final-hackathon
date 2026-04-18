import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Avatar from './Avatar'

const PUBLIC_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Explore', to: '/explore' },
  { label: 'Leaderboard', to: '/leaderboard' },
]

const AUTH_LINKS = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Explore', to: '/explore' },
  { label: 'Leaderboard', to: '/leaderboard' },
  { label: 'Notifications', to: '/notifications' },
  { label: 'Messages', to: '/messages' },
  { label: 'AI Center', to: '/insights' },
]

export default function Navbar() {
  const { user, profile, logout } = useApp()
  const { pathname } = useLocation()
  const links = user ? AUTH_LINKS : PUBLIC_LINKS

  const avatarUser = profile
    ? { initials: profile.initials || '?', color: profile.color || '#0d9488' }
    : { initials: '?', color: '#0d9488' }

  return (
    <nav className="bg-white border-b border-gray-100 px-8 h-14 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 no-underline">
        <div className="w-9 h-9 bg-teal rounded-lg flex items-center justify-center text-white font-black text-base">H</div>
        <span className="font-syne font-black text-base text-gray-900">HelpHub AI</span>
      </Link>

      <div className="flex items-center gap-1">
        {links.map(({ label, to }) => (
          <Link key={to} to={to} className={pathname === to ? 'nav-link-active' : 'nav-link'}>
            {label}
          </Link>
        ))}

        {user ? (
          <div className="flex items-center gap-2 ml-2">
            <Link to="/profile" className="flex items-center gap-2 nav-link">
              <Avatar user={avatarUser} size={28} />
              {profile?.name?.split(' ')[0] || 'Profile'}
            </Link>
            <button className="btn-ghost text-xs py-1.5 px-3" onClick={logout}>Logout</button>
          </div>
        ) : (
          <Link to="/auth">
            <button className="btn-primary py-2 px-5 ml-2 text-xs">Join the platform</button>
          </Link>
        )}
      </div>
    </nav>
  )
}
