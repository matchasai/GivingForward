import { motion } from 'framer-motion'
import { Navigate, Route, Routes } from 'react-router-dom'
import GlobalError from './components/GlobalError'
import LoadingSpinner from './components/LoadingSpinner'
import Navbar from './components/Navbar'
import { AdminRoute, ProtectedRoute } from './components/RouteGuards'
import { useAuth } from './contexts/AuthContext'
import AdminCampaigns from './pages/AdminCampaigns'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import CampaignDetail from './pages/CampaignDetail'
import Campaigns from './pages/Campaigns'
import Dashboard from './pages/Dashboard'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  const isAdmin = user?.role === 'ADMIN'

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <GlobalError />
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
            <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/" />} />
            <Route path="/reset-password" element={!user ? <ResetPassword /> : <Navigate to="/" />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/campaigns/:id" element={<CampaignDetail />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/campaigns" element={<AdminRoute><AdminCampaigns /></AdminRoute>} />
          </Routes>
        </main>
      </motion.div>
    </div>
  )
}

export default App 