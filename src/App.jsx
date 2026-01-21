import { motion } from 'framer-motion'
import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './axiosSetup'
import Footer from './components/Footer'
import GlobalError from './components/GlobalError'
import LoadingSpinner from './components/LoadingSpinner'
import Navbar from './components/Navbar'
import { AdminRoute, ProtectedRoute } from './components/RouteGuards'
import { useAuth } from './contexts/AuthContext'

const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const Campaigns = lazy(() => import('./pages/Campaigns'))
const CampaignDetail = lazy(() => import('./pages/CampaignDetail'))
const CampaignAnalytics = lazy(() => import('./pages/CampaignAnalytics'))
const HowItWorks = lazy(() => import('./pages/HowItWorks'))
const SuccessStories = lazy(() => import('./pages/SuccessStories'))
const FAQ = lazy(() => import('./pages/FAQ'))
const AboutUs = lazy(() => import('./pages/AboutUs'))
const Contact = lazy(() => import('./pages/Contact'))
const Terms = lazy(() => import('./pages/Terms'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const AdminUsers = lazy(() => import('./pages/AdminUsers'))
const AdminCampaigns = lazy(() => import('./pages/AdminCampaigns'))

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen calm-bg flex flex-col">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="flex-1 flex flex-col">
        <GlobalError />
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
              <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
              <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/" />} />
              <Route path="/reset-password" element={!user ? <ResetPassword /> : <Navigate to="/" />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/campaigns/:id" element={<CampaignDetail />} />
              <Route path="/campaigns/:id/analytics" element={<AdminRoute><CampaignAnalytics /></AdminRoute>} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/success-stories" element={<SuccessStories />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
              <Route path="/admin/campaigns" element={<AdminRoute><AdminCampaigns /></AdminRoute>} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </motion.div>
    </div>
  )
}

export default App 