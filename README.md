# Helplytics — Firebase Setup Guide

## 1. Create a Firebase Project

1. Go to https://console.firebase.google.com
2. Click **Add project** → name it `helplytics-app`
3. Disable Google Analytics (optional) → **Create project**

## 2. Enable Authentication

1. In Firebase Console → **Authentication** → **Get started**
2. **Sign-in method** → Enable **Email/Password**

## 3. Enable Firestore

1. **Firestore Database** → **Create database**
2. Start in **Test mode** (you'll add rules later)
3. Choose a region (e.g. `asia-south1` for Pakistan)

## 4. Get Your Config Keys

1. **Project Settings** (gear icon) → **Your apps** → **Add app** → Web (`</>`)
2. Register app → copy the `firebaseConfig` object

## 5. Paste Config into the App

Open `src/firebase/config.js` and replace the dummy values:

```js
const firebaseConfig = {
  apiKey: "YOUR_REAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
}
```

## 6. Deploy Firestore Rules

Install Firebase CLI and deploy:

```bash
npm install -g firebase-tools
firebase login
firebase init firestore   # select your project
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

Or paste `firestore.rules` directly in the Firebase Console under
**Firestore → Rules**.

## 7. Run the App

```bash
npm install
npm run dev
```

---

## Firestore Collections

| Collection      | Description                          |
|-----------------|--------------------------------------|
| `users`         | User profiles, skills, trust score   |
| `posts`         | Help requests                        |
| `messages`      | Direct messages between users        |
| `notifications` | Per-user activity notifications      |

## Notes

- All data is **real-time** via `onSnapshot`
- Auth state is persisted by Firebase SDK automatically
- The app gracefully handles empty collections (no dummy data fallback)
