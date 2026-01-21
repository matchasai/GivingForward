import axios from 'axios'
import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setIsSubmitting(true)
    
    try {
      await axios.post('/api/account/password-reset/request', { email })
      setIsSubmitted(true)
      toast.success('Password reset link sent to your email')
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error('No account found with this email address')
      } else {
        toast.error('Failed to send password reset email. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen calm-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="trust-card p-8 w-full max-w-md"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-[#EDF7F1] text-[#2F855A] rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-[#1F2937] mb-4">Check your email</h2>
            <p className="text-[#6B7280] mb-4">
              We&apos;ve sent a password reset link to <strong className="text-[#1F2937]">{email}</strong>.
            </p>
            <p className="text-sm text-[#6B7280] mb-6">
              Didn&apos;t receive it? Check spam or try again in a few minutes.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setIsSubmitted(false)
                  setEmail('')
                }}
                className="w-full btn-secondary"
              >
                Try different email
              </button>
              <Link to="/login" className="block w-full donate-btn text-center">
                Back to login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen calm-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="trust-card p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#EDF7F1] text-[#2F855A] rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-[#1F2937] mb-2">Forgot password?</h2>
          <p className="text-[#6B7280]">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#1F2937] mb-2">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2F855A] focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full donate-btn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-[#2F855A] hover:text-[#276749] text-sm font-medium">
            Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  )
}