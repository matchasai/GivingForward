import axios from 'axios'
import { motion } from 'framer-motion'
import { ArrowRight, Heart, IndianRupee, Target, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatINR } from '../utils/currency'
import { getImageUrl } from '../utils/getImageUrl'

const Home = () => {
  const [campaigns, setCampaigns] = useState([])
  const [stats, setStats] = useState({})

  useEffect(() => {
    fetchCampaigns()
    fetchStats()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get('/api/campaigns/active')
      setCampaigns(response.data.slice(0, 3)) // Show only 3 campaigns
    } catch (error) {
      console.error('Error fetching campaigns:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/public/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-20"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mb-8"
        >
          <Heart className="w-20 h-20 text-pink-400 mx-auto mb-6" />
        </motion.div>
        
        <h1 className="text-6xl font-bold text-white mb-6">
          Make a <span className="gradient-text">Difference</span>
        </h1>
        
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Join our community of generous donors and help make the world a better place.
          Every donation counts towards creating positive change.
        </p>
        
        <div className="flex justify-center space-x-4">
          <Link to="/campaigns">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-button text-lg px-8 py-4 flex items-center space-x-2"
            >
              <span>Explore Campaigns</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass-card p-6 text-center"
        >
          <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">{stats.totalUsers || 0}</h3>
          <p className="text-gray-300">Active Users</p>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass-card p-6 text-center"
        >
          <Target className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">{stats.activeCampaigns || 0}</h3>
          <p className="text-gray-300">Active Campaigns</p>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass-card p-6 text-center"
        >
          <IndianRupee className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">
            {stats.totalRaised ? formatINR(stats.totalRaised) : formatINR(0)}
          </h3>
          <p className="text-gray-300">Total Raised</p>
        </motion.div>
      </motion.div>

      {/* Featured Campaigns */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mb-16"
      >
        <h2 className="text-4xl font-bold text-white mb-8 text-center">Featured Campaigns</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {campaigns.map((campaign, index) => {
            const progress = campaign.currentAmount && campaign.targetAmount
              ? Math.min(100, Math.round((campaign.currentAmount / campaign.targetAmount) * 100))
              : 0;
            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="glass-card overflow-hidden"
              >
                {campaign.imageUrl && (
                  <div className="relative">
                    <img
                      src={getImageUrl(campaign.imageUrl)}
                      alt={campaign.title}
                      className="w-full h-48 object-cover"
                      style={{ borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }}
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{campaign.title}</h3>
                  <p className="text-gray-300 mb-4 line-clamp-3">{campaign.description}</p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-300 mb-2">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-300 mb-4">
                    <span>{formatINR(campaign.currentAmount)}</span>
                    <span>{formatINR(campaign.targetAmount)}</span>
                  </div>
                  <Link to={`/campaigns/${campaign.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="glass-button w-full"
                    >
                      View Campaign
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {campaigns.length > 0 && (
          <div className="text-center mt-8">
            <Link to="/campaigns">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button text-lg px-8 py-4"
              >
                View All Campaigns
              </motion.button>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Home 