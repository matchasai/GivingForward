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
      toast.error('Failed to load dashboard data')
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
          <p className="text-sm font-semibold text-[#2F855A]">Welcome back</p>
          <h1 className="text-4xl font-bold text-[#1F2937]">Your impact</h1>
          <p className="text-[#6B7280] mt-2">Track donations and receipts in one place.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="trust-card p-4 sticky top-24">
              <h3 className="text-[#1F2937] font-semibold mb-3">Menu</h3>
              <ul className="space-y-2 text-sm text-[#6B7280]">
                <li><a className="hover:text-[#2F855A]" href="#user">Profile</a></li>
                <li><a className="hover:text-[#2F855A]" href="#stats">Stats</a></li>
                <li><a className="hover:text-[#2F855A]" href="#history">Donation history</a></li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="trust-card p-6 mb-8"
          id="user"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-[#EDF7F1] border border-[#C6F6D5] flex items-center justify-center">
              <User className="w-8 h-8 text-[#2F855A]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1F2937]">{user.name}</h2>
              <p className="text-[#6B7280]">{user.email}</p>
              <span className="inline-block bg-[#EDF7F1] text-[#2F855A] px-3 py-1 rounded-full text-sm mt-2 font-semibold">
                {user.role}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          id="stats"
        >
          <div className="trust-card p-6 text-center">
            <IndianRupee className="w-12 h-12 text-[#2F855A] mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-[#1F2937] mb-1">{formatINR(stats.totalDonated)}</h3>
            <p className="text-[#6B7280]">Total donated</p>
          </div>
          
          <div className="trust-card p-6 text-center">
            <Heart className="w-12 h-12 text-[#D97757] mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-[#1F2937] mb-1">{stats.totalDonations}</h3>
            <p className="text-[#6B7280]">Total donations</p>
          </div>
          
          <div className="trust-card p-6 text-center">
            <Target className="w-12 h-12 text-[#1D4ED8] mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-[#1F2937] mb-1">{formatINR(stats.averageDonation)}</h3>
            <p className="text-[#6B7280]">Average donation</p>
          </div>
        </motion.div>

        {/* Donation History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="trust-card p-6"
          id="history"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-semibold text-[#2F855A]">Receipts</p>
              <h2 className="text-2xl font-bold text-[#1F2937]">Donation history</h2>
            </div>
            <span className="text-sm text-[#6B7280]">Sorted newest first</span>
          </div>
          
          {donations.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">No donations yet</h3>
              <p className="text-[#6B7280]">Start making a difference by donating to campaigns!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {donations.map((donation, index) => (
                <motion.div
                  key={donation.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.25 + index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-[#F9FAF9] border border-[#E5E7EB] rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-[#EDF7F1] border border-[#C6F6D5] rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-[#2F855A]" />
                    </div>
                    <div>
                      <h4 className="text-[#1F2937] font-semibold">
                        {donation.campaign?.title || 'Campaign'}
                      </h4>
                      <div className="flex items-center space-x-2 text-sm text-[#6B7280]">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(donation.donatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right flex flex-col items-end space-y-2">
                    <p className="text-[#2F855A] font-bold text-lg">{formatINR(donation.amount)}</p>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        donation.paymentStatus === 'PAID' 
                          ? 'bg-[#EDF7F1] text-[#2F855A]' 
                          : 'bg-yellow-50 text-yellow-700'
                      }`}>
                        {donation.paymentStatus}
                      </span>
                      {donation.paymentStatus === 'PAID' && (
                        <a
                          href={`/api/donations/${donation.id}/receipt`}
                          download
                          className="text-xs px-3 py-1 bg-[#E0E7FF] text-[#1D4ED8] rounded-full hover:bg-[#C7D2FE] transition-colors flex items-center space-x-1"
                          title="Download Receipt"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard 