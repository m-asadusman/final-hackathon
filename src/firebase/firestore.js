import {
  collection, doc, addDoc, updateDoc, getDocs, getDoc,
  onSnapshot, query, orderBy, where, serverTimestamp, setDoc,
} from 'firebase/firestore'
import { db } from './config'

// ─── USERS ───────────────────────────────────────────────────────────────────

export async function createUserProfile(uid, data) {
  await setDoc(doc(db, 'users', uid), {
    ...data,
    trust: 100,
    contributions: 0,
    badges: [],
    skills: [],
    interests: '',
    location: '',
    role: 'Both',
    createdAt: serverTimestamp(),
  })
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function updateUserProfile(uid, data) {
  await updateDoc(doc(db, 'users', uid), data)
}

export function subscribeToUsers(callback) {
  return onSnapshot(
    query(collection(db, 'users'), orderBy('trust', 'desc')),
    snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  )
}

// ─── POSTS / REQUESTS ────────────────────────────────────────────────────────

export async function createPost(data) {
  return addDoc(collection(db, 'posts'), {
    ...data,
    status: 'Open',
    helpers: 0,
    helperIds: [],
    createdAt: serverTimestamp(),
  })
}

export function subscribeToPosts(callback) {
  return onSnapshot(
    query(collection(db, 'posts'), orderBy('createdAt', 'desc')),
    snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  )
}

export async function getPost(id) {
  const snap = await getDoc(doc(db, 'posts', id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function markPostSolved(id) {
  await updateDoc(doc(db, 'posts', id), { status: 'Solved' })
}

export async function offerHelp(postId, userId) {
  const ref = doc(db, 'posts', postId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return
  const data = snap.data()
  const helperIds = data.helperIds || []
  if (helperIds.includes(userId)) return
  await updateDoc(ref, {
    helpers: (data.helpers || 0) + 1,
    helperIds: [...helperIds, userId],
  })
}

// ─── MESSAGES ────────────────────────────────────────────────────────────────

export async function sendMessage(fromUid, fromName, toUid, toName, text) {
  await addDoc(collection(db, 'messages'), {
    fromUid, fromName, toUid, toName, text,
    createdAt: serverTimestamp(),
  })
}

export function subscribeToMessages(uid, callback) {
  // Real-time listener for messages involving this user
  return onSnapshot(
    query(collection(db, 'messages'), orderBy('createdAt', 'asc')),
    snap => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      const mine = all.filter(m => m.fromUid === uid || m.toUid === uid)
      callback(mine)
    }
  )
}

// ─── NOTIFICATIONS ───────────────────────────────────────────────────────────

export async function createNotification(uid, data) {
  await addDoc(collection(db, 'notifications'), {
    uid,
    ...data,
    read: false,
    createdAt: serverTimestamp(),
  })
}

export function subscribeToNotifications(uid, callback) {
  return onSnapshot(
    query(
      collection(db, 'notifications'),
      where('uid', '==', uid),
      orderBy('createdAt', 'desc')
    ),
    snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  )
}

export async function markNotificationRead(id) {
  await updateDoc(doc(db, 'notifications', id), { read: true })
}

export async function markAllNotificationsRead(uid) {
  const snap = await getDocs(
    query(collection(db, 'notifications'), where('uid', '==', uid), where('read', '==', false))
  )
  await Promise.all(snap.docs.map(d => updateDoc(d.ref, { read: true })))
}
