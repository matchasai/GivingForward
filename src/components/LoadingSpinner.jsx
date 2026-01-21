import { motion } from 'framer-motion'

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen calm-bg flex items-center justify-center">
      <motion.div
        className="w-12 h-12 border-4 border-[#C6F6D5] border-t-[#2F855A] rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

export default LoadingSpinner 