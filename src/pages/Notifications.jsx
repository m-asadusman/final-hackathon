import { useApp } from '../context/AppContext'
import HeroBanner from '../components/HeroBanner'
import { markNotificationRead, markAllNotificationsRead } from '../firebase/firestore'
import { Bell } from 'lucide-react'

const TYPE_COLORS = {
  Status:     'bg-green-100 text-green-700',
  Match:      'bg-teal-light text-teal-dark',
  Request:    'bg-blue-50 text-blue-600',
  Reputation: 'bg-yellow-50 text-yellow-700',
  Insight:    'bg-purple-50 text-purple-600',
}

export default function Notifications() {
  const { user, notifications } = useApp()
  const unread = notifications.filter(n => !n.read).length

  return (
    <div className="page">
      <HeroBanner
        label="NOTIFICATIONS"
        title="Stay updated on requests, helpers, and trust signals."
        subtitle={`${unread} unread notification${unread!==1?'s':''}`}
      />

      <div className="card">
        <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col xs:flex-row xs:justify-between xs:items-center gap-3">
          <div>
            <div className="section-label">LIVE UPDATES</div>
            <h3 className="h3 text-gray-900">Notification feed</h3>
          </div>
          {unread>0 && (
            <button className="btn-ghost text-sm self-start xs:self-auto"
              onClick={() => user && markAllNotificationsRead(user.uid)}>
              Mark all read
            </button>
          )}
        </div>

        {notifications.length===0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3"><Bell className="w-10 h-10 mx-auto text-gray-400" /></div>
            <p className="font-semibold">No notifications yet.</p>
            <p className="text-sm mt-1">Activity from requests, matches, and trust updates will appear here.</p>
          </div>
        )}

        {notifications.map(n => (
          <div key={n.id}
            className={`notif-item ${!n.read ? 'bg-teal-50/40' : ''}`}
            onClick={() => !n.read && markNotificationRead(n.id)}>
            <div className="flex-1 mr-3 sm:mr-4 min-w-0">
              <p className="font-medium text-sm mb-1 leading-snug">{n.text}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[n.type]||'bg-gray-100 text-gray-500'}`}>
                  {n.type}
                </span>
                <span className="text-gray-400 text-xs">{n.time}</span>
              </div>
            </div>
            <span className={`flex-shrink-0 ${n.read?'badge-gray':'badge-pill'}`}>
              {n.read?'Read':'Unread'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
