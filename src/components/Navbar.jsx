import { AnimatePresence, motion } from 'framer-motion'
import { BarChart3, Heart, Home, LogOut, Menu, User, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import NotificationBell from './NotificationBell'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileMenuOpen(false)
  }

  const closeMenu = () => setMobileMenuOpen(false)

  return (
    <motion.nav 
      initial={{ y: -100 }} 
      animate={{ y: 0 }} 
      className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-[#2F855A]" fill="#2F855A" />
            <span className="text-2xl font-bold text-[#1F2937]">GivingForward</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-[#2F855A] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col space-y-2 py-4 border-t border-gray-200">
                <Link 
                  to="/" 
                  onClick={closeMenu}
                  className="px-4 py-2 text-gray-700 hover:text-[#2F855A] hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>
                <Link 
                  to="/campaigns" 
                  onClick={closeMenu}
                  className="px-4 py-2 text-gray-700 hover:text-[#2F855A] hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Heart className="w-4 h-4" />
                  <span>Campaigns</span>
                </Link>
                {user ? (
                  <>
                    <Link 
                      to="/dashboard" 
                      onClick={closeMenu}
                      className="px-4 py-2 text-gray-700 hover:text-[#2F855A] hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <User className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    {user.role === 'ADMIN' && (
                      <>
                        <Link 
                          to="/admin" 
                          onClick={closeMenu}
                          className="px-4 py-2 text-gray-700 hover:text-[#2F855A] hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-2"
                        >
                          <BarChart3 className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                        <Link 
                          to="/admin/users" 
                          onClick={closeMenu}
                          className="px-4 py-2 text-gray-700 hover:text-[#2F855A] hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          Admin Users
                        </Link>
                        <Link 
                          to="/admin/campaigns" 
                          onClick={closeMenu}
                          className="px-4 py-2 text-gray-700 hover:text-[#2F855A] hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          Admin Campaigns
                        </Link>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-2 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                    <Link 
                      to="/login" 
                      onClick={closeMenu}
                      className="btn-secondary text-center"
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      onClick={closeMenu}
                      className="donate-btn text-center"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navbar