# Helplytics

> A community-powered support network where students, mentors, creators, and builders can find help faster and become the help that matters.

---

## 🚀 Overview

Helplytics is a real-time community platform. It connects people who need help with those who can provide it — structured around smart request posting, trust-based reputation, and real-time communication.

Users post help requests that are automatically categorized and tagged using AI helpers. Others can offer assistance, message each other, and build a visible track record of meaningful contributions through a badge and leaderboard system.

---

## ✨ Features

- **Smart Request Assistance** — Auto-detects category, urgency, and suggests relevant tags as you type your request
- **Community Trust System** — Earn badges, climb the leaderboard, and build a contribution history visible to others
- **Real-Time Everything** — Posts, messages, and notifications update live via Firestore subscriptions
- **Explore Feed** — Browse open help requests from the community without needing an account
- **Direct Messaging** — Chat directly with helpers or requesters
- **User Profiles** — Showcase skills, interests, badges, and contribution stats
- **Insights Dashboard** — View personal activity, solved requests, and community impact
- **Notifications** — Real-time alerts when someone offers help or messages you
- **Onboarding Flow** — Guided setup for new users to pick a role and get started quickly

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Backend / DB | Firebase Firestore |
| Auth | Firebase Authentication |
| Icons | Lucide React |

---

## 📁 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Avatar.jsx
│   ├── HeroBanner.jsx
│   ├── Navbar.jsx
│   ├── RequestCard.jsx
│   ├── Tags.jsx
│   └── TrustBar.jsx
├── context/
│   └── AppContext.jsx   # Global state: auth, posts, users, messages, notifications
├── firebase/
│   ├── config.js        # Firebase app initialization
│   └── firestore.js     # All Firestore read/write helpers
├── pages/
│   ├── Landing.jsx
│   ├── Auth.jsx
│   ├── Onboarding.jsx
│   ├── Dashboard.jsx
│   ├── Explore.jsx
│   ├── CreateRequest.jsx
│   ├── RequestDetail.jsx
│   ├── Messages.jsx
│   ├── Leaderboard.jsx
│   ├── Notifications.jsx
│   ├── Profile.jsx
│   └── Insights.jsx
├── utils/
│   └── aiHelpers.js     # Category detection, tag suggestion, urgency detection
├── App.jsx
├── main.jsx
└── index.css
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- A Firebase project with Firestore and Authentication enabled

### 1. Clone the repository

```bash
git clone https://github.com/your-username/helplytics.git
cd helplytics
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

Create a `.env` file in the root directory and add your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> **Note:** Update `src/firebase/config.js` to read from these environment variables if not already set up.

### 4. Set up Firestore rules and indexes

Deploy the included Firestore configuration:

```bash
firebase deploy --only firestore
```

Or manually copy `firestore.rules` and `firestore.indexes.json` into your Firebase Console.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Available Scripts

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build locally
```

---

## 🗂️ Firestore Data Model

| Collection | Purpose |
|---|---|
| `users` | User profiles — name, trust score, badges, skills, contributions |
| `posts` | Help requests — category, urgency, tags, status, helper IDs |
| `messages` | Direct messages between users |
| `notifications` | Per-user notification feed |

---

## 🤖 AI Helpers (Client-Side)

Located in `src/utils/aiHelpers.js`, these lightweight helpers power the smart request form:

- **`detectCategory(text)`** — Classifies requests into Web Development, Design, Data Science, Career, or Community
- **`suggestTags(text)`** — Recommends relevant tags based on keywords
- **`detectUrgency(text)`** — Detects High / Medium / Low urgency from natural language cues
- **`generateAISummary(req)`** — Produces a short summary to help potential helpers decide if they're a good fit

---

## 🔒 Auth & Route Protection

Authentication is handled via Firebase Auth (email/password). Protected routes (`/dashboard`, `/create`, `/messages`, `/notifications`, `/profile`, `/insights`) redirect unauthenticated users to `/auth`.

---

## 🏆 Built At

This project was built as a hackathon submission. Designed and developed under time constraints with a focus on real-time UX and community-first features.

---

## 📄 License

MIT
