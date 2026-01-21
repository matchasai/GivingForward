import { useEffect, useState } from 'react'

export default function GlobalError() {
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const handler = (e) => {
      setMessage(e.detail?.message || 'An error occurred')
      // auto hide after 5s
      setTimeout(() => setMessage(null), 5000)
    }
    window.addEventListener('app:error', handler)
    return () => window.removeEventListener('app:error', handler)
  }, [])

  if (!message) return null
  return (
    <div className="fixed top-0 inset-x-0 z-50 p-3">
      <div className="max-w-3xl mx-auto bg-red-600/90 text-white px-4 py-3 rounded shadow">
        {message}
      </div>
    </div>
  )
}


