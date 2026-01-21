import { motion } from 'framer-motion'
import { BarChart3, Heart, Home, LogOut, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import NotificationBell from './NotificationBell'


const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  return (
    <motion.nav 
      initial={{ y: -100 }} 
      animate={{ y: 0 }} 
      className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-[#2F855A]" fill="#2F855A" />
            <span className="text-2xl font-bold text-[#1F2937]">GivingForward</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Link to="/" className="px-4 py-2 text-gray-700 hover:text-[#2F855A] transition-colors flex items-center space-x-2">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link to="/campaigns" className="px-4 py-2 text-gray-700 hover:text-[#2F855A] transition-colors flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span>Campaigns</span>
            </Link>
            {user ? (
              <>
                {user.role === 'USER' && <NotificationBell />}
                <Link to="/dashboard" className="px-4 py-2 text-gray-700 hover:text-[#2F855A] transition-colors flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                {user.role === 'ADMIN' && (
                  <div className="flex items-center gap-2">
                    <NotificationBell />
                    <Link to="/admin" className="px-4 py-2 text-gray-700 hover:text-[#2F855A] transition-colors flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4" />
                      <span>Admin</span>
                    </Link>
                    <Link to="/admin/users" className="px-4 py-2 text-gray-700 hover:text-[#2F855A] transition-colors flex items-center space-x-2">
                      <span>Users</span>
                    </Link>
                    <Link to="/admin/campaigns" className="px-4 py-2 text-gray-700 hover:text-[#2F855A] transition-colors flex items-center space-x-2">
                      <span>Campaigns</span>
                    </Link>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="donate-btn">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
  </motion.nav>
  );
}

export default Navbar