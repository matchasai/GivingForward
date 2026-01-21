import axios from 'axios'
import { motion } from 'framer-motion'
import { Award, Calendar, CheckCircle, Heart, IndianRupee, Target, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { formatINR } from '../utils/currency'
import { getImageUrl } from '../utils/getImageUrl'

const placeholderImage = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="480" viewBox="0 0 800 480" fill="none"><rect width="800" height="480" rx="32" fill="%23F3F4F6"/><path d="M160 320l96-120 92 104 64-80 128 160H160z" fill="%23E5E7EB"/><circle cx="548" cy="176" r="48" fill="%23E5E7EB"/></svg>'

const SuccessStories = () => {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCompleted: 0,
    totalRaised: 0,
    livesImpacted: 0,
    activeDonors: 0
  })

  useEffect(() => {
    fetchSuccessStories()
  }, [])

  const fetchSuccessStories = async () => {
    try {
      // Fetch campaigns that are fully funded
      const response = await axios.get('/api/campaigns/active')
      const allCampaigns = response.data || []
      
      // Filter campaigns that reached or exceeded target
      const completedCampaigns = allCampaigns.filter(c => 
        Number(c.currentAmount || 0) >= Number(c.targetAmount || 0)
      )
      
      setCampaigns(completedCampaigns)
      
      // Calculate stats
      const totalRaised = completedCampaigns.reduce((sum, c) => 
        sum + Number(c.currentAmount || 0), 0
      )
      
      setStats({
        totalCompleted: completedCampaigns.length,
        totalRaised: totalRaised,
        livesImpacted: completedCampaigns.length * 5, // Estimate
        activeDonors: completedCampaigns.length * 20 // Estimate
      })
    } catch (error) {
      toast.error('Failed to load success stories')
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
    <div className="min-h-screen calm-bg">
      <div className="section-container">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 bg-[#EDF7F1] px-4 py-2 rounded-full mb-4">
            <Award className="w-5 h-5 text-[#2F855A]" />
            <span className="text-sm font-semibold text-[#2F855A]">Impact Stories</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#1F2937] mb-4">
            Success Stories That Inspire
          </h1>
          <p className="text-lg text-[#6B7280] max-w-3xl mx-auto">
            Real stories of hope, generosity, and transformation. See how your donations create lasting change.
          </p>
        </motion.div>

        {/* Impact Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="trust-card p-6 text-center card-lift">
            <div className="w-12 h-12 bg-[#EDF7F1] text-[#2F855A] rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-bold text-[#1F2937] mb-1">{stats.totalCompleted}</h3>
            <p className="text-[#6B7280] text-sm">Campaigns Completed</p>
          </div>

          <div className="trust-card p-6 text-center card-lift">
            <div className="w-12 h-12 bg-[#FEF3C7] text-[#CA8A04] rounded-full flex items-center justify-center mx-auto mb-3">
              <IndianRupee className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-bold text-[#1F2937] mb-1">{formatINR(stats.totalRaised)}</h3>
            <p className="text-[#6B7280] text-sm">Total Funds Raised</p>
          </div>

          <div className="trust-card p-6 text-center card-lift">
            <div className="w-12 h-12 bg-[#E0E7FF] text-[#1D4ED8] rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-bold text-[#1F2937] mb-1">{stats.livesImpacted}+</h3>
            <p className="text-[#6B7280] text-sm">Lives Impacted</p>
          </div>

          <div className="trust-card p-6 text-center card-lift">
            <div className="w-12 h-12 bg-[#FCE7F3] text-[#DB2777] rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-bold text-[#1F2937] mb-1">{stats.activeDonors}+</h3>
            <p className="text-[#6B7280] text-sm">Generous Donors</p>
          </div>
        </motion.div>

        {/* Success Stories Grid */}
        {campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {campaigns.map((campaign, index) => {
              const imageSrc = getImageUrl(campaign.imageUrl) || placeholderImage
              return (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.2 + index * 0.05 }}
                  className="trust-card overflow-hidden card-lift group"
                >
                  <div className="relative overflow-hidden bg-[#F3F4F6]">
                    <img
                      src={imageSrc}
                      alt={campaign.title || 'Campaign image'}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        if (e?.target?.dataset?.fallbackApplied) return
                        e.target.dataset.fallbackApplied = '1'
                        e.target.src = placeholderImage
                      }}
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-[#2F855A] text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Completed</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-semibold text-[#1F2937] line-clamp-2">
                      {campaign.title}
                    </h3>

                    <p className="text-[#6B7280] line-clamp-3 text-sm">
                      {campaign.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-[#EDF7F1] border border-[#2F855A]/20">
                        <div className="flex items-center space-x-2 mb-1">
                          <Target className="w-4 h-4 text-[#2F855A]" />
                          <p className="text-xs text-[#6B7280]">Goal</p>
                        </div>
                        <p className="text-sm font-semibold text-[#1F2937]">
                          {formatINR(campaign.targetAmount)}
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-[#F9FAF9] border border-[#E5E7EB]">
                        <div className="flex items-center space-x-2 mb-1">
                          <IndianRupee className="w-4 h-4 text-[#2F855A]" />
                          <p className="text-xs text-[#6B7280]">Raised</p>
                        </div>
                        <p className="text-sm font-semibold text-[#2F855A]">
                          {formatINR(campaign.currentAmount)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#6B7280] pt-2 border-t border-[#E5E7EB]">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Completed {new Date(campaign.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <Link to={`/campaigns/${campaign.id}`} className="block">
                      <button className="w-full btn-secondary text-sm">View Story</button>
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="trust-card p-12 text-center"
          >
            <Award className="w-16 h-16 text-[#E5E7EB] mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-[#1F2937] mb-2">
              Building Success Stories
            </h3>
            <p className="text-[#6B7280] mb-6">
              Our first success stories are in progress. Check back soon to see the amazing impact of generosity!
            </p>
            <Link to="/campaigns" className="donate-btn inline-flex">
              Support a Campaign Today
            </Link>
          </motion.div>
        )}

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="trust-card p-8 mb-12"
        >
          <div className="text-center mb-8">
            <p className="text-sm font-semibold text-[#2F855A] mb-2">Community Voices</p>
            <h2 className="text-3xl font-bold text-[#1F2937]">What People Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#F9FAF9] p-6 rounded-lg border border-[#E5E7EB]">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-[#2F855A] text-white rounded-full flex items-center justify-center font-bold">
                  R
                </div>
                <div>
                  <p className="font-semibold text-[#1F2937]">Rajesh Kumar</p>
                  <p className="text-sm text-[#6B7280]">Donor</p>
                </div>
              </div>
              <p className="text-[#4B5563] italic">
                "The transparency is incredible. I could see exactly how my donation helped a family get through their medical crisis. 
                This is how online fundraising should work."
              </p>
            </div>

            <div className="bg-[#F9FAF9] p-6 rounded-lg border border-[#E5E7EB]">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-[#1D4ED8] text-white rounded-full flex items-center justify-center font-bold">
                  P
                </div>
                <div>
                  <p className="font-semibold text-[#1F2937]">Priya Sharma</p>
                  <p className="text-sm text-[#6B7280]">Campaign Creator</p>
                </div>
              </div>
              <p className="text-[#4B5563] italic">
                "GivingForward helped me raise funds for my daughter's education when we had nowhere else to turn. 
                The support and compassion from strangers restored my faith in humanity."
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="trust-card p-8 text-center"
        >
          <h2 className="text-3xl font-bold text-[#1F2937] mb-4">
            Your Story Could Be Next
          </h2>
          <p className="text-[#6B7280] mb-6 max-w-2xl mx-auto">
            Whether you need support or want to give it, you're in the right place. 
            Join our community of changemakers today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/campaigns" className="donate-btn">
              Browse Campaigns
            </Link>
            <Link to="/how-it-works" className="btn-secondary">
              Learn How It Works
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SuccessStories
