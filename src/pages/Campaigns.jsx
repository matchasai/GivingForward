import axios from 'axios'
import { motion } from 'framer-motion'
import { Calendar, DollarSign, Heart, Target } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get('/api/campaigns/active')
      setCampaigns(response.data)
    } catch (error) {
      console.error('Error fetching campaigns:', error)
      toast.error('Failed to load campaigns')
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

  // Helper to calculate progress percentage
  const getProgressPercentage = (campaign) => {
    if (!campaign || !campaign.currentAmount || !campaign.targetAmount || campaign.targetAmount === 0) return 0;
    return Math.min(100, Math.round((campaign.currentAmount / campaign.targetAmount) * 100));
  };

  return (
    <div className="min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold text-white mb-4">Active Campaigns</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Discover and support causes that matter to you. Every donation makes a difference.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {campaigns.map((campaign, index) => (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -10 }}
            className="glass-card overflow-hidden group"
          >
            {campaign.imageUrl && (
              <div className="relative overflow-hidden">
                <img
                  src={campaign.imageUrl}
                  alt={campaign.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>
            )}
            
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">
                {campaign.title}
              </h3>
              
              <p className="text-gray-300 mb-4 line-clamp-3">
                {campaign.description}
              </p>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>Progress</span>
                  <span>{getProgressPercentage(campaign)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getProgressPercentage(campaign)}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <DollarSign className="w-5 h-5 text-green-400 mx-auto mb-1" />
                  <p className="text-sm text-gray-300">Raised</p>
                  <p className="text-white font-semibold">
                    ${Number(campaign.currentAmount).toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <Target className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <p className="text-sm text-gray-300">Goal</p>
                  <p className="text-white font-semibold">
                    ${Number(campaign.targetAmount).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(campaign.createdAt).toLocaleDateString()}</span>
                </div>
                {campaign.isFullyFunded?.() && (
                  <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
                    Fully Funded
                  </span>
                )}
              </div>
              
              <Link to={`/campaigns/${campaign.id}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full glass-button flex items-center justify-center space-x-2"
                >
                  <Heart className="w-4 h-4" />
                  <span>Support Campaign</span>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {campaigns.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-white mb-2">No Active Campaigns</h3>
          <p className="text-gray-300">Check back later for new campaigns!</p>
        </motion.div>
      )}
    </div>
  )
}

export default Campaigns 