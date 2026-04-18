import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Replace these with your real Firebase project values
const firebaseConfig = {
  apiKey: 'AIzaSyCVYzs7gVjrNxHD-AJhWEpU0Y26y3zetIc',
  authDomain: 'hackathon-4fc98.firebaseapp.com',
  projectId: 'hackathon-4fc98',
  storageBucket: 'hackathon-4fc98.firebasestorage.app',
  messagingSenderId: '1082586343314',
  appId: '1:1082586343314:web:b76a7d1f2e4240ee21434b',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app  
