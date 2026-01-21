import axios from 'axios'
import { motion } from 'framer-motion'
import { ArrowRight, Heart, IndianRupee, Target, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
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
      toast.error('Failed to load campaigns')
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/public/stats')
      setStats(response.data)
    } catch (error) {
      toast.error('Failed to load stats')
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FAF9]">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-16 px-4 bg-gradient-to-b from-[#EDF7F1] to-[#F9FAF9]"
      >
        <Heart className="w-16 h-16 text-[#2F855A] mx-auto mb-6" fill="#2F855A" />
        
        <h1 className="text-5xl md:text-6xl font-bold text-[#1F2937] mb-6 leading-tight">
          Your Small Help Can <br />
          <span className="text-[#2F855A]">Change a Life</span>
        </h1>
        
        <p className="text-xl text-[#6B7280] mb-10 max-w-2xl mx-auto leading-relaxed">
          Together, we can make help reach faster. Support meaningful causes and 
          create lasting impact in the lives of those who need it most.
        </p>
        
        <div className="flex justify-center space-x-4">
          <Link to="/campaigns">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="donate-btn text-lg px-8 py-4 flex items-center space-x-2"
            >
              <span>Browse Campaigns</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Trust Signals Section (Home only) */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="bg-[#F9FAF9] py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold text-[#2F855A] mb-2">Why trust us</p>
            <h2 className="text-3xl font-bold text-[#1F2937]">Built on transparency & accountability</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#EDF7F1] text-[#2F855A] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1F2937] mb-2">Verified Campaigns</h3>
              <p className="text-[#6B7280]">Every campaign goes through verification. We check documents and validate stories.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#E0E7FF] text-[#1D4ED8] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21h6M12 17v4M7 4h10v7H7z"/></svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1F2937] mb-2">100% Transparency</h3>
              <p className="text-[#6B7280]">Track funds with regular updates on utilization and disbursement.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FEF3C7] text-[#CA8A04] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 11-12 0 6 6 0 0112 0zm6 13l-4-4"/></svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1F2937] mb-2">Community Powered</h3>
              <p className="text-[#6B7280]">Join donors making a real difference with compassion and care.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="section-container grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="trust-card p-8 text-center">
          <Users className="w-12 h-12 text-[#2F855A] mx-auto mb-4" />
          <h3 className="text-3xl font-bold text-[#1F2937] mb-2">{stats.totalUsers || 0}</h3>
          <p className="text-[#6B7280]">Generous Donors</p>
        </div>
        
        <div className="trust-card p-8 text-center">
          <Target className="w-12 h-12 text-[#2F855A] mx-auto mb-4" />
          <h3 className="text-3xl font-bold text-[#1F2937] mb-2">{stats.activeCampaigns || 0}</h3>
          <p className="text-[#6B7280]">Active Campaigns</p>
        </div>
        
        <div className="trust-card p-8 text-center">
          <IndianRupee className="w-12 h-12 text-[#2F855A] mx-auto mb-4" />
          <h3 className="text-3xl font-bold text-[#1F2937] mb-2">
            {stats.totalRaised ? formatINR(stats.totalRaised) : formatINR(0)}
          </h3>
          <p className="text-[#6B7280]">Total Raised</p>
        </div>
      </motion.div>

      {/* Featured Campaigns */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="section-container"
      >
        <h2 className="text-4xl font-bold text-[#1F2937] mb-3 text-center">Featured Campaigns</h2>
        <p className="text-center text-[#6B7280] mb-12 max-w-2xl mx-auto">
          Support these urgent causes and help us reach our goals faster
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {campaigns.map((campaign) => {
            const progress = campaign.currentAmount && campaign.targetAmount
              ? Math.min(100, Math.round((campaign.currentAmount / campaign.targetAmount) * 100))
              : 0;
            return (
              <div
                key={campaign.id}
                className="trust-card overflow-hidden card-lift"
              >
                {campaign.imageUrl && (
                  <div className="relative overflow-hidden">
                    <img
                      src={getImageUrl(campaign.imageUrl)}
                      alt={campaign.title}
                      className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#1F2937] mb-2">{campaign.title}</h3>
                  <p className="text-[#6B7280] mb-4 line-clamp-3">{campaign.description}</p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-[#6B7280] mb-2">
                      <span>Progress</span>
                      <span className="font-semibold text-[#2F855A]">{progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  <div className="flex justify-between text-sm mb-4">
                    <span className="font-semibold text-[#1F2937]">{formatINR(campaign.currentAmount)}</span>
                    <span className="text-[#6B7280]">of {formatINR(campaign.targetAmount)}</span>
                  </div>
                  <Link to={`/campaigns/${campaign.id}`}>
                    <button className="donate-btn w-full">Support This Cause</button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        
        {campaigns.length > 0 && (
          <div className="text-center mt-12">
            <Link to="/campaigns">
              <button className="btn-secondary text-lg px-8 py-4">View All Campaigns</button>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Home 