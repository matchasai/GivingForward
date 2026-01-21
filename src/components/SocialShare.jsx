import { Share2, Facebook, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'

function SocialShare({ url, title, description }) {
  const [copied, setCopied] = useState(false)
  
  const encodedUrl = encodeURIComponent(url)
  const descriptionSnippet = description ? ` - ${description}` : ''
  const encodedTitle = encodeURIComponent(`${title}${descriptionSnippet}`)

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = (platform) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400')
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2 text-white">
        <Share2 className="w-5 h-5" />
        <span className="text-sm font-medium">Share:</span>
      </div>
      
      <div className="flex space-x-2">
        {/* Twitter */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleShare('twitter')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-400/20 hover:bg-blue-400/30 text-blue-400 transition-colors"
          title="Share on Twitter"
        >
          <Twitter className="w-5 h-5" />
        </motion.button>

        {/* Facebook */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleShare('facebook')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-600 transition-colors"
          title="Share on Facebook"
        >
          <Facebook className="w-5 h-5" />
        </motion.button>

        {/* LinkedIn */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleShare('linkedin')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-700/20 hover:bg-blue-700/30 text-blue-700 transition-colors"
          title="Share on LinkedIn"
        >
          <Linkedin className="w-5 h-5" />
        </motion.button>

        {/* Copy Link */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleCopyLink}
          className={`w-10 h-10 flex items-center justify-center rounded-full ${
            copied 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-gray-500/20 hover:bg-gray-500/30 text-gray-300'
          } transition-colors relative`}
          title={copied ? 'Copied!' : 'Copy Link'}
        >
          <LinkIcon className="w-5 h-5" />
          {copied && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs bg-green-500 text-white px-2 py-1 rounded whitespace-nowrap"
            >
              Copied!
            </motion.span>
          )}
        </motion.button>
      </div>
    </div>
  )
}

export default SocialShare
