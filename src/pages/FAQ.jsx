import { motion } from 'framer-motion'
import { ChevronDown, HelpCircle, MessageCircle, Search } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const faqCategories = [
    {
      category: 'For Donors',
      icon: '💚',
      questions: [
        {
          question: 'How do I donate to a campaign?',
          answer: 'Browse our campaigns page, select a cause you want to support, click "View & Support", and follow the secure payment process. You\'ll receive an instant receipt via email after your donation is complete.'
        },
        {
          question: 'Is my donation secure?',
          answer: 'Yes, absolutely. We use industry-standard encryption and partner with Razorpay, a trusted payment gateway. Your financial information is never stored on our servers and all transactions are secured with SSL certificates.'
        },
        {
          question: 'Can I get a tax receipt?',
          answer: 'Currently, we issue donation receipts that you can download from your dashboard. We\'re working on obtaining 80G certification to make donations tax-deductible. Stay tuned for updates!'
        },
        {
          question: 'How do I know my donation is being used properly?',
          answer: 'Every campaign provides regular updates on fund utilization. We require campaign creators to submit receipts and proof of expenditure. You can track the impact of your donation through your dashboard and receive email updates.'
        },
        {
          question: 'Can I donate anonymously?',
          answer: 'Yes, you can choose to make your donation anonymous during the payment process. Your name will not be displayed publicly, though we still require your contact information for receipt purposes.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept credit cards, debit cards, UPI, net banking, and digital wallets through our payment partner Razorpay. All major Indian payment methods are supported.'
        }
      ]
    },
    {
      category: 'For Campaign Creators',
      icon: '🎯',
      questions: [
        {
          question: 'How do I start a campaign?',
          answer: 'Contact us at support@givingforward.org with details about your cause. Our team will guide you through the documentation process, verify your information, and help you create a compelling campaign story.'
        },
        {
          question: 'What documents do I need?',
          answer: 'You\'ll need: (1) Valid government-issued ID, (2) Supporting documents for your cause (medical reports, fee receipts, etc.), (3) Bank account details, (4) Photos or videos related to your campaign, (5) Contact information for verification calls.'
        },
        {
          question: 'How long does verification take?',
          answer: 'Campaign verification typically takes 3-5 business days. Our team reviews documents, conducts verification calls, and ensures all information is accurate before publishing your campaign.'
        },
        {
          question: 'When will I receive the funds?',
          answer: 'Funds are transferred to your registered bank account once your campaign reaches its goal, or at predetermined milestones for ongoing medical treatments. The transfer usually takes 3-5 business days after approval.'
        },
        {
          question: 'Are there any fees?',
          answer: 'We charge a small platform fee (5-7%) to cover operational costs, payment gateway charges, and verification processes. This is clearly disclosed upfront and helps us maintain a trusted platform.'
        },
        {
          question: 'Can I edit my campaign after it goes live?',
          answer: 'You can request updates to your campaign description, add new photos, or post progress updates. Major changes like target amounts require admin approval to maintain transparency with existing donors.'
        }
      ]
    },
    {
      category: 'About Trust & Safety',
      icon: '🛡️',
      questions: [
        {
          question: 'How do you verify campaigns?',
          answer: 'Every campaign undergoes: (1) Document verification, (2) ID and background checks, (3) Phone/video verification calls, (4) Supporting document validation, (5) Bank account verification. We reject campaigns that don\'t meet our standards.'
        },
        {
          question: 'What if a campaign is fraudulent?',
          answer: 'Report suspicious campaigns immediately via the "Report" button or email us. We investigate all reports within 24 hours. If fraud is confirmed, the campaign is removed, funds are refunded to donors, and legal action may be pursued.'
        },
        {
          question: 'How do you ensure fund transparency?',
          answer: 'Campaign creators must submit: (1) Regular progress updates with photos, (2) Receipts and bills for expenditure, (3) Milestone reports for long-term campaigns. All this information is shared with donors who supported the campaign.'
        },
        {
          question: 'Can I request a refund?',
          answer: 'Refund requests are handled case-by-case. If a campaign is found to be fraudulent, full refunds are issued. For other situations, contact support@givingforward.org within 7 days of donation to discuss your concern.'
        }
      ]
    },
    {
      category: 'Technical & Account',
      icon: '⚙️',
      questions: [
        {
          question: 'Do I need an account to donate?',
          answer: 'No, you can donate as a guest. However, creating an account lets you track your donation history, receive campaign updates, download receipts, and manage your giving preferences.'
        },
        {
          question: 'I forgot my password. How do I reset it?',
          answer: 'Click "Forgot Password" on the login page, enter your email, and we\'ll send you a reset link. The link is valid for 1 hour. If you don\'t receive the email, check your spam folder or contact support.'
        },
        {
          question: 'How do I update my profile information?',
          answer: 'Log in to your account, go to Dashboard, and click on your profile section. You can update your name, email, and preferences. Email changes require verification for security.'
        },
        {
          question: 'Can I delete my account?',
          answer: 'Yes, you can request account deletion by contacting support@givingforward.org. Note that donation history and receipts will be retained for legal and tax purposes as per regulations.'
        },
        {
          question: 'I\'m having payment issues. What should I do?',
          answer: 'First, check your internet connection and card limits. If the issue persists, try a different payment method or browser. Contact support@givingforward.org with your order ID and error message for assistance.'
        }
      ]
    }
  ]

  const filteredFAQs = faqCategories.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q =>
      searchQuery === '' ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0)

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`
    setOpenIndex(openIndex === key ? null : key)
  }

  return (
    <div className="min-h-screen calm-bg">
      <div className="section-container">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 bg-[#EDF7F1] px-4 py-2 rounded-full mb-4">
            <HelpCircle className="w-5 h-5 text-[#2F855A]" />
            <span className="text-sm font-semibold text-[#2F855A]">Help Center</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#1F2937] mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-[#6B7280] max-w-3xl mx-auto mb-8">
            Find answers to common questions about donations, campaigns, and how GivingForward works.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-lg border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#2F855A] text-[#1F2937] placeholder-[#9CA3AF]"
              />
            </div>
          </div>
        </motion.div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredFAQs.map((category, catIndex) => (
            <motion.div
              key={catIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * catIndex }}
              className="trust-card p-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl">{category.icon}</span>
                <h2 className="text-2xl font-bold text-[#1F2937]">{category.category}</h2>
              </div>

              <div className="space-y-3">
                {category.questions.map((item, qIndex) => {
                  const key = `${catIndex}-${qIndex}`
                  const isOpen = openIndex === key

                  return (
                    <div
                      key={qIndex}
                      className="border border-[#E5E7EB] rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleQuestion(catIndex, qIndex)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-[#F9FAF9] transition-colors"
                      >
                        <span className="font-semibold text-[#1F2937] pr-4">
                          {item.question}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-[#6B7280] flex-shrink-0 transition-transform ${
                            isOpen ? 'transform rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-[#E5E7EB] bg-[#F9FAF9]"
                        >
                          <p className="p-4 text-[#4B5563] leading-relaxed">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredFAQs.length === 0 && searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="trust-card p-12 text-center"
          >
            <Search className="w-16 h-16 text-[#E5E7EB] mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-[#1F2937] mb-2">
              No results found
            </h3>
            <p className="text-[#6B7280] mb-6">
              Try different keywords or browse all questions by clearing your search.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="btn-secondary"
            >
              Clear Search
            </button>
          </motion.div>
        )}

        {/* Still Have Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="trust-card p-8 text-center mt-12"
        >
          <MessageCircle className="w-12 h-12 text-[#2F855A] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1F2937] mb-3">
            Still Have Questions?
          </h2>
          <p className="text-[#6B7280] mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help. 
            Reach out and we'll get back to you within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:support@givingforward.org" className="donate-btn">
              Email Support
            </a>
            <Link to="/how-it-works" className="btn-secondary">
              Learn How It Works
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default FAQ
