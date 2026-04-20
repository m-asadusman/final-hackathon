import { useState } from 'react'
import { useApp } from '../context/AppContext'
import HeroBanner from '../components/HeroBanner'
import Avatar from '../components/Avatar'
import { sendMessage } from '../firebase/firestore'

export default function Messages() {
  const { user, profile, messages, users } = useApp()
  const [to, setTo]       = useState('')
  const [text, setText]   = useState('')
  const [sending, setSending] = useState(false)
  const [selected, setSelected] = useState(null)
  const [view, setView]   = useState('threads') // 'threads' | 'chat' | 'compose'

  const threads = {}
  messages.forEach(m => {
    const otherId   = m.fromUid === user?.uid ? m.toUid   : m.fromUid
    const otherName = m.fromUid === user?.uid ? m.toName  : m.fromName
    if (!threads[otherId]) threads[otherId] = { id:otherId, name:otherName, msgs:[] }
    threads[otherId].msgs.push(m)
  })
  const threadList   = Object.values(threads)
  const activeThread = selected ? threads[selected] : null
  const otherUsers   = users.filter(u => u.id !== user?.uid)

  const handleSend = async () => {
    if (!text.trim() || !to) return
    const recipient = users.find(u => u.id === to)
    if (!recipient) return
    setSending(true)
    try {
      await sendMessage(user.uid, profile?.name||user.email, to, recipient.name, text.trim())
      setText(''); setSelected(to); setView('chat')
    } catch(e) { console.error(e) }
    finally { setSending(false) }
  }

  return (
    <div className="page">
      <HeroBanner
        label="MESSAGING"
        title="Keep support moving through direct communication."
        subtitle="Chat instantly with users and resolve issues faster."
      />

      
      <div className="flex lg:hidden gap-1 mb-4 p-1 bg-gray-100 rounded-xl">
        {[['threads','Conversations'],['chat','Chat'],['compose','New Message']].map(([v,l]) => (
          <button key={v} onClick={() => setView(v)}
            className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
            style={view===v ? { background:'#1c2b2a', color:'#fff' } : { color:'#6b7280' }}>
            {l}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        <div className={`card p-4 sm:p-5 ${view!=='threads' ? 'hidden lg:block' : ''}`}>
          <div className="section-label mb-3">CONVERSATIONS</div>
          {threadList.length===0
            ? <p className="text-gray-400 text-sm text-center py-8">No conversations yet.</p>
            : threadList.map(t => {
              const u = users.find(u => u.id===t.id)
              return (
                <div key={t.id} onClick={() => { setSelected(t.id); setView('chat') }}
                  className={`p-3 rounded-xl mb-2 cursor-pointer transition-all ${selected===t.id ? 'bg-teal-light' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-2.5">
                    <Avatar user={{ initials:t.name?.split(' ').map(w=>w[0]).join('').slice(0,2)||'?', color:u?.color||'#0d9488' }} size={32} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{t.name}</p>
                      <p className="text-gray-400 text-xs truncate">{t.msgs[t.msgs.length-1]?.text||''}</p>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>

        
        <div className={`card p-4 sm:p-5 flex flex-col ${view!=='chat' ? 'hidden lg:flex' : ''}`} style={{ minHeight:340 }}>
          <div className="section-label mb-3">CONVERSATION</div>
          {!activeThread ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm text-center">
              Select a conversation to start chatting
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto flex flex-col gap-2">
              {activeThread.msgs.map(m => {
                const isMine = m.fromUid===user?.uid
                return (
                  <div key={m.id} className={`flex ${isMine?'justify-end':'justify-start'}`}>
                    <div className={`max-w-[82%] p-3 rounded-2xl text-sm leading-relaxed ${
                      isMine ? 'bg-teal text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}>
                      <p className="font-semibold text-xs mb-1 opacity-60">{isMine?'You':m.fromName}</p>
                      {m.text}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        
        <div className={`card p-4 sm:p-6 ${view!=='compose' ? 'hidden lg:block' : ''}`}>
          <div className="section-label">NEW MESSAGE</div>
          <h3 className="h4 text-gray-900 mb-4">Send a message</h3>
          <div className="mb-3">
            <label className="text-sm font-medium block mb-1.5">To</label>
            <select className="select-field" value={to} onChange={e => setTo(e.target.value)}>
              <option value="">Select a member...</option>
              {otherUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium block mb-1.5">Message</label>
            <textarea className="input-field resize-none" rows={5}
              placeholder="Share support details, ask for files, or suggest next steps."
              value={text} onChange={e => setText(e.target.value)}
              onKeyDown={e => { if(e.key==='Enter'&&e.ctrlKey) handleSend() }} />
            <p className="text-xs text-gray-400 mt-1">Ctrl+Enter to send</p>
          </div>
          <button className="btn-primary w-full" onClick={handleSend} disabled={sending||!to||!text.trim()}>
            {sending ? 'Sending...' : 'Send message'}
          </button>
        </div>
      </div>
    </div>
  )
}
