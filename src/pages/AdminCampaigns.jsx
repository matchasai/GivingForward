import axios from 'axios'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const emptyForm = { id: null, title: '', description: '', targetAmount: '', imageUrl: '' }

export default function AdminCampaigns() {
  const [showNotifyModal, setShowNotifyModal] = useState(false)
  const [notifyCampaign, setNotifyCampaign] = useState(null)

  const handleNotifyClick = (campaign) => {
    setNotifyCampaign(campaign)
    setShowNotifyModal(true)
  }

  const confirmNotify = async () => {
    if (!notifyCampaign) return
    try {
      await axios.post(`/api/campaigns/${notifyCampaign.id}/notify`)
      setShowNotifyModal(false)
      setNotifyCampaign(null)
      // Optionally show a success modal or toast here
    } catch (error) {
      setShowNotifyModal(false)
      setNotifyCampaign(null)
      // Optionally show an error modal or toast here
    }
  }
  // Notify users about campaign
  const notifyUsers = async (campaignId, campaignTitle) => {
    try {
      await axios.post(`/api/campaigns/${campaignId}/notify`)
      alert(`All users will be notified about campaign: ${campaignTitle}`)
    } catch (error) {
      alert('Failed to send notification email to users.')
      console.error(error)
    }
  }
  // Notify users about campaign
  const { user, token } = useAuth()
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [search, setSearch] = useState('')
  const [active, setActive] = useState('')
  const [sort, setSort] = useState('id,asc')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showToggleModal, setShowToggleModal] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [actionType, setActionType] = useState('')

  // Check if user is authenticated and has admin role
  if (!user || !token || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You must be logged in as an admin to access this page.</p>
        </div>
      </div>
    )
  }

  const loadCampaigns = async () => {
    setLoading(true)
    try {
      const params = { page, size, sort }
      if (search) params.search = search
      if (active !== '') params.active = active === 'true'
      const res = await axios.get('/api/campaigns', { params })
      const data = res.data
      setCampaigns(data.content || [])
      setTotalPages(data.totalPages || 0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCampaigns()
  }, [page, size, sort])

  const handleSortChange = (newSort) => {
    setSort(newSort)
    setPage(0) // Reset to first page when sorting changes
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = {
        title: form.title,
        description: form.description,
        targetAmount: Number(form.targetAmount),
        imageUrl: form.imageUrl || undefined,
      }
      if (form.id) {
        await axios.put(`/api/campaigns/${form.id}`, payload)
      } else {
        await axios.post('/api/campaigns', payload)
      }
      setForm(emptyForm)
      await loadCampaigns()
    } finally {
      setSubmitting(false)
    }
  }

  const onEdit = (c) => {
    setForm({ id: c.id, title: c.title, description: c.description, targetAmount: c.goalAmount, imageUrl: c.imageUrl || '' })
  }

  const onDelete = async (id, title) => {
    setSelectedCampaign({ id, title })
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    const { id, title } = selectedCampaign
    console.log('Delete attempt - Campaign ID:', id)
    console.log('Delete attempt - User:', user)
    console.log('Delete attempt - Token:', token ? 'Present' : 'Missing')
    
    try {
      const response = await axios.delete(`/api/campaigns/${id}`)
      console.log('Delete response:', response.status, response.statusText)
      
      // Refresh the campaigns list
      await loadCampaigns()
      console.log('Campaign deleted successfully and list refreshed')
      setShowDeleteModal(false)
      setSelectedCampaign(null)
    } catch (error) {
      console.error('Delete failed:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      alert(`Failed to delete campaign: ${error.response?.data?.message || error.message}`)
    }
  }

  const onToggleStatus = async (id, title, currentStatus) => {
    const action = currentStatus ? 'disable' : 'enable'
    setSelectedCampaign({ id, title, currentStatus })
    setActionType(action)
    setShowToggleModal(true)
  }

  const confirmToggle = async () => {
    const { id, title } = selectedCampaign
    const action = actionType
    
    try {
      await axios.patch(`/api/campaigns/${id}/toggle-status`)
      await loadCampaigns()
      console.log(`Campaign ${action}d successfully`)
      setShowToggleModal(false)
      setSelectedCampaign(null)
      setActionType('')
    } catch (error) {
      console.error('Toggle failed:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      alert(`Failed to ${action} campaign: ${error.response?.data?.message || error.message}`)
    }
  }

  const onUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await axios.post('/api/uploads/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setForm({ ...form, imageUrl: res.data.url })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Admin: Campaigns</h1>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
          <input className="bg-white/10 border border-white/20 rounded-lg p-3 text-white" placeholder="Search title" value={search} onChange={e=>setSearch(e.target.value)} />
          <select className="bg-white/10 border border-white/20 rounded-lg p-3 text-white" value={active} onChange={e=>setActive(e.target.value)}>
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <select className="bg-white/10 border border-white/20 rounded-lg p-3 text-white" value={sort} onChange={e=>handleSortChange(e.target.value)}>
            <option value="id,asc">ID (1-5)</option>
            <option value="id,desc">ID (5-1)</option>
            <option value="createdAt,desc">Newest</option>
            <option value="createdAt,asc">Oldest</option>
            <option value="title,asc">Title A-Z</option>
            <option value="title,desc">Title Z-A</option>
          </select>
          <select className="bg-white/10 border border-white/20 rounded-lg p-3 text-white" value={size} onChange={e=>{setSize(Number(e.target.value)); setPage(0)}}>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
          <div className="md:col-span-2">
            <button className="glass-button" onClick={()=>{ setPage(0); loadCampaigns() }}>Apply</button>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <h2 className="text-xl text-white font-semibold mb-4">{form.id ? 'Update Campaign' : 'Create Campaign'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input className="bg-white/10 border border-white/20 rounded-lg p-3 text-white" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
          <input className="bg-white/10 border border-white/20 rounded-lg p-3 text-white" placeholder="Target Amount" type="number" min="1" value={form.targetAmount} onChange={e=>setForm({...form, targetAmount:e.target.value})} required />
          <input className="bg-white/10 border border-white/20 rounded-lg p-3 text-white" placeholder="Image URL (optional)" value={form.imageUrl} onChange={e=>setForm({...form, imageUrl:e.target.value})} />
          <div className="flex items-center gap-3">
            <label className="glass-button cursor-pointer">
              Upload Image
              <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
            </label>
            {uploading && <span className="text-gray-300 text-sm">Uploading...</span>}
          </div>
          <textarea className="bg-white/10 border border-white/20 rounded-lg p-3 text-white md:col-span-4" rows={4} placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} required />
          <div className="md:col-span-4 flex gap-3">
            <button disabled={submitting} className="glass-button">{form.id ? 'Update' : 'Create'}</button>
            {form.id && (
              <button type="button" className="glass-button bg-gray-500/20" onClick={()=>setForm(emptyForm)}>Cancel</button>
            )}
          </div>
        </form>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-white font-semibold">All Campaigns</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">
              Sorted by: {sort === 'id,asc' ? 'ID (1-5)' : 
                        sort === 'id,desc' ? 'ID (5-1)' :
                        sort === 'createdAt,desc' ? 'Newest First' :
                        sort === 'createdAt,asc' ? 'Oldest First' :
                        sort === 'title,asc' ? 'Title A-Z' :
                        sort === 'title,desc' ? 'Title Z-A' : 'Custom'}
            </span>
          </div>
        </div>
        {loading ? (
          <div className="text-gray-300">Loading...</div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full text-sm text-gray-200">
              <thead>
                <tr className="text-left">
                  <th className="p-2">ID</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Active</th>
                  <th className="p-2">Raised</th>
                  <th className="p-2">Target</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map(c => (
                  <tr key={c.id} className="border-t border-white/10">
                    <td className="p-2">{c.id}</td>
                    <td className="p-2">{c.title}</td>
                    <td className="p-2">{String(c.active)}</td>
                    <td className="p-2">${Number(c.currentAmount).toLocaleString()}</td>
                    <td className="p-2">${Number(c.goalAmount).toLocaleString()}</td>
                    <td className="p-2 flex gap-2">
                      <button className="glass-button bg-blue-500/20" onClick={()=>onEdit(c)}>Edit</button>
                      <button 
                        className={`glass-button ${c.active ? 'bg-orange-500/20' : 'bg-green-500/20'}`} 
                        onClick={()=>onToggleStatus(c.id, c.title, c.active)}
                      >
                        {c.active ? 'Disable' : 'Enable'}
                      </button>
                      <button className="glass-button bg-red-500/20" onClick={()=>onDelete(c.id, c.title)}>Delete</button>
                      <button className="glass-button bg-purple-500/20" onClick={()=>handleNotifyClick(c)}>
                        Notify
                      </button>
      {/* Notify Confirmation Modal */}
      {showNotifyModal && notifyCampaign && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-purple-900/90 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 max-w-md mx-4"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Notify All Users</h3>
              <p className="text-gray-300 mb-2">
                Are you sure you want to notify all users about:
              </p>
              <p className="text-white font-semibold mb-4">"{notifyCampaign.title}"</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setShowNotifyModal(false)
                    setNotifyCampaign(null)
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmNotify}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Confirm Notify
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-4 text-gray-300">
              <button disabled={page===0} className="glass-button disabled:opacity-50" onClick={()=>setPage(p=>Math.max(0,p-1))}>Previous</button>
              <span>Page {page+1} of {Math.max(1,totalPages)}</span>
              <button disabled={page+1>=totalPages} className="glass-button disabled:opacity-50" onClick={()=>setPage(p=>p+1)}>Next</button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-900/90 backdrop-blur-sm border border-red-500/30 rounded-lg p-6 max-w-md mx-4"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Delete Campaign</h3>
              <p className="text-gray-300 mb-2">
                Are you sure you want to permanently delete:
              </p>
              <p className="text-white font-semibold mb-4">"{selectedCampaign?.title}"</p>
              <p className="text-red-300 text-sm mb-6">
                ⚠️ This action cannot be undone and will delete all associated donations!
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setSelectedCampaign(null)
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Toggle Status Confirmation Modal */}
      {showToggleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`backdrop-blur-sm border rounded-lg p-6 max-w-md mx-4 ${
              actionType === 'disable' 
                ? 'bg-orange-900/90 border-orange-500/30' 
                : 'bg-green-900/90 border-green-500/30'
            }`}
          >
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                actionType === 'disable' 
                  ? 'bg-orange-500/20' 
                  : 'bg-green-500/20'
              }`}>
                {actionType === 'disable' ? (
                  <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {actionType === 'disable' ? 'Disable' : 'Enable'} Campaign
              </h3>
              <p className="text-gray-300 mb-2">
                Are you sure you want to {actionType}:
              </p>
              <p className="text-white font-semibold mb-4">"{selectedCampaign?.title}"</p>
              <p className={`text-sm mb-6 ${
                actionType === 'disable' 
                  ? 'text-orange-300' 
                  : 'text-green-300'
              }`}>
                {actionType === 'disable' 
                  ? '🔒 This campaign will no longer accept donations' 
                  : '✅ This campaign will start accepting donations again'}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setShowToggleModal(false)
                    setSelectedCampaign(null)
                    setActionType('')
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmToggle}
                  className={`px-4 py-2 text-white rounded-lg transition-colors ${
                    actionType === 'disable'
                      ? 'bg-orange-600 hover:bg-orange-700'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {actionType === 'disable' ? 'Disable Campaign' : 'Enable Campaign'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
