import axios from 'axios'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Heart, IndianRupee, Sparkles, Target, User } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate, useParams } from 'react-router-dom'
import SocialShare from '../components/SocialShare'
import { useAuth } from '../contexts/AuthContext'
import { formatINR } from '../utils/currency'
import { getImageUrl } from '../utils/getImageUrl'

const placeholderImage = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="480" viewBox="0 0 800 480" fill="none"><rect width="800" height="480" rx="32" fill="%23F3F4F6"/><path d="M160 320l96-120 92 104 64-80 128 160H160z" fill="%23E5E7EB"/><circle cx="548" cy="176" r="48" fill="%23E5E7EB"/></svg>'

const donationTiers = [
  { amount: 500, impact: 'Provides meals for 2 families', icon: '🍽️' },
  { amount: 1000, impact: 'Covers school supplies for 3 children', icon: '📚' },
  { amount: 2500, impact: 'Helps with medical expenses', icon: '🏥' },
  { amount: 5000, impact: 'Supports emergency relief efforts', icon: '🆘' }
]

const CampaignDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [campaign, setCampaign] = useState(null)
  const [donations, setDonations] = useState([])
  const [similarCampaigns, setSimilarCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [donationAmount, setDonationAmount] = useState('')
  const [showDonationForm, setShowDonationForm] = useState(false)
  const [processingDonation, setProcessingDonation] = useState(false)
  const [updates, setUpdates] = useState([])
  const [loadingUpdates, setLoadingUpdates] = useState(false)

  const getCountdown = (endDateStr) => {
    if (!endDateStr) return null
    const end = new Date(endDateStr)
    const now = new Date()
    const diffMs = end.getTime() - now.getTime()
    if (diffMs <= 0) return { ended: true, text: 'Campaign Ended' }
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24)
    return { ended: false, text: `${days}d ${hours}h left` }
  }

  const fetchCampaign = useCallback(async () => {
    try {
      const response = await axios.get(`/api/campaigns/${id}`)
      setCampaign(response.data)
    } catch (error) {
      toast.error('Failed to load campaign')
      navigate('/campaigns')
    } finally {
      setLoading(false)
    }
  }, [id, navigate])

  const fetchDonations = useCallback(async () => {
    try {
      const response = await axios.get(`/api/donations/campaign/${id}`)
      setDonations(response.data || [])
    } catch (error) {
      toast.error('Failed to load donations')
      setDonations([])
    }
  }, [id])

  const fetchSimilarCampaigns = useCallback(async () => {
    if (!campaign) return
    try {
      const response = await axios.get('/api/campaigns/active')
      // Filter campaigns by same category, exclude current campaign
      const similar = response.data
        .filter(c => c.id !== id && c.category === campaign.category)
        .slice(0, 3)
      setSimilarCampaigns(similar)
    } catch (error) {
      setSimilarCampaigns([])
    }
  }, [campaign, id])

  useEffect(() => {
    fetchCampaign()
    fetchDonations()
  }, [fetchCampaign, fetchDonations])

  useEffect(() => {
    if (campaign) {
      fetchSimilarCampaigns()
      // Load updates timeline
      (async () => {
        setLoadingUpdates(true)
        try {
          const res = await axios.get(`/api/campaigns/${id}/updates`)
          setUpdates(res.data || [])
        } catch (err) {
          toast.error('Failed to load updates')
          setUpdates([])
        } finally {
          setLoadingUpdates(false)
        }
      })()
    }
  }, [campaign, fetchSimilarCampaigns])

  const handleDonation = async (e) => {
    e.preventDefault()
    const amt = parseFloat(donationAmount)
    if (!donationAmount || isNaN(amt) || amt <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    if (amt < 1) {
      toast.error('Minimum donation is ₹1.00')
      return
    }
    setProcessingDonation(true)
    try {
      // 1) Ask backend to create a Razorpay order (amount in rupees)
      const createRes = await axios.post('/api/payments/create-order', {
        campaignId: id, // backend expects String campaignId
        amount: amt
      })
      const { orderId, key, amount, currency } = createRes.data

      // 2) Open Razorpay Checkout
      const options = {
        key,
        amount, // in paise
        currency,
        name: 'GivingForward',
        description: `Donation for Campaign #${id}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // 3) Verify payment on backend and record donation
            await axios.post('/api/payments/verify', {
              campaignId: id,
              amount: amt,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
            toast.success('Donation successful! Thank you for your support.')
            setDonationAmount('')
            setShowDonationForm(false)
            fetchCampaign()
            fetchDonations()
          } catch (err) {
            toast.error('Payment verification failed')
          } finally {
            setProcessingDonation(false)
          }
        },
        theme: {
          color: '#2F855A'
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response) {
        toast.error(response?.error?.description || 'Payment failed')
        setProcessingDonation(false)
      })
      rzp.open()
    } catch (error) {
      const status = error?.response?.status
      const resData = error?.response?.data
      // Response body may be JSON { message, details } or a plain string. Handle both.
      let msg = 'Failed to initialize payment'
      let details = null
      if (resData) {
        if (typeof resData === 'string') {
          msg = resData
        } else if (typeof resData === 'object') {
          msg = resData.message || msg
          details = resData.details || null
        }
      } else if (error?.message) {
        msg = error.message
      }

      // Common hosted-env hint for missing Razorpay keys
      if ((status === 400 || status === 500) && msg?.toLowerCase().includes('razorpay')) {
        details = details || 'Server is missing Razorpay keys. Configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET and redeploy.'
      }

      toast.error(details ? `${msg}: ${details}` : msg)
      setProcessingDonation(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen calm-bg">
        <div className="w-14 h-14 border-4 border-gray-200 border-t-[#2F855A] rounded-full animate-spin" />
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="text-center py-12 section-container calm-bg">
        <h2 className="text-2xl font-semibold text-[#1F2937] mb-4">Campaign not found</h2>
        <button
          onClick={() => navigate('/campaigns')}
          className="btn-secondary"
        >
          Back to Campaigns
        </button>
      </div>
    )
  }

  const progressPercent = (() => {
    const curr = Number(campaign?.currentAmount ?? 0)
    const target = Number(campaign?.targetAmount ?? 0)
    if (!isFinite(curr) || !isFinite(target) || target <= 0) return 0
    let pct = (curr / target) * 100
    if (pct > 0 && pct < 0.1) pct = 0.1
    return Math.min(100, pct)
  })()

  const countdown = getCountdown(campaign?.endDate)
  const isEnded = !!countdown?.ended

  return (
    <div className="min-h-screen calm-bg section-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate('/campaigns')}
          className="btn-secondary mb-6 flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Campaigns</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Campaign Details */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="trust-card p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-[#2F855A]">Campaign</p>
                {campaign.category && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB]">
                    {campaign.category}
                  </span>
                )}
                {campaign.endDate && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D]">
                    {countdown?.text}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-[#1F2937] mb-3">{campaign.title}</h1>
              
              <div className="mb-6 overflow-hidden rounded-lg bg-[#F3F4F6]">
                <img
                  src={getImageUrl(campaign.imageUrl) || placeholderImage}
                  alt={campaign.title || 'Campaign image'}
                  className="w-full h-80 object-cover"
                  onError={(e) => {
                    if (e?.target?.dataset?.fallbackApplied) return
                    e.target.dataset.fallbackApplied = '1'
                    e.target.src = placeholderImage
                  }}
                />
              </div>
              
              <p className="text-[#4B5563] text-lg leading-relaxed mb-6">
                {campaign.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 rounded-lg bg-[#F9FAF9] border border-[#E5E7EB]">
                  <IndianRupee className="w-8 h-8 text-[#2F855A] mx-auto mb-2" />
                  <p className="text-sm text-[#6B7280]">Raised</p>
                  <p className="text-2xl font-bold text-[#1F2937]">
                    {formatINR(campaign.currentAmount)}
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg bg-[#F9FAF9] border border-[#E5E7EB]">
                  <Target className="w-8 h-8 text-[#1D4ED8] mx-auto mb-2" />
                  <p className="text-sm text-[#6B7280]">Goal</p>
                  <p className="text-2xl font-bold text-[#1F2937]">
                    {formatINR(campaign.targetAmount)}
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between text-sm text-[#6B7280] mb-2">
                  <span>Progress</span>
                  <span>{progressPercent.toFixed(1)}%</span>
                </div>
                <div className="progress-bar h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.6 }}
                    className="progress-fill"
                  />
                </div>
                {/* Milestone indicators */}
                <div className="flex justify-between text-xs mt-2">
                  {[25,50,75,100].map(m => (
                    <span key={m} className={`${progressPercent >= m ? 'text-[#2F855A]' : 'text-[#9CA3AF]'}`}>{m}%</span>
                  ))}
                </div>
              </div>

              {/* Social Sharing */}
              <div className="border-t border-[#E5E7EB] pt-6">
                <SocialShare
                  url={window.location.href}
                  title={campaign.title}
                  description={campaign.description}
                />
              </div>
              
              <div className="flex items-center justify-between text-sm text-[#6B7280]">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Created {new Date(campaign.createdAt).toLocaleDateString()}</span>
                </div>
                {Number(campaign.currentAmount ?? 0) >= Number(campaign.targetAmount ?? 0) && (
                  <span className="bg-[#EDF7F1] text-[#2F855A] px-3 py-1 rounded-full font-semibold">
                    Fully funded
                  </span>
                )}
              </div>
            </motion.div>
          </div>

          {/* Donation Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="space-y-6"
          >
            <div className="trust-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#2F855A]">Donate</p>
                  <h2 className="text-2xl font-bold text-[#1F2937] mb-2">Support this campaign</h2>
                  <p className="text-sm text-[#6B7280]">Secure payments. Receipts shared instantly.</p>
                </div>
                <Heart className="w-6 h-6 text-[#2F855A]" />
              </div>
              
              {isEnded ? (
                <div className="p-4 bg-[#FFF5F5] border border-[#FED7D7] text-[#9B2C2C] rounded-lg">
                  This campaign has ended. Donations are closed.
                </div>
              ) : !showDonationForm ? (
                <button
                  onClick={() => {
                    if (!user) {
                      toast.error('Please login to make a donation')
                      return
                    }
                    setShowDonationForm(true)
                  }}
                  className="w-full donate-btn text-lg py-4 flex items-center justify-center gap-2"
                >
                  <Heart className="w-5 h-5" />
                  <span>Make a donation</span>
                </button>
              ) : (
                <form onSubmit={handleDonation} className="space-y-4">
                  {/* Donation Tiers */}
                  <div>
                    <label className="block text-sm font-medium text-[#1F2937] mb-3">
                      Quick Select Amount
                    </label>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {donationTiers.map((tier) => (
                        <button
                          key={tier.amount}
                          type="button"
                          onClick={() => setDonationAmount(tier.amount.toString())}
                          className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                            parseInt(donationAmount) === tier.amount
                              ? 'border-[#2F855A] bg-[#EDF7F1]'
                              : 'border-[#E5E7EB] bg-white hover:border-[#2F855A]'
                          }`}
                        >
                          <div className="text-2xl mb-1">{tier.icon}</div>
                          <div className="font-bold text-[#1F2937]">₹{tier.amount}</div>
                          <div className="text-xs text-[#6B7280] mt-1">{tier.impact}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-[#1F2937] mb-2">
                      Or Enter Custom Amount (₹)
                    </label>
                    <input
                      id="amount"
                      type="number"
                      min="1"
                      step="0.01"
                      required
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2F855A] focus:border-transparent"
                      placeholder="Enter amount"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowDonationForm(false)}
                      className="flex-1 btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={processingDonation}
                      className="flex-1 donate-btn disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingDonation ? 'Processing...' : 'Donate now'}
                    </button>
                  </div>
                </form>
              )}
              
              <div className="mt-6 p-4 bg-[#EDF7F1] border border-[#C6F6D5] rounded-lg">
                <h3 className="text-lg font-semibold text-[#22543D] mb-2">Secure payments</h3>
                <p className="text-sm text-[#1F2937]">
                  Payments are processed securely via Razorpay. Card details never touch our servers.
                </p>
              </div>
            </div>

            {/* Recent Donations */}
            <div className="trust-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-[#1F2937]">Recent donations</h3>
                <span className="text-sm text-[#6B7280]">Live updates</span>
              </div>
              {!donations || donations.length === 0 ? (
                <p className="text-[#6B7280] text-center py-4">No donations yet. Be the first to donate!</p>
              ) : (
                <div className="space-y-3">
                  {donations.slice(0, 10).map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between p-3 bg-[#F9FAF9] border border-[#E5E7EB] rounded-lg">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-[#6B7280]" />
                        <div>
                          <p className="text-[#1F2937] font-medium">
                            {donation.userName || 'Anonymous Donor'}
                          </p>
                          <p className="text-sm text-[#6B7280]">
                            {donation.donatedAt ? new Date(donation.donatedAt).toLocaleDateString() : 'Recently'}
                          </p>
                        </div>
                      </div>
                      <span className="text-[#2F855A] font-semibold">
                        {formatINR(donation.amount || 0)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Campaign Updates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="mt-12 trust-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[#2F855A]" />
            <h2 className="text-xl font-bold text-[#1F2937]">Campaign Updates</h2>
          </div>
          {loadingUpdates ? (
            <p className="text-[#6B7280]">Loading updates...</p>
          ) : !updates || updates.length === 0 ? (
            <p className="text-[#6B7280]">No updates yet.</p>
          ) : (
            <div className="space-y-4">
              {updates.map((u, idx) => (
                <div key={idx} className="p-4 bg-[#F9FAF9] border border-[#E5E7EB] rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-[#6B7280]">{new Date(u.createdAt).toLocaleString()}</span>
                    {u.createdByName && (
                      <span className="text-xs text-[#6B7280]">By {u.createdByName}</span>
                    )}
                  </div>
                  <p className="text-[#1F2937]">{u.text}</p>
                  {u.imageUrl && (
                    <img src={u.imageUrl} alt="Update" className="mt-3 rounded-lg max-h-56 object-cover" />
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Similar Campaigns */}
        {similarCampaigns.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-12"
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-[#2F855A]" />
              <h2 className="text-2xl font-bold text-[#1F2937]">Similar Campaigns</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarCampaigns.map((similarCampaign) => {
                const progress = (() => {
                  const curr = Number(similarCampaign.currentAmount ?? 0)
                  const target = Number(similarCampaign.targetAmount ?? 0)
                  if (!isFinite(curr) || !isFinite(target) || target <= 0) return 0
                  let pct = (curr / target) * 100
                  if (pct > 0 && pct < 0.1) pct = 0.1
                  return Math.min(100, pct)
                })()
                
                return (
                  <Link
                    key={similarCampaign.id}
                    to={`/campaigns/${similarCampaign.id}`}
                    className="trust-card overflow-hidden card-lift"
                  >
                    <div className="relative overflow-hidden bg-[#F3F4F6] h-48">
                      <img
                        src={getImageUrl(similarCampaign.imageUrl) || placeholderImage}
                        alt={similarCampaign.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          if (e?.target?.dataset?.fallbackApplied) return
                          e.target.dataset.fallbackApplied = '1'
                          e.target.src = placeholderImage
                        }}
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-[#1F2937] mb-2 line-clamp-2">
                        {similarCampaign.title}
                      </h3>
                      <p className="text-sm text-[#6B7280] mb-4 line-clamp-2">
                        {similarCampaign.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#6B7280]">Progress</span>
                          <span className="font-semibold text-[#1F2937]">{progress.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-[#E5E7EB] rounded-full h-2">
                          <div
                            className="bg-[#2F855A] h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#6B7280]">Raised</span>
                          <span className="font-semibold text-[#1F2937]">
                            {formatINR(similarCampaign.currentAmount || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default CampaignDetail 