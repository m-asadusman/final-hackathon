import { createContext, useContext, useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth } from '../firebase/config'
import {
  createUserProfile, getUserProfile,
  subscribeToPosts, subscribeToUsers,
  subscribeToMessages, subscribeToNotifications,
} from '../firebase/firestore'

const AppContext = createContext(null)

const AVATAR_COLORS = [
  '#0d9488', '#374151', '#ef4444', '#f59e0b',
  '#8b5cf6', '#ec4899', '#06b6d4', '#10b981',
]

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [notifications, setNotifications] = useState([])
  const [authLoading, setAuthLoading] = useState(true)

  // Watch auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        const prof = await getUserProfile(firebaseUser.uid)
        setProfile(prof)
      } else {
        setUser(null)
        setProfile(null)
      }
      setAuthLoading(false)
    })
    return unsub
  }, [])

  // Live posts
  useEffect(() => {
    const unsub = subscribeToPosts(setPosts)
    return unsub
  }, [])

  // Live users
  useEffect(() => {
    const unsub = subscribeToUsers(setUsers)
    return unsub
  }, [])

  // Live messages & notifications (auth-gated)
  useEffect(() => {
    if (!user) {
      setMessages([])
      setNotifications([])
      return
    }
    const unsubMsg = subscribeToMessages(user.uid, setMessages)
    const unsubNotif = subscribeToNotifications(user.uid, setNotifications)
    return () => {
      unsubMsg()
      unsubNotif()
    }
  }, [user])

  const signup = async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await createUserProfile(cred.user.uid, {
      name: displayName,
      email,
      initials: displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
      color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    })
    const prof = await getUserProfile(cred.user.uid)
    setProfile(prof)
    return cred.user
  }

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    const prof = await getUserProfile(cred.user.uid)
    setProfile(prof)
    return cred.user
  }

  const logout = () => signOut(auth)

  const refreshProfile = async () => {
    if (!user) return
    const prof = await getUserProfile(user.uid)
    setProfile(prof)
  }

  return (
    <AppContext.Provider value={{
      user, profile, posts, users, messages, notifications,
      authLoading, signup, login, logout, refreshProfile,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
