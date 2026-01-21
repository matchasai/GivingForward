import axios from 'axios'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const emptyForm = { id: null, name: '', email: '', password: '', role: 'USER' }

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [sort, setSort] = useState('createdAt,desc')
  const [errorModal, setErrorModal] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Fetch Users
  const loadUsers = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, size, sort }
      if (search) params.search = search
      if (roleFilter) params.role = roleFilter
      const res = await axios.get('/api/admin/users', { params })
      const data = res.data
      setUsers(data.content || [])
      setTotalPages(data.totalPages || 0)
    } catch (err) {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [page, roleFilter, search, size, sort])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  // Create / Update User
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (form.id) {
        await axios.put(`/api/admin/users/${form.id}`, {
          name: form.name,
          email: form.email,
          password: form.password || undefined,
          role: form.role,
        })
      } else {
        await axios.post('/api/admin/users', {
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        })
      }
      setForm(emptyForm)
      await loadUsers()
    } catch (err) {
      toast.error('Failed to save user')
    } finally {
      setSubmitting(false)
    }
  }

  const onEdit = (u) => {
    setForm({ id: u.id, name: u.name, email: u.email, password: '', role: u.role })
  }

  // Delete Flow
  const handleDeleteClick = (user) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!selectedUser) return
    
    try {
      await axios.delete(`/api/admin/users/${selectedUser.id}`)
      setShowDeleteModal(false)
      setSelectedUser(null)
      await loadUsers()
    } catch (err) {
      setShowDeleteModal(false)
      setSelectedUser(null)
      
      // More specific error handling
      if (err.response) {
        const errorReason = err.response.headers['x-error-reason'];
        
        let errorMessage = '';
        if (err.response.status === 404) {
          errorMessage = 'User not found. It may have already been deleted.';
        } else if (err.response.status === 409) {
          errorMessage = errorReason || 'Cannot delete user: User has donations and cannot be deleted.';
        } else if (err.response.status === 500) {
          errorMessage = errorReason || 'Server error occurred while deleting user. Please try again.';
        } else {
          errorMessage = errorReason || `Failed to delete user: ${err.response.status} error.`;
        }
        
        setErrorModal(errorMessage);
      } else if (err.request) {
        setErrorModal('Network error. Please check your connection and try again.')
      } else {
        setErrorModal('Failed to delete user. Please try again.')
      }
    }
  }

  return (
    <div className="space-y-8 calm-bg section-container">
      <div>
        <p className="text-sm font-semibold text-[#2F855A]">Admin tools</p>
        <h1 className="text-3xl font-bold text-[#1F2937]">Users</h1>
        <p className="text-[#6B7280] mt-1">Manage user access, roles, and invitations.</p>
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="trust-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <input
            className="bg-white border border-[#E5E7EB] rounded-lg p-3 text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2F855A]"
            placeholder="Search name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="bg-white border border-[#E5E7EB] rounded-lg p-3 text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#2F855A]"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <select
            className="bg-white border border-[#E5E7EB] rounded-lg p-3 text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#2F855A]"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="createdAt,desc">Newest</option>
            <option value="createdAt,asc">Oldest</option>
            <option value="name,asc">Name A-Z</option>
            <option value="name,desc">Name Z-A</option>
          </select>
          <select
            className="bg-white border border-[#E5E7EB] rounded-lg p-3 text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#2F855A]"
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value))
              setPage(0)
            }}
          >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
          <button className="donate-btn" onClick={() => { setPage(0); loadUsers() }}>Apply</button>
        </div>
      </motion.div>

      {/* Error Modal */}
      {errorModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 px-4">
          <motion.div initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="trust-card max-w-sm w-full text-center">
            <div className="text-red-600 font-bold mb-2">Error</div>
            <div className="mb-4 text-[#1F2937]">{errorModal}</div>
            <button className="btn-secondary" onClick={() => setErrorModal(null)}>Close</button>
          </motion.div>
        </div>
      )}

      {/* Create / Update Form */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="trust-card p-6">
        <h2 className="text-xl text-[#1F2937] font-semibold mb-4">{form.id ? 'Update user' : 'Create user'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            className="bg-white border border-[#E5E7EB] rounded-lg p-3 text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2F855A]"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="bg-white border border-[#E5E7EB] rounded-lg p-3 text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2F855A]"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="bg-white border border-[#E5E7EB] rounded-lg p-3 text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2F855A]"
            placeholder={form.id ? 'New password (optional)' : 'Password'}
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required={!form.id}
          />
          <select
            className="bg-white border border-[#E5E7EB] rounded-lg p-3 text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#2F855A]"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <div className="md:col-span-4 flex gap-3">
            <button disabled={submitting} className="donate-btn disabled:opacity-50">
              {form.id ? 'Update' : 'Create'}
            </button>
            {form.id && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setForm(emptyForm)}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </motion.div>

      {/* Users Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="trust-card p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm font-semibold text-[#2F855A]">Roster</p>
            <h2 className="text-xl text-[#1F2937] font-semibold">All users</h2>
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
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Role</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr key={u.id} className="border-t border-[#E5E7EB]">
                    <td className="p-2">{page * size + idx + 1}</td>
                    <td className="p-2 font-medium">{u.name}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.role}</td>
                    <td className="p-2 flex flex-wrap gap-2">
                      <button className="btn-secondary" onClick={() => onEdit(u)}>Edit</button>
                      <button className="px-3 py-2 rounded-lg font-semibold border border-red-200 text-red-700 bg-red-50" onClick={() => handleDeleteClick(u)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 text-[#6B7280]">
              <button
                disabled={page === 0}
                className="btn-secondary disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                Previous
              </button>
              <span>Page {page + 1} of {Math.max(1, totalPages)}</span>
              <button
                disabled={page + 1 >= totalPages}
                className="btn-secondary disabled:opacity-50"
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Error Modal (delete) */}
      {errorModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[60] bg-black/40" onClick={() => setErrorModal(null)}>
          <motion.div 
            initial={{ scale: 0.97, opacity: 0, y: 10 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            className="trust-card max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.322 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1F2937] mb-2">Cannot delete user</h3>
              <p className="text-[#4B5563] mb-6 leading-relaxed">{errorModal}</p>
              <div className="flex gap-3 justify-center">
                <button 
                  className="px-6 py-3 rounded-lg font-semibold border border-red-200 text-red-700 bg-red-50"
                  onClick={() => setErrorModal(null)}
                >
                  I understand
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 px-4">
          <motion.div
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="trust-card max-w-md w-full"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#1F2937]">Delete user</h3>
                <p className="text-[#4B5563] mt-1">This action cannot be undone.</p>
                <p className="text-[#111827] font-semibold mt-2">{selectedUser.name} ({selectedUser.email})</p>
                <div className="flex gap-3 justify-end mt-4">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false)
                      setSelectedUser(null)
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
    </div>
  )
}
