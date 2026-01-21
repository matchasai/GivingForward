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
    <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className="glass-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-pink-400" />
            <span className="text-2xl font-bold gradient-text">GivingForward</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/" className="glass-button flex items-center space-x-2">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link to="/campaigns" className="glass-button flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span>Campaigns</span>
            </Link>
            {user ? (
              <>
                {user.role === 'USER' && <NotificationBell />}
                <Link to="/dashboard" className="glass-button flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                {user.role === 'ADMIN' && (
                  <div className="flex items-center gap-2">
                    <NotificationBell />
                    <Link to="/admin" className="glass-button flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4" />
                      <span>Admin</span>
                    </Link>
                    <Link to="/admin/users" className="glass-button flex items-center space-x-2">
                      <span>Users</span>
                    </Link>
                    <Link to="/admin/campaigns" className="glass-button flex items-center space-x-2">
                      <span>Campaigns</span>
                    </Link>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="glass-button flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="glass-button">
                  Login
                </Link>
                <Link to="/register" className="glass-button bg-purple-500/20 hover:bg-purple-500/30">
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