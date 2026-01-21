import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, Check, Trash2, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

const NotificationBell = () => {
  const { token } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchUnreadCount = useCallback(async () => {
    if (!token) return
    try {
      const { data } = await axios.get('/api/notifications/unread/count')
      setUnreadCount(data.count || 0)
    } catch (error) {
      if (error?.response?.status === 401) {
        // Unauthenticated: treat as zero and stop showing noisy errors
        setUnreadCount(0)
        return
      }
      setUnreadCount(0)
    }
  }, [token])

  useEffect(() => {
    if (!token) {
      setUnreadCount(0)
      return
    }
    fetchUnreadCount()
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [token, fetchUnreadCount])

  const fetchNotifications = async () => {
    if (!token) return
    setLoading(true)
    try {
      const { data } = await axios.get('/api/notifications')
      setNotifications(data)
    } catch (error) {
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleDropdown = () => {
    if (!showDropdown) {
      fetchNotifications()
    }
    setShowDropdown(!showDropdown)
  }

  const markAsRead = async (id) => {
    try {
      await axios.patch(`/api/notifications/${id}/read`)
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ))
      setUnreadCount(Math.max(0, unreadCount - 1))
    } catch (error) {
      toast.error('Failed to mark as read')
    }
  }

  const markAllAsRead = async () => {
    try {
      await axios.post('/api/notifications/read-all')
      setNotifications(notifications.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
      toast.success('All notifications marked as read')
    } catch (error) {
      toast.error('Failed to mark all as read')
    }
  }

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`/api/notifications/${id}`)
      const deleted = notifications.find(n => n.id === id)
      setNotifications(notifications.filter(n => n.id !== id))
      if (!deleted.read) {
        setUnreadCount(Math.max(0, unreadCount - 1))
      }
      toast.success('Notification deleted')
    } catch (error) {
      toast.error('Failed to delete notification')
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = Math.floor((now - date) / 1000) // seconds

    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={handleToggleDropdown}
        className="relative p-2 rounded-full hover:bg-[#F3F4F6] transition-colors border border-transparent focus:outline-none focus:ring-2 focus:ring-[#2F855A]/40"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-[#1F2937]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#2F855A] text-white text-[11px] font-semibold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />

            {/* Dropdown Content */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl z-50 overflow-hidden border border-[#E5E7EB]"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-[#F9FAF9]">
                <h3 className="text-lg font-semibold text-[#1F2937]">Notifications</h3>
                <button
                  onClick={() => setShowDropdown(false)}
                  className="p-1 hover:bg-[#E5E7EB] rounded transition-colors"
                >
                  <X className="w-5 h-5 text-[#4B5563]" />
                </button>
              </div>

              {/* Actions */}
              {notifications.length > 0 && (
                <div className="flex items-center justify-between p-2 bg-[#F9FAF9] border-b">
                  <span className="text-sm text-[#4B5563]">
                    {unreadCount} unread
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-[#2F855A] hover:text-[#276749] font-semibold"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
              )}

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="w-8 h-8 border-4 border-[#2F855A] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <Bell className="w-12 h-12 text-[#D1D5DB] mx-auto mb-3" />
                    <p className="text-[#6B7280]">No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 transition-colors ${
                          !notification.read ? 'bg-[#F0FDF4]' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${!notification.read ? 'font-semibold text-[#1F2937]' : 'text-[#4B5563]'}`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-[#6B7280] mt-1">
                              {formatTime(notification.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 rounded-full bg-[#EDF7F1] text-[#2F855A] hover:bg-[#E3F2EB] transition-colors"
                                title="Mark as read"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NotificationBell
