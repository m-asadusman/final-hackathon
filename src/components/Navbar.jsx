import { useState } from 'react'
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
  const [open, setOpen] = useState(false)
  const links = user ? AUTH_LINKS : PUBLIC_LINKS
  const close = () => setOpen(false)

  const avatarUser = profile
    ? { initials: profile.initials || '?', color: profile.color || '#0d9488' }
    : { initials: '?', color: '#0d9488' }

  return (
    <>
      
      <nav className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2" onClick={close}>
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-teal rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>H</div>
          <span className="font-bold text-sm sm:text-base text-gray-900 tracking-tight"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Helplytics</span>
        </Link>

        
        <div className="hidden lg:flex items-center gap-0.5">
          {links.map(({ label, to }) => (
            <Link key={to} to={to} className={pathname === to ? 'nav-link-active' : 'nav-link'}>{label}</Link>
          ))}
          {user ? (
            <div className="flex items-center gap-2 ml-2">
              <Link to="/profile" className="flex items-center gap-2 nav-link" onClick={close}>
                <Avatar user={avatarUser} size={26} />
                <span className="hidden xl:inline">{profile?.name?.split(' ')[0] || 'Profile'}</span>
              </Link>
              <button className="btn-ghost text-xs py-1.5 px-3" onClick={logout}>Logout</button>
            </div>
          ) : (
            <Link to="/auth" className="ml-2">
              <button className="btn-primary py-2 px-4 text-xs">Join the platform</button>
            </Link>
          )}
        </div>

        
        <div className="flex lg:hidden items-center gap-2">
          {user && (
            <Link to="/profile" onClick={close}>
              <Avatar user={avatarUser} size={30} />
            </Link>
          )}
          
          <button
            onClick={() => setOpen(o => !o)}
            className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-200 origin-center ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-200 ${open ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-200 origin-center ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" style={{ top: '3.5rem' }}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={close} />
          <div className="absolute top-0 right-0 w-72 h-full bg-white shadow-2xl flex flex-col p-5 overflow-y-auto">
            <nav className="flex flex-col gap-1 mb-6">
              {links.map(({ label, to }) => (
                <Link key={to} to={to} onClick={close}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    pathname === to ? 'text-white font-semibold' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  style={pathname === to ? { background: '#1c2b2a' } : {}}>
                  {label}
                </Link>
              ))}
            </nav>

            <div className="border-t border-gray-100 pt-5 mt-auto">
              {user ? (
                <>
                  <div className="flex items-center gap-3 mb-4 px-2">
                    <Avatar user={avatarUser} size={36} />
                    <div>
                      <div className="font-semibold text-sm">{profile?.name || 'User'}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                    </div>
                  </div>
                  <Link to="/create" onClick={close}>
                    <button className="btn-primary w-full mb-2 text-sm">+ Create Request</button>
                  </Link>
                  <button className="btn-ghost w-full text-sm" onClick={() => { logout(); close() }}>Logout</button>
                </>
              ) : (
                <Link to="/auth" onClick={close}>
                  <button className="btn-primary w-full">Join the platform</button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
