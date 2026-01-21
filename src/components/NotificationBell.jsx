import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, Check, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUnreadCount()
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchUnreadCount = async () => {
    try {
      const { data } = await axios.get('/api/notifications/unread/count')
      setUnreadCount(data.count || 0)
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    }
  }

  const fetchNotifications = async () => {
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
        className="relative p-2 hover:bg-white/10 rounded-full transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
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
              className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-600 to-blue-600">
                <h3 className="text-lg font-semibold text-white">Notifications</h3>
                <button
                  onClick={() => setShowDropdown(false)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Actions */}
              {notifications.length > 0 && (
                <div className="flex items-center justify-between p-2 bg-gray-50 border-b">
                  <span className="text-sm text-gray-600">
                    {unreadCount} unread
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
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
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 transition-colors ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatTime(notification.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                                title="Mark as read"
                              >
                                <Check className="w-4 h-4 text-green-600" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 hover:bg-gray-200 rounded transition-colors"
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
