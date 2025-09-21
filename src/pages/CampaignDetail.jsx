import axios from 'axios'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, DollarSign, Heart, Target, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'

const CampaignDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [campaign, setCampaign] = useState(null)
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [donationAmount, setDonationAmount] = useState('')
  const [showDonationForm, setShowDonationForm] = useState(false)
  const [processingDonation, setProcessingDonation] = useState(false)

  useEffect(() => {
    fetchCampaign()
    fetchDonations()
  }, [id])

  const fetchCampaign = async () => {
    try {
      const response = await axios.get(`/api/campaigns/${id}`)
      setCampaign(response.data)
    } catch (error) {
      console.error('Error fetching campaign:', error)
      toast.error('Failed to load campaign')
      navigate('/campaigns')
    } finally {
      setLoading(false)
    }
  }

  const fetchDonations = async () => {
    try {
      console.log('Fetching donations for campaign:', id)
      const response = await axios.get(`/api/donations/campaign/${id}`)
      console.log('Donations response:', response.data)
      setDonations(response.data || [])
    } catch (error) {
      console.error('Error fetching donations:', error)
      // Set empty array if error
      setDonations([])
    }
  }

  const handleDonation = async (e) => {
    e.preventDefault()
    
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setProcessingDonation(true)
    
    try {
      await axios.post('/api/donations', {
        campaignId: parseInt(id),
        amount: parseFloat(donationAmount)
      })
      
      toast.success('Donation successful! Thank you for your support.')
      setDonationAmount('')
      setShowDonationForm(false)
      fetchCampaign() // Refresh campaign data
      fetchDonations() // Refresh donation history
    } catch (error) {
      console.error('Error making donation:', error)
      toast.error('Failed to process donation')
    } finally {
      setProcessingDonation(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-white mb-4">Campaign not found</h2>
        <button
          onClick={() => navigate('/campaigns')}
          className="glass-button"
        >
          Back to Campaigns
        </button>
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
        {/* Back Button */}
        <button
          onClick={() => navigate('/campaigns')}
          className="glass-button mb-6 flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Campaigns</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Campaign Details */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass-card p-6"
            >
              <h1 className="text-3xl font-bold text-white mb-4">{campaign.title}</h1>
              
              {campaign.imageUrl && (
                <div className="mb-6 overflow-hidden rounded-lg">
                  <img
                    src={campaign.imageUrl}
                    alt={campaign.title}
                    className="w-full h-80 object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                </div>
              )}
              
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {campaign.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-300">Raised</p>
                  <p className="text-2xl font-bold text-white">
                    ${Number(campaign.currentAmount).toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-300">Goal</p>
                  <p className="text-2xl font-bold text-white">
                    ${Number(campaign.targetAmount).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>Progress</span>
                  <span>{campaign.currentAmount && campaign.targetAmount
                    ? Math.min(100, Math.round((campaign.currentAmount / campaign.targetAmount) * 100))
                    : 0}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${campaign.currentAmount && campaign.targetAmount
                      ? Math.min(100, Math.round((campaign.currentAmount / campaign.targetAmount) * 100))
                      : 0}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Created {new Date(campaign.createdAt).toLocaleDateString()}</span>
                </div>
                {campaign.isFullyFunded?.() && (
                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                    Fully Funded
                  </span>
                )}
              </div>
            </motion.div>
          </div>

          {/* Donation Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Support This Campaign</h2>
              
              {!showDonationForm ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDonationForm(true)}
                  className="w-full glass-button text-lg py-4 flex items-center justify-center space-x-2"
                >
                  <Heart className="w-5 h-5" />
                  <span>Make a Donation</span>
                </motion.button>
              ) : (
                <form onSubmit={handleDonation} className="space-y-4">
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
                      Donation Amount ($)
                    </label>
                    <input
                      id="amount"
                      type="number"
                      min="1"
                      step="0.01"
                      required
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter amount"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowDonationForm(false)}
                      className="flex-1 glass-button bg-gray-500/20 hover:bg-gray-500/30"
                    >
                      Cancel
                    </button>
                    <motion.button
                      type="submit"
                      disabled={processingDonation}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 glass-button disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingDonation ? 'Processing...' : 'Donate Now'}
                    </motion.button>
                  </div>
                </form>
              )}
              
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-300 mb-2">Fake Payment System</h3>
                <p className="text-sm text-gray-300">
                  This is a demonstration system. All payments are simulated and will always succeed.
                  In a real application, this would integrate with payment gateways like Stripe or PayPal.
                </p>
              </div>
            </div>

            {/* Recent Donations */}
                        {/* Recent Donations */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Recent Donations</h3>
              {!donations || donations.length === 0 ? (
                <p className="text-gray-300 text-center py-4">No donations yet. Be the first to donate!</p>
              ) : (
                <div className="space-y-3">
                  {donations.slice(0, 10).map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-white font-medium">
                            {donation.userName || 'Anonymous Donor'}
                          </p>
                          <p className="text-sm text-gray-400">
                            {donation.donatedAt ? new Date(donation.donatedAt).toLocaleDateString() : 'Recently'}
                          </p>
                        </div>
                      </div>
                      <span className="text-green-400 font-semibold">
                        ${Number(donation.amount || 0).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default CampaignDetail 