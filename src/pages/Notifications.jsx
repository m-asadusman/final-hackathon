import { useApp } from '../context/AppContext'
import HeroBanner from '../components/HeroBanner'
import { markNotificationRead, markAllNotificationsRead } from '../firebase/firestore'

const TYPE_COLORS = {
  Status: 'bg-green-100 text-green-700',
  Match: 'bg-teal-light text-teal-dark',
  Request: 'bg-blue-50 text-blue-600',
  Reputation: 'bg-yellow-50 text-yellow-600',
  Insight: 'bg-purple-50 text-purple-600',
}

export default function Notifications() {
  const { user, notifications } = useApp()
  const unread = notifications.filter(n => !n.read).length

  const handleMarkRead = async (id) => {
    await markNotificationRead(id)
  }

  const handleMarkAllRead = async () => {
    if (!user) return
    await markAllNotificationsRead(user.uid)
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <HeroBanner
        label="NOTIFICATIONS"
        title="Stay updated on requests, helpers, and trust signals."
        subtitle={`${unread} unread notification${unread !== 1 ? 's' : ''} — live from Firestore.`}
      />

      <div className="card">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <div className="section-label">LIVE UPDATES</div>
            <h3 className="font-syne text-xl font-bold">Notification feed</h3>
          </div>
          {unread > 0 && (
            <button className="btn-ghost text-sm" onClick={handleMarkAllRead}>Mark all read</button>
          )}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">🔔</div>
            <div className="font-semibold">No notifications yet.</div>
            <div className="text-sm mt-1">Activity from requests, matches, and trust updates will appear here.</div>
          </div>
        )}

        {notifications.map(n => (
          <div
            key={n.id}
            className={`notif-item ${!n.read ? 'bg-teal-50/30' : ''}`}
            onClick={() => !n.read && handleMarkRead(n.id)}
          >
            <div className="flex-1 mr-4">
              <div className="font-medium text-sm mb-1">{n.text}</div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[n.type] || 'bg-gray-100 text-gray-500'}`}>
                  {n.type}
                </span>
                <span className="text-gray-400 text-xs">{n.time}</span>
              </div>
            </div>
            <span className={n.read ? 'badge-gray' : 'badge-pill'}>{n.read ? 'Read' : 'Unread'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
