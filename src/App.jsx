import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Explore from './pages/Explore'
import CreateRequest from './pages/CreateRequest'
import RequestDetail from './pages/RequestDetail'
import Messages from './pages/Messages'
import Leaderboard from './pages/Leaderboard'
import Notifications from './pages/Notifications'
import Profile from './pages/Profile'
import Insights from './pages/Insights'
import { Loader } from 'lucide-react'

function ProtectedRoute({ children }) {
  const { user, authLoading } = useApp()
  if (authLoading) return (
    <div className="flex items-center justify-center min-h-screen">
    <div className="text-center text-gray-400">
      <Loader className="w-10 h-10 mx-auto mb-3 animate-spin" />
      <div className="font-semibold text-sm">Authenticating...</div>
    </div>
  </div>
  )
  return user ? children : <Navigate to="/auth" replace />
}

function AppRoutes() {
  const { authLoading } = useApp()
  if (authLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center text-gray-400">
        <div className="w-10 h-10 bg-teal rounded-lg flex items-center justify-center text-white font-black text-lg mx-auto mb-4">H</div>
        <div className="font-semibold text-sm animate-pulse">Starting HelpHub AI...</div>
      </div>
    </div>
  )
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/request/:id" element={<RequestDetail />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><CreateRequest /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  )
}
