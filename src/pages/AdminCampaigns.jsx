import axios from 'axios'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { formatINR } from '../utils/currency'

const emptyForm = { id: null, title: '', description: '', targetAmount: '', imageUrl: '', category: 'Other', endDate: '' }

export default function AdminCampaigns() {
  const navigate = useNavigate()
  const [showNotifyModal, setShowNotifyModal] = useState(false)
  const [notifyCampaign, setNotifyCampaign] = useState(null)

  const handleNotifyClick = (campaign) => {
    setNotifyCampaign(campaign)
    setShowNotifyModal(true)
  }

  const confirmNotify = async () => {
    if (!notifyCampaign) return
    // Close the pop immediately
    setShowNotifyModal(false)
    const campaign = notifyCampaign
    setNotifyCampaign(null)
    try {
      await axios.post(`/api/campaigns/${campaign.id}/notify`)
      toast.success('Notification sent')
    } catch (error) {
      toast.error('Failed to send notification')
    }
  }

  const { user, token } = useAuth()
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [updateForm, setUpdateForm] = useState({ campaignId: '', text: '', imageUrl: '' })
  const [postingUpdate, setPostingUpdate] = useState(false)
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

  const loadCampaigns = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, size, sort }
      if (search) params.search = search
      if (active !== '') params.active = active === 'true'
      const res = await axios.get('/api/campaigns', { params })
      const data = res.data
      setCampaigns(data.content || [])
      setTotalPages(data.totalPages || 0)
    } catch (error) {
      toast.error('Failed to load campaigns')
    } finally {
      setLoading(false)
    }
  }, [active, page, search, size, sort])

  useEffect(() => {
    loadCampaigns()
  }, [loadCampaigns])

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
        category: form.category || 'Other',
        endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
      }
      if (form.id) {
        await axios.put(`/api/campaigns/${form.id}`, payload)
      } else {
        await axios.post('/api/campaigns', payload)
      }
      toast.success('Campaign saved')
      setForm(emptyForm)
      await loadCampaigns()
    } catch (error) {
      toast.error('Failed to save campaign')
    } finally {
      setSubmitting(false)
    }
  }

  const onEdit = (c) => {
    setForm({ id: c.id, title: c.title, description: c.description, targetAmount: c.targetAmount, imageUrl: c.imageUrl || '' })
  }

  const onDelete = async (id, title) => {
    setSelectedCampaign({ id, title })
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    const { id } = selectedCampaign
    try {
      await axios.delete(`/api/campaigns/${id}`)
      // Refresh the campaigns list
      await loadCampaigns()
      setShowDeleteModal(false)
      setSelectedCampaign(null)
    } catch (error) {
      toast.error('Failed to delete campaign')
    }
  }

  const onToggleStatus = async (id, title, currentStatus) => {
    const action = currentStatus ? 'disable' : 'enable'
    setSelectedCampaign({ id, title, currentStatus })
    setActionType(action)
    setShowToggleModal(true)
  }

  const confirmToggle = async () => {
    const { id } = selectedCampaign
    const action = actionType
    
    try {
      await axios.patch(`/api/campaigns/${id}/toggle-status`)
      toast.success(`Campaign ${action}d`)
      await loadCampaigns()
      setShowToggleModal(false)
      setSelectedCampaign(null)
      setActionType('')
    } catch (error) {
      toast.error(`Failed to ${action} campaign`)
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
    } catch (error) {
      toast.error('Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const onUploadUpdateImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await axios.post('/api/uploads/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setUpdateForm({ ...updateForm, imageUrl: res.data.url })
    } catch (error) {
      toast.error('Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const postUpdate = async () => {
    const { campaignId, text, imageUrl } = updateForm
    if (!campaignId || !text.trim()) return
    setPostingUpdate(true)
    try {
      await axios.post(`/api/campaigns/${campaignId}/updates`, { text, imageUrl })
      setUpdateForm({ campaignId: '', text: '', imageUrl: '' })
      toast.success('Update posted')
    } catch (error) {
      toast.error('Failed to post update')
    } finally {
      setPostingUpdate(false)
    }
  }

  return (
    <div className="space-y-8 calm-bg section-container">
      <div>
        <p className="text-sm font-semibold text-[#2F855A]">Admin tools</p>
        <h1 className="text-3xl font-bold text-[#1F2937]">Campaigns</h1>
        <p className="text-[#6B7280] mt-1">Manage all campaigns, statuses, and notifications.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="trust-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
          <input className="bg-white border border-[#E5E7EB] rounded-lg p-3 text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2F855A]" placeholder="Search title" value={search} onChange={e=>setSearch(e.target.value)} />
          <select className="bg-white border border-[#E5E7EB] rounded-lg p-3 text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#2F855A]" value={active} onChange={e=>setActive(e.target.value)}>
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <select className="bg-white border border-[#E5E7EB] rounded-lg p-3 text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#2F855A]" value={sort} onChange={e=>handleSortChange(e.target.value)}>
            <option value="id,asc">ID (1-5)</option>
            <option value="id,desc">ID (5-1)</option>
            <option value="createdAt,desc">Newest</option>
            <option value="createdAt,asc">Oldest</option>
            <option value="title,asc">Title A-Z</option>
            <option value="title,desc">Title Z-A</option>
          </select>
          <select className="bg-white border border-[#E5E7EB] rounded-lg p-3 text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#2F855A]" value={size} onChange={e=>{setSize(Number(e.target.value)); setPage(0)}}>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
          <div className="md:col-span-2">
            <button className="donate-btn w-full" onClick={()=>{ setPage(0); loadCampaigns() }}>Apply</button>
          </div>
        </div>
      </motion.div>

      {/* Post Campaign Update */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="trust-card p-6">
        <h2 className="text-xl text-[#1F2937] font-semibold mb-4">Post campaign update</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <select className="bg-white border border-[#E5E7EB] rounded-lg p-3 text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#2F855A]" value={updateForm.campaignId} onChange={e=>setUpdateForm({...updateForm, campaignId: e.target.value})}>
            <option value="">Select campaign</option>
            {campaigns.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
          <input className="bg-white border border-[#E5E7EB] rounded-lg p-3 text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2F855A]" placeholder="Image URL (optional)" value={updateForm.imageUrl} onChange={e=>setUpdateForm({...updateForm, imageUrl: e.target.value})} />
          <label className="btn-secondary cursor-pointer text-center">
            Upload image
            <input type="file" accept="image/*" onChange={onUploadUpdateImage} className="hidden" />
          </label>
          {uploading && <span className="text-[#6B7280] text-sm">Uploading...</span>}
          <textarea className="bg-white border border-[#E5E7EB] rounded-lg p-3 text-[#1F2937] placeholder-[#9CA3AF] md:col-span-4 focus:outline-none focus:ring-2 focus:ring-[#2F855A]" rows={3} placeholder="Write an update..." value={updateForm.text} onChange={e=>setUpdateForm({...updateForm, text: e.target.value})} />
          <div className="md:col-span-4">
            <button disabled={postingUpdate || !updateForm.campaignId || !updateForm.text.trim()} className="donate-btn disabled:opacity-50" onClick={postUpdate}>
              {postingUpdate ? 'Posting...' : 'Post update'}
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="trust-card p-6">
        <h2 className="text-xl text-[#1F2937] font-semibold mb-4">{form.id ? 'Update campaign' : 'Create campaign'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input className="bg-white border border-[#E5E7EB] rounded-lg p-3 text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2F855A]" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
          <input className="bg-white border border-[#E5E7EB] rounded-lg p-3 text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2F855A]" placeholder="Target Amount" type="number" min="1" value={form.targetAmount} onChange={e=>setForm({...form, targetAmount:e.target.value})} required />
          <select className="bg-white border border-[#E5E7EB] rounded-lg p-3 text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#2F855A]" value={form.category || 'Other'} onChange={e=>setForm({...form, category:e.target.value})} required>
            <option value="Medical">Medical</option>
            <option value="Education">Education</option>
            <option value="Disaster Relief">Disaster Relief</option>
            <option value="Community">Community</option>
            <option value="Other">Other</option>
          </select>
          <input className="bg-white border border-[#E5E7EB] rounded-lg p-3 text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#2F855A]" type="date" value={form.endDate} onChange={e=>setForm({...form, endDate:e.target.value})} />
          <input className="bg-white border border-[#E5E7EB] rounded-lg p-3 text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2F855A]" placeholder="Image URL (optional)" value={form.imageUrl} onChange={e=>setForm({...form, imageUrl:e.target.value})} />
          <div className="flex items-center gap-3">
            <label className="btn-secondary cursor-pointer flex-1 text-center">
              Upload image
              <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
            </label>
            {uploading && <span className="text-[#6B7280] text-sm">Uploading...</span>}
          </div>
          <textarea className="bg-white border border-[#E5E7EB] rounded-lg p-3 text-[#1F2937] placeholder-[#9CA3AF] md:col-span-4 focus:outline-none focus:ring-2 focus:ring-[#2F855A]" rows={4} placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} required />
          <div className="md:col-span-4 flex gap-3">
            <button disabled={submitting} className="donate-btn disabled:opacity-50">{form.id ? 'Update' : 'Create'}</button>
            {form.id && (
              <button type="button" className="btn-secondary" onClick={()=>setForm(emptyForm)}>Cancel</button>
            )}
          </div>
        </form>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="trust-card p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm font-semibold text-[#2F855A]">Overview</p>
            <h2 className="text-xl text-[#1F2937] font-semibold">All campaigns</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#6B7280]">
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
          <div className="text-[#6B7280]">Loading...</div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full text-sm text-[#1F2937]">
              <thead className="bg-[#F9FAF9] text-[#4B5563]">
                <tr className="text-left">
                  <th className="p-2">S.No</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Active</th>
                  <th className="p-2">Raised</th>
                  <th className="p-2">Target</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c, idx) => (
                  <tr key={c.id} className="border-t border-[#E5E7EB]">
                    <td className="p-2">{page * size + idx + 1}</td>
                    <td className="p-2 font-medium">{c.title}</td>
                    <td className="p-2">{String(c.active)}</td>
                    <td className="p-2">{formatINR(c.currentAmount)}</td>
                    <td className="p-2">{formatINR(c.targetAmount)}</td>
                    <td className="p-2 flex flex-wrap gap-2">
                      <button className="btn-secondary" onClick={()=>onEdit(c)}>Edit</button>
                      <button 
                        className="btn-secondary" 
                        onClick={()=>navigate(`/campaigns/${c.id}/analytics`)}
                      >
                        Analytics
                      </button>
                      <button 
                        className={`px-3 py-2 rounded-lg font-semibold border text-sm ${c.active ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-[#EDF7F1] text-[#2F855A] border-[#C6F6D5]'}`} 
                        onClick={()=>onToggleStatus(c.id, c.title, c.active)}
                      >
                        {c.active ? 'Disable' : 'Enable'}
                      </button>
                      <button className="px-3 py-2 rounded-lg font-semibold border border-red-200 text-red-700 bg-red-50" onClick={()=>onDelete(c.id, c.title)}>Delete</button>
                      <button className="px-3 py-2 rounded-lg font-semibold border border-[#E0E7FF] text-[#1D4ED8] bg-[#EEF2FF]" onClick={()=>handleNotifyClick(c)}>
                        Notify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-4 text-[#6B7280]">
              <button disabled={page===0} className="btn-secondary disabled:opacity-50" onClick={()=>setPage(p=>Math.max(0,p-1))}>Previous</button>
              <span>Page {page+1} of {Math.max(1,totalPages)}</span>
              <button disabled={page+1>=totalPages} className="btn-secondary disabled:opacity-50" onClick={()=>setPage(p=>p+1)}>Next</button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Notify Confirmation Modal */}
      {showNotifyModal && notifyCampaign && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="trust-card max-w-md w-full"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#1F2937]">Notify all users</h3>
                <p className="text-[#4B5563] mt-1">Send a broadcast about this campaign.</p>
                <p className="text-[#111827] font-semibold mt-2">“{notifyCampaign.title}”</p>
                <div className="flex gap-3 justify-end mt-4">
                  <button
                    onClick={() => {
                      setShowNotifyModal(false)
                      setNotifyCampaign(null)
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmNotify}
                    className="donate-btn"
                  >
                    Confirm notify
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="trust-card max-w-md w-full"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#1F2937]">Delete campaign</h3>
                <p className="text-[#4B5563] mt-1">This cannot be undone. All donations linked to it will be removed.</p>
                <p className="text-[#111827] font-semibold mt-2">“{selectedCampaign?.title}”</p>
                <div className="flex gap-3 justify-end mt-4">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false)
                      setSelectedCampaign(null)
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 rounded-lg font-semibold border border-red-200 text-red-700 bg-red-50"
                  >
                    Delete permanently
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Toggle Status Confirmation Modal */}
      {showToggleModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="trust-card max-w-md w-full"
          >
            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                actionType === 'disable' ? 'bg-orange-50 text-orange-700' : 'bg-green-50 text-green-700'
              }`}>
                {actionType === 'disable' ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#1F2937]">
                  {actionType === 'disable' ? 'Disable campaign' : 'Enable campaign'}
                </h3>
                <p className="text-[#4B5563] mt-1">Are you sure you want to {actionType} this campaign?</p>
                <p className="text-[#111827] font-semibold mt-2">“{selectedCampaign?.title}”</p>
                <p className={`text-sm mt-2 ${actionType === 'disable' ? 'text-orange-700' : 'text-green-700'}`}>
                  {actionType === 'disable' 
                    ? 'This campaign will stop accepting donations.' 
                    : 'This campaign will start accepting donations again.'}
                </p>
                <div className="flex gap-3 justify-end mt-4">
                  <button
                    onClick={() => {
                      setShowToggleModal(false)
                      setSelectedCampaign(null)
                      setActionType('')
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmToggle}
                    className={`px-4 py-2 rounded-lg font-semibold border text-sm ${actionType === 'disable' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-[#EDF7F1] text-[#2F855A] border-[#C6F6D5]'}`}
                  >
                    {actionType === 'disable' ? 'Disable campaign' : 'Enable campaign'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
