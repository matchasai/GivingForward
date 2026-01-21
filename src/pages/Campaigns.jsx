import axios from 'axios'
import { motion } from 'framer-motion'
import { Calendar, Filter, Heart, IndianRupee, Search, Target, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { formatINR } from '../utils/currency'
import { getImageUrl } from '../utils/getImageUrl'

const placeholderImage = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="480" viewBox="0 0 800 480" fill="none"><rect width="800" height="480" rx="32" fill="%23F3F4F6"/><path d="M160 320l96-120 92 104 64-80 128 160H160z" fill="%23E5E7EB"/><circle cx="548" cy="176" r="48" fill="%23E5E7EB"/></svg>'

const categories = [
  { id: 'all', label: 'All Campaigns', icon: '🌟' },
  { id: 'Medical', label: 'Medical', icon: '🏥' },
  { id: 'Education', label: 'Education', icon: '📚' },
  { id: 'Disaster Relief', label: 'Disaster Relief', icon: '🆘' },
  { id: 'Community', label: 'Community', icon: '🤝' },
  { id: 'Other', label: 'Other', icon: '💡' }
]

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([])
  const [filteredCampaigns, setFilteredCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('recent')

  useEffect(() => {
    fetchCampaigns()
  }, [])

  useEffect(() => {
    filterAndSortCampaigns()
  }, [campaigns, selectedCategory, searchQuery, sortBy])

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get('/api/campaigns/active')
      setCampaigns(response.data)
    } catch (error) {
      toast.error('Failed to load campaigns')
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortCampaigns = () => {
    let filtered = [...campaigns]

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(c => c.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(c =>
        c.title?.toLowerCase().includes(query) ||
        c.description?.toLowerCase().includes(query)
      )
    }

    // Sort campaigns
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case 'trending':
        filtered.sort((a, b) => Number(b.currentAmount || 0) - Number(a.currentAmount || 0))
        break
      case 'nearlyFunded':
        filtered.sort((a, b) => {
          const progressA = (Number(a.currentAmount || 0) / Number(a.targetAmount || 1)) * 100
          const progressB = (Number(b.currentAmount || 0) / Number(b.targetAmount || 1)) * 100
          return progressB - progressA
        })
        break
      case 'urgent':
        filtered.sort((a, b) => Number(a.currentAmount || 0) - Number(b.currentAmount || 0))
        break
      default:
        break
    }

    setFilteredCampaigns(filtered)
  }

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen calm-bg">
        <div className="w-14 h-14 border-4 border-gray-200 border-t-[#2F855A] rounded-full animate-spin" />
      </div>
    )
  }

  // Helper to calculate progress percentage
  const getProgressPercentage = (campaign) => {
    if (!campaign) return 0
    const curr = Number(campaign.currentAmount ?? 0)
    const target = Number(campaign.targetAmount ?? 0)
    if (!isFinite(curr) || !isFinite(target) || target <= 0) return 0
    let pct = (curr / target) * 100
    if (pct > 0 && pct < 0.1) pct = 0.1
    return Math.min(100, pct)
  }

  return (
    <div className="min-h-screen calm-bg section-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-12"
      >
        <p className="text-sm font-semibold text-[#2F855A] mb-2">Active campaigns</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-[#1F2937] mb-4">Give with confidence</h1>
        <p className="text-lg text-[#6B7280] max-w-3xl mx-auto">
          Transparent goals, verified stories, and every rupee tracked. Choose a cause and help a family today.
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-8 space-y-6"
      >
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search campaigns by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3 bg-white border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#2F855A] focus:border-transparent outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1F2937] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full font-medium transition-all transform hover:scale-105 ${
                selectedCategory === cat.id
                  ? 'bg-[#2F855A] text-white shadow-md'
                  : 'bg-white text-[#6B7280] border border-[#E5E7EB] hover:border-[#2F855A]'
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort and Results Count */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-[#6B7280]">
            <span className="font-semibold text-[#1F2937]">{filteredCampaigns.length}</span> campaign{filteredCampaigns.length !== 1 ? 's' : ''} found
          </p>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#6B7280]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#2F855A] focus:border-transparent outline-none cursor-pointer"
            >
              <option value="recent">Most Recent</option>
              <option value="trending">Trending</option>
              <option value="nearlyFunded">Nearly Funded</option>
              <option value="urgent">Most Urgent</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Empty State */}
      {filteredCampaigns.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 trust-card max-w-md mx-auto"
        >
          <Heart className="w-16 h-16 text-[#D1D5DB] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#1F2937] mb-2">No campaigns found</h3>
          <p className="text-[#6B7280]">Try adjusting your filters or search query</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCampaigns.map((campaign) => {
          const progress = getProgressPercentage(campaign)
          const imageSrc = getImageUrl(campaign.imageUrl) || placeholderImage
          return (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="trust-card overflow-hidden card-lift"
            >
              <div className="relative overflow-hidden bg-[#F3F4F6]">
                <img
                  src={imageSrc}
                  alt={campaign.title || 'Campaign image'}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    if (e?.target?.dataset?.fallbackApplied) return
                    e.target.dataset.fallbackApplied = '1'
                    e.target.src = placeholderImage
                  }}
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>
              
                <div className="p-6 space-y-4">
                {campaign.category && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB]">
                    {campaign.category}
                  </span>
                )}
                  {campaign.endDate && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D]">
                      {getCountdown(campaign.endDate)?.text}
                    </span>
                  )}
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-semibold text-[#1F2937] line-clamp-2">{campaign.title}</h3>
                  {Number(campaign.currentAmount ?? 0) >= Number(campaign.targetAmount ?? 0) && (
                    <span className="bg-[#EDF7F1] text-[#2F855A] px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                      Fully funded
                    </span>
                  )}
                </div>
                
                <p className="text-[#6B7280] line-clamp-3 text-sm">{campaign.description}</p>

                <div>
                  <div className="flex justify-between text-sm text-[#6B7280] mb-2">
                    <span>Progress</span>
                    <span>{progress.toFixed(1)}%</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6 }}
                      className="progress-fill"
                    />
                  </div>
                  {/* Milestone indicators */}
                  <div className="flex justify-between text-xs mt-2">
                    {[25,50,75,100].map(m => (
                      <span key={m} className={`${progress >= m ? 'text-[#2F855A]' : 'text-[#9CA3AF]'}`}>{m}%</span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 rounded-lg bg-[#F9FAF9] border border-[#E5E7EB]">
                    <IndianRupee className="w-5 h-5 text-[#2F855A] mx-auto mb-1" />
                    <p className="text-sm text-[#6B7280]">Raised</p>
                    <p className="text-lg font-semibold text-[#1F2937]">{formatINR(campaign.currentAmount)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#F9FAF9] border border-[#E5E7EB]">
                    <Target className="w-5 h-5 text-[#1D4ED8] mx-auto mb-1" />
                    <p className="text-sm text-[#6B7280]">Goal</p>
                    <p className="text-lg font-semibold text-[#1F2937]">{formatINR(campaign.targetAmount)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-[#6B7280]">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Started {new Date(campaign.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <Link to={`/campaigns/${campaign.id}`} className="block">
                  <button className="w-full donate-btn flex items-center justify-center gap-2">
                    <Heart className="w-4 h-4" />
                    <span>View & support</span>
                  </button>
                </Link>
              </div>
            </motion.div>
          )
        })}
      </div>

      {campaigns.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Heart className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-[#1F2937] mb-2">No active campaigns yet</h3>
          <p className="text-[#6B7280]">Check back soon—new stories are added regularly.</p>
        </motion.div>
      )}

      <div className="mt-12 trust-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#2F855A]">Trust & transparency</p>
          <h3 className="text-lg font-semibold text-[#1F2937]">Every campaign is vetted by volunteers before going live.</h3>
          <p className="text-sm text-[#6B7280]">We verify documents, speak with campaign owners, and track every disbursement.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm text-[#1F2937]">
          <span className="px-3 py-1 rounded-full bg-[#EDF7F1] text-[#2F855A] font-medium">ID & document checks</span>
          <span className="px-3 py-1 rounded-full bg-[#F3F4F6] text-[#1F2937]">Phone verification</span>
          <span className="px-3 py-1 rounded-full bg-[#F3F4F6] text-[#1F2937]">Disbursal updates</span>
        </div>
      </div>
    </div>
  )
}

export default Campaigns 