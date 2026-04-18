import { useState } from 'react'
import { useApp } from '../context/AppContext'
import HeroBanner from '../components/HeroBanner'
import Avatar from '../components/Avatar'
import { sendMessage } from '../firebase/firestore'

export default function Messages() {
  const { user, profile, messages, users } = useApp()
  const [to, setTo] = useState('')
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [selected, setSelected] = useState(null) // selected conversation partner uid

  // Build conversation threads
  const threads = {}
  messages.forEach(m => {
    const otherId = m.fromUid === user?.uid ? m.toUid : m.fromUid
    const otherName = m.fromUid === user?.uid ? m.toName : m.fromName
    if (!threads[otherId]) threads[otherId] = { id: otherId, name: otherName, msgs: [] }
    threads[otherId].msgs.push(m)
  })

  const threadList = Object.values(threads)
  const activeThread = selected ? threads[selected] : null
  const otherUsers = users.filter(u => u.id !== user?.uid)

  const handleSend = async () => {
    if (!text.trim() || !to) return
    const recipient = users.find(u => u.id === to)
    if (!recipient) return
    setSending(true)
    try {
      await sendMessage(
        user.uid,
        profile?.name || user.email,
        to,
        recipient.name,
        text.trim()
      )
      setText('')
      setSelected(to)
    } catch (e) {
      console.error(e)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <HeroBanner
        label="INTERACTION / MESSAGING"
        title="Keep support moving through direct communication."
        subtitle="Real-time messaging powered by Firestore. Messages appear instantly."
      />

      <div className="grid grid-cols-3 gap-6">
        {/* Thread list */}
        <div className="card p-4">
          <div className="section-label mb-3">CONVERSATIONS</div>
          {threadList.length === 0 && (
            <div className="text-gray-400 text-sm text-center py-8">No conversations yet.</div>
          )}
          {threadList.map(t => (
            <div key={t.id}
              onClick={() => setSelected(t.id)}
              className={`p-3 rounded-xl mb-2 cursor-pointer transition-all ${selected === t.id ? 'bg-teal-light' : 'hover:bg-gray-50'}`}>
              <div className="flex items-center gap-2">
                <Avatar user={{
                  initials: t.name?.split(' ').map(w => w[0]).join('').slice(0, 2) || '?',
                  color: users.find(u => u.id === t.id)?.color || '#0d9488',
                }} size={32} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{t.name}</div>
                  <div className="text-gray-400 text-xs truncate">
                    {t.msgs[t.msgs.length - 1]?.text || ''}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Active thread */}
        <div className="card p-6 flex flex-col" style={{ minHeight: 480 }}>
          <div className="section-label">CONVERSATION STREAM</div>
          {!activeThread ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Select a conversation or send a new message →
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-3 mt-3">
              {activeThread.msgs.map(m => {
                const isMine = m.fromUid === user?.uid
                return (
                  <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs p-3 rounded-2xl text-sm ${isMine
                      ? 'bg-teal text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                      <div className="font-semibold text-xs mb-1 opacity-70">
                        {isMine ? 'You' : m.fromName}
                      </div>
                      {m.text}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Compose */}
        <div className="card p-6">
          <div className="section-label">SEND MESSAGE</div>
          <h2 className="font-syne text-xl font-black mb-5">New message</h2>

          <div className="mb-4">
            <label className="text-sm font-medium block mb-1.5">To</label>
            <select className="select-field" value={to} onChange={e => setTo(e.target.value)}>
              <option value="">Select a member...</option>
              {otherUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>

          <div className="mb-5">
            <label className="text-sm font-medium block mb-1.5">Message</label>
            <textarea className="input-field resize-none" rows={6}
              placeholder="Share support details, ask for files, or suggest next steps."
              value={text} onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleSend() }} />
            <div className="text-xs text-gray-400 mt-1">Ctrl+Enter to send</div>
          </div>

          <button className="btn-primary w-full" onClick={handleSend}
            disabled={sending || !to || !text.trim()}>
            {sending ? 'Sending...' : 'Send message'}
          </button>
        </div>
      </div>
    </div>
  )
}
