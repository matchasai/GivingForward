import axios from 'axios'
import { motion } from 'framer-motion'
import { Activity, IndianRupee, Target, TrendingUp, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { formatINR } from '../utils/currency'

const AdminDashboard = () => {
  const [stats, setStats] = useState({})
  const [users, setUsers] = useState([])
  const [activity, setActivity] = useState({})
  const [loading, setLoading] = useState(true)

  const formatCurrency = (val) => formatINR(val)

  useEffect(() => {
    fetchAdminData()
    // Set up polling for real-time updates
    const interval = setInterval(fetchAdminData, 30000) // Poll every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchAdminData = async () => {
    try {
      const [statsResponse, usersResponse, activityResponse] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/users'),
        axios.get('/api/admin/activity')
      ])
      
      setStats(statsResponse.data)
      setUsers(usersResponse.data?.content || [])
      setActivity(activityResponse.data)
    } catch (error) {
      console.error('Error fetching admin data:', error)
      toast.error('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-card p-6 text-center"
          >
            <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-white mb-2">{stats.totalUsers || 0}</h3>
            <p className="text-gray-300">Total Users</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-card p-6 text-center"
          >
            <Target className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-white mb-2">{stats.activeCampaigns || 0}</h3>
            <p className="text-gray-300">Active Campaigns</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-card p-6 text-center"
          >
            <IndianRupee className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-white mb-2">
              {formatCurrency(stats.totalRaised)}
            </h3>
            <p className="text-gray-300">Total Raised</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-card p-6 text-center"
          >
            <TrendingUp className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-white mb-2">{stats.totalDonationsCount || 0}</h3>
            <p className="text-gray-300">Total Donations</p>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Activity className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
            </div>
            
            <div className="space-y-4">
              {activity.recentDonations?.slice(0, 5).map((donation, index) => (
                <motion.div
                  key={donation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <IndianRupee className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {donation.userName ? (
                          <>
                            <span className="text-purple-300">{donation.userName}</span> donated to{' '}
                            <span className="text-blue-300">{donation.campaignTitle || 'Campaign'}</span>
                          </>
                        ) : (
                          <>
                            Donation to <span className="text-blue-300">{donation.campaignTitle || 'Campaign'}</span>
                          </>
                        )}
                      </p>
                      {donation.userEmail && (
                        <p className="text-xs text-gray-400">{donation.userEmail}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-semibold">{formatCurrency(donation.amount)}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(donation.donatedAt).toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {activity.recentCampaigns?.slice(0, 3).map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Target className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">New Campaign</p>
                      <p className="text-sm text-gray-400">{campaign.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-400 font-semibold">{formatCurrency(campaign.targetAmount)}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* User Management */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="glass-card p-6"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Users className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">User Management</h2>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {users.slice(0, 10).map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user.role === 'ADMIN' 
                        ? 'bg-purple-500/20 text-purple-400' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {user.role}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {users.length > 10 && (
              <p className="text-center text-gray-400 text-sm mt-4">
                Showing 10 of {users.length} users
              </p>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminDashboard 