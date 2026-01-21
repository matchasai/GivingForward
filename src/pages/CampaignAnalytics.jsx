import axios from 'axios'
import { motion } from 'framer-motion'
import { ArrowLeft, DollarSign, Target, TrendingUp, Users } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatINR } from '../utils/currency'

function CampaignAnalytics() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [analytics, setAnalytics] = useState(null)
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchCampaign = useCallback(async () => {
    try {
      const response = await axios.get(`/api/campaigns/${id}`)
      setCampaign(response.data)
    } catch (error) {
      toast.error('Failed to load campaign')
    }
  }, [id])

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/campaigns/${id}/analytics`)
      setAnalytics(response.data)
    } catch (error) {
      toast.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchAnalytics()
    fetchCampaign()
  }, [fetchAnalytics, fetchCampaign])

  if (loading) {
    return (
      <div className="min-h-screen calm-bg flex items-center justify-center">
        <div className="text-[#1F2937] text-xl">Loading analytics...</div>
      </div>
    )
  }

  if (!analytics || !campaign) {
    return (
      <div className="min-h-screen calm-bg flex items-center justify-center">
        <div className="text-[#1F2937] text-xl">Failed to load analytics</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen calm-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-[#1F2937] mb-1">{campaign.title}</h1>
          <p className="text-[#6B7280]">Campaign analytics dashboard</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[{label:'Total raised', value: formatINR(analytics.currentAmount), helper:`of ${formatINR(analytics.targetAmount)} goal`, icon: <DollarSign className="w-6 h-6 text-[#2F855A]" />, bg:'bg-[#EDF7F1]'},
            {label:'Total donations', value: analytics.totalDonations, helper:'generous donors', icon: <Users className="w-6 h-6 text-[#1D4ED8]" />, bg:'bg-[#EEF2FF]'},
            {label:'Average donation', value: formatINR(analytics.averageDonation), helper:'per contributor', icon: <TrendingUp className="w-6 h-6 text-[#7C3AED]" />, bg:'bg-[#F5F3FF]'},
            {label:'Progress', value: `${analytics.progressPercentage.toFixed(1)}%`, helper:null, icon: <Target className="w-6 h-6 text-[#D97706]" />, bg:'bg-[#FEF3C7]'}].map((card, idx) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx }}
              className="trust-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.bg}`}>
                  {card.icon}
                </div>
              </div>
              <h3 className="text-sm font-semibold text-[#6B7280] mb-1">{card.label}</h3>
              <p className="text-2xl font-bold text-[#1F2937]">{card.value}</p>
              {card.helper && <p className="text-sm text-[#6B7280] mt-1">{card.helper}</p>}
              {card.label === 'Progress' && (
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-[#6B7280] mb-1">
                    <span>Status</span>
                    <span>{Math.min(analytics.progressPercentage, 100).toFixed(1)}%</span>
                  </div>
                  <div className="progress-bar h-2">
                    <div
                      className="progress-fill"
                      style={{ width: `${Math.min(analytics.progressPercentage, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Area Chart */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="trust-card p-6"
          >
            <h2 className="text-xl font-bold text-[#1F2937] mb-6">Donations over time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.chartData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2F855A" stopOpacity={0.75}/>
                    <stop offset="95%" stopColor="#2F855A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" tick={{ fill: '#6B7280' }} />
                <YAxis stroke="#6B7280" tick={{ fill: '#6B7280' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    color: '#111827'
                  }}
                  labelStyle={{ color: '#6B7280' }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#2F855A"
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="trust-card p-6"
          >
            <h2 className="text-xl font-bold text-[#1F2937] mb-6">Daily donations</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" tick={{ fill: '#6B7280' }} />
                <YAxis stroke="#6B7280" tick={{ fill: '#6B7280' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    color: '#111827'
                  }}
                  labelStyle={{ color: '#6B7280' }}
                />
                <Bar dataKey="amount" fill="#2F855A" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CampaignAnalytics
