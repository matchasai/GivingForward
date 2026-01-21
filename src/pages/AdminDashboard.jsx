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
      toast.error('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen calm-bg">
        <div className="w-14 h-14 border-4 border-gray-200 border-t-[#2F855A] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen calm-bg section-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-8">
          <p className="text-sm font-semibold text-[#2F855A]">Admin overview</p>
          <h1 className="text-4xl font-bold text-[#1F2937]">Dashboard</h1>
          <p className="text-[#6B7280] mt-2">Monitor campaigns, donations, and user activity.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="trust-card p-4 sticky top-24">
              <h3 className="text-[#1F2937] font-semibold mb-3">Admin Menu</h3>
              <ul className="space-y-2 text-sm text-[#6B7280]">
                <li><a className="hover:text-[#2F855A]" href="#overview">Overview</a></li>
                <li><a className="hover:text-[#2F855A]" href="#activity">Recent activity</a></li>
                <li><a className="hover:text-[#2F855A]" href="#users">Users</a></li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          id="overview"
        >
          <div className="trust-card p-6 text-center card-lift">
            <Users className="w-12 h-12 text-[#1D4ED8] mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-[#1F2937] mb-1">{stats.totalUsers || 0}</h3>
            <p className="text-[#6B7280]">Total users</p>
          </div>
          
          <div className="trust-card p-6 text-center card-lift">
            <Target className="w-12 h-12 text-[#2F855A] mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-[#1F2937] mb-1">{stats.activeCampaigns || 0}</h3>
            <p className="text-[#6B7280]">Active campaigns</p>
          </div>
          
          <div className="trust-card p-6 text-center card-lift">
            <IndianRupee className="w-12 h-12 text-[#CA8A04] mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-[#1F2937] mb-1">
              {formatCurrency(stats.totalRaised)}
            </h3>
            <p className="text-[#6B7280]">Total raised</p>
          </div>
          
          <div className="trust-card p-6 text-center card-lift">
            <TrendingUp className="w-12 h-12 text-[#7C3AED] mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-[#1F2937] mb-1">{stats.totalDonationsCount || 0}</h3>
            <p className="text-[#6B7280]">Total donations</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="trust-card p-6"
            id="activity"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Activity className="w-6 h-6 text-[#2F855A]" />
              <div>
                <p className="text-sm font-semibold text-[#2F855A]">Real-time updates</p>
                <h2 className="text-2xl font-bold text-[#1F2937]">Recent activity</h2>
              </div>
            </div>
            
            <div className="space-y-4">
              {activity.recentDonations?.slice(0, 5).map((donation, index) => (
                <motion.div
                  key={donation.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.25 + index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-[#F9FAF9] border border-[#E5E7EB] rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[#EDF7F1] text-[#2F855A] rounded-full flex items-center justify-center">
                      <IndianRupee className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[#1F2937] font-medium">
                        {donation.userName ? (
                          <>
                            <span className="text-[#1F2937] font-semibold">{donation.userName}</span> donated to{' '}
                            <span className="text-[#1D4ED8] font-semibold">{donation.campaignTitle || 'Campaign'}</span>
                          </>
                        ) : (
                          <>
                            Donation to <span className="text-[#1D4ED8] font-semibold">{donation.campaignTitle || 'Campaign'}</span>
                          </>
                        )}
                      </p>
                      {donation.userEmail && (
                        <p className="text-xs text-[#6B7280]">{donation.userEmail}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#2F855A] font-semibold">{formatCurrency(donation.amount)}</p>
                    <p className="text-xs text-[#6B7280]">
                      {new Date(donation.donatedAt).toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {activity.recentCampaigns?.slice(0, 3).map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.3 + index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-[#F9FAF9] border border-[#E5E7EB] rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[#E0E7FF] text-[#1D4ED8] rounded-full flex items-center justify-center">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[#1F2937] font-semibold">New campaign</p>
                      <p className="text-sm text-[#6B7280]">{campaign.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#1D4ED8] font-semibold">{formatCurrency(campaign.targetAmount)}</p>
                    <p className="text-xs text-[#6B7280]">
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* User Management */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="trust-card p-6"
            id="users"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Users className="w-6 h-6 text-[#1D4ED8]" />
              <div>
                <p className="text-sm font-semibold text-[#2F855A]">Users</p>
                <h2 className="text-2xl font-bold text-[#1F2937]">Recent signups</h2>
              </div>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {users.slice(0, 10).map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.25 + index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-[#F9FAF9] border border-[#E5E7EB] rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[#EDF7F1] text-[#2F855A] rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[#1F2937] font-semibold">{user.name}</p>
                      <p className="text-sm text-[#6B7280]">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      user.role === 'ADMIN' 
                        ? 'bg-[#E9D5FF] text-[#7C3AED]' 
                        : 'bg-[#E0E7FF] text-[#1D4ED8]'
                    }`}>
                      {user.role}
                    </span>
                    <p className="text-xs text-[#6B7280] mt-1">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {users.length > 10 && (
              <p className="text-center text-[#6B7280] text-sm mt-4">
                Showing 10 of {users.length} users
              </p>
            )}
          </motion.div>
        </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminDashboard 