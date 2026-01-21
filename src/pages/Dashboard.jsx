import axios from 'axios'
import { motion } from 'framer-motion'
import { Calendar, Heart, IndianRupee, Target, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { formatINR } from '../utils/currency'

const Dashboard = () => {
  const { user } = useAuth()
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalDonated: 0,
    totalDonations: 0,
    averageDonation: 0
  })

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const donationsResponse = await axios.get('/api/donations/my')
      
      setDonations(donationsResponse.data)
      
      // Calculate user stats
      const userDonations = donationsResponse.data
      const totalDonated = userDonations.reduce((sum, donation) => sum + Number(donation.amount), 0)
      const averageDonation = userDonations.length > 0 ? totalDonated / userDonations.length : 0
      
      setStats({
        totalDonated,
        totalDonations: userDonations.length,
        averageDonation
      })
    } catch (error) {
      console.error('Error fetching user data:', error)
      toast.error('Failed to load dashboard data')
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
        <h1 className="text-4xl font-bold text-white mb-8">Dashboard</h1>

        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user.name}</h2>
              <p className="text-gray-300">{user.email}</p>
              <span className="inline-block bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm mt-2">
                {user.role}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-card p-6 text-center"
          >
            <IndianRupee className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              {formatINR(stats.totalDonated)}
            </h3>
            <p className="text-gray-300">Total Donated</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-card p-6 text-center"
          >
            <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              {stats.totalDonations}
            </h3>
            <p className="text-gray-300">Total Donations</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-card p-6 text-center"
          >
            <Target className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">{formatINR(stats.averageDonation)}</h3>
            <p className="text-gray-300">Average Donation</p>
          </motion.div>
        </motion.div>

        {/* Donation History */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="glass-card p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Donation History</h2>
          
          {donations.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Donations Yet</h3>
              <p className="text-gray-300">Start making a difference by donating to campaigns!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {donations.map((donation, index) => (
                <motion.div
                  key={donation.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">
                        {donation.campaign?.title || 'Campaign'}
                      </h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(donation.donatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right flex flex-col items-end space-y-2">
                    <p className="text-green-400 font-bold text-lg">{formatINR(donation.amount)}</p>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        donation.paymentStatus === 'PAID' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {donation.paymentStatus}
                      </span>
                      {donation.paymentStatus === 'PAID' && (
                        <a
                          href={`/api/donations/${donation.id}/receipt`}
                          download
                          className="text-xs px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full hover:bg-blue-500/30 transition-colors flex items-center space-x-1"
                          title="Download Receipt"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>PDF</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Dashboard 