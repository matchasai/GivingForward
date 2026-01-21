import axios from 'axios'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'

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
      console.error(err)
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
      console.error(err)
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
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Admin: Users</h1>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <input
            className="bg-white/10 border border-white/20 rounded-lg p-3 text-white"
            placeholder="Search name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="bg-white/10 border border-white/20 rounded-lg p-3 text-white"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <select
            className="bg-white/10 border border-white/20 rounded-lg p-3 text-white"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="createdAt,desc">Newest</option>
            <option value="createdAt,asc">Oldest</option>
            <option value="name,asc">Name A-Z</option>
            <option value="name,desc">Name Z-A</option>
          </select>
          <select
            className="bg-white/10 border border-white/20 rounded-lg p-3 text-white"
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
          <button className="glass-button" onClick={() => { setPage(0); loadUsers() }}>Apply</button>
        </div>
      </motion.div>

      {/* Error Modal */}
      {errorModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <div className="text-red-600 font-bold mb-2">Error</div>
            <div className="mb-4 text-gray-800">{errorModal}</div>
            <button className="glass-button" onClick={() => setErrorModal(null)}>Close</button>
          </motion.div>
        </div>
      )}

      {/* Create / Update Form */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <h2 className="text-xl text-white font-semibold mb-4">{form.id ? 'Update User' : 'Create User'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            className="bg-white/10 border border-white/20 rounded-lg p-3 text-white"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="bg-white/10 border border-white/20 rounded-lg p-3 text-white"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="bg-white/10 border border-white/20 rounded-lg p-3 text-white"
            placeholder={form.id ? 'New Password (optional)' : 'Password'}
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required={!form.id}
          />
          <select
            className="bg-white/10 border border-white/20 rounded-lg p-3 text-white"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <div className="md:col-span-4 flex gap-3">
            <button disabled={submitting} className="glass-button">
              {form.id ? 'Update' : 'Create'}
            </button>
            {form.id && (
              <button
                type="button"
                className="glass-button bg-gray-500/20"
                onClick={() => setForm(emptyForm)}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </motion.div>

      {/* Users Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <h2 className="text-xl text-white font-semibold mb-4">All Users</h2>
        {loading ? (
          <div className="text-gray-300">Loading...</div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full text-sm text-gray-200">
              <thead>
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
                  <tr key={u.id} className="border-t border-white/10">
                    <td className="p-2">{page * size + idx + 1}</td>
                    <td className="p-2">{u.name}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.role}</td>
                    <td className="p-2 flex gap-2">
                      <button className="glass-button bg-blue-500/20" onClick={() => onEdit(u)}>Edit</button>
                      <button className="glass-button bg-red-500/20" onClick={() => handleDeleteClick(u)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 text-gray-300">
              <button
                disabled={page === 0}
                className="glass-button disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                Previous
              </button>
              <span>Page {page + 1} of {Math.max(1, totalPages)}</span>
              <button
                disabled={page + 1 >= totalPages}
                className="glass-button disabled:opacity-50"
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Error Modal */}
      {errorModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[60]" onClick={() => setErrorModal(null)}>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.322 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cannot Delete User</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{errorModal}</p>
              <div className="flex gap-3 justify-center">
                <button 
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-lg hover:shadow-xl"
                  onClick={() => setErrorModal(null)}
                >
                  I Understand
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-red-900/90 backdrop-blur-sm border border-red-500/30 rounded-lg p-6 max-w-md w-full text-center"
          >
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Delete User</h3>
            <p className="text-gray-300 mb-2">Are you sure you want to permanently delete:</p>
            <p className="text-white font-semibold mb-4">{selectedUser.name} ({selectedUser.email})</p>
            <p className="text-red-300 text-sm mb-6">⚠️ This action cannot be undone!</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setSelectedUser(null)
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
          </motion.div>
        </div>
      )}
    </div>
  )
}
