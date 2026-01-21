import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Heart, Search, Shield, TrendingUp, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: 'Browse Campaigns',
      description: 'Explore verified campaigns across categories like medical, education, disaster relief, and more. Every campaign is reviewed and authenticated by our team.',
      color: '#2F855A',
      bgColor: '#EDF7F1'
    },
    {
      icon: Heart,
      title: 'Choose & Donate',
      description: 'Select a cause close to your heart. Make a secure donation using our encrypted payment gateway. Every rupee is tracked from start to finish.',
      color: '#1D4ED8',
      bgColor: '#E0E7FF'
    },
    {
      icon: TrendingUp,
      title: 'Track Impact',
      description: 'Receive updates on how your donation is making a difference. See real-time progress, milestones achieved, and stories of impact.',
      color: '#CA8A04',
      bgColor: '#FEF3C7'
    }
  ]

  const benefits = [
    {
      icon: Shield,
      title: 'Verified Campaigns',
      description: 'Every campaign undergoes strict verification including document checks, ID verification, and background validation.'
    },
    {
      icon: CheckCircle,
      title: 'Complete Transparency',
      description: 'Track every rupee with detailed fund utilization reports, receipts, and regular progress updates from campaign owners.'
    },
    {
      icon: Users,
      title: 'Community Trust',
      description: 'Join thousands of donors who trust us. Read reviews, success stories, and see the real impact of contributions.'
    }
  ]

  return (
    <div className="min-h-screen calm-bg">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="section-container"
      >
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-[#2F855A] mb-2">Simple, Transparent, Impactful</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#1F2937] mb-4">How GivingForward Works</h1>
          <p className="text-lg text-[#6B7280] max-w-3xl mx-auto">
            Making generosity simple and trustworthy. Here's how your donation creates real change.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="trust-card p-8 text-center relative card-lift"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-white border-4 border-[#F9FAF9] flex items-center justify-center">
                <span className="text-xl font-bold text-[#2F855A]">{index + 1}</span>
              </div>
              
              <div
                className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center mt-4"
                style={{ backgroundColor: step.bgColor }}
              >
                <step.icon className="w-10 h-10" style={{ color: step.color }} />
              </div>
              
              <h3 className="text-2xl font-bold text-[#1F2937] mb-3">{step.title}</h3>
              <p className="text-[#6B7280] leading-relaxed">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="w-8 h-8 text-[#E5E7EB]" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Why Trust Us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[#2F855A] mb-2">Trust & Safety</p>
            <h2 className="text-3xl font-bold text-[#1F2937] mb-4">Why Donors Trust Us</h2>
            <p className="text-[#6B7280] max-w-2xl mx-auto">
              We've built a platform where transparency isn't optional—it's fundamental.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + 0.1 * index }}
                className="trust-card p-6 card-lift"
              >
                <div className="w-16 h-16 bg-[#EDF7F1] text-[#2F855A] rounded-full flex items-center justify-center mb-4">
                  <benefit.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#1F2937] mb-3">{benefit.title}</h3>
                <p className="text-[#6B7280] leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* For Campaign Creators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="trust-card p-8 mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-sm font-semibold text-[#2F855A] mb-2">Start a Campaign</p>
              <h2 className="text-3xl font-bold text-[#1F2937] mb-4">Need to Raise Funds?</h2>
              <p className="text-[#6B7280] mb-6">
                If you're facing a crisis—medical emergency, educational expenses, or community needs—
                we can help you reach compassionate donors. Our team will guide you through the process.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#2F855A] flex-shrink-0 mt-0.5" />
                  <span className="text-[#4B5563]">Submit your story and supporting documents</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#2F855A] flex-shrink-0 mt-0.5" />
                  <span className="text-[#4B5563]">Our team verifies and reviews your campaign</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#2F855A] flex-shrink-0 mt-0.5" />
                  <span className="text-[#4B5563]">Once approved, your campaign goes live</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#2F855A] flex-shrink-0 mt-0.5" />
                  <span className="text-[#4B5563]">Share with your network and receive donations</span>
                </li>
              </ul>
              <a href="mailto:support@givingforward.org" className="donate-btn inline-flex items-center gap-2">
                Contact Us to Start
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            
            <div className="bg-[#F9FAF9] rounded-lg p-8 border border-[#E5E7EB]">
              <h3 className="text-xl font-bold text-[#1F2937] mb-4">Campaign Requirements</h3>
              <ul className="space-y-3 text-sm text-[#6B7280]">
                <li className="flex items-start space-x-2">
                  <span className="text-[#2F855A] font-bold">•</span>
                  <span>Valid government-issued ID proof</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#2F855A] font-bold">•</span>
                  <span>Supporting documents (medical reports, fee receipts, etc.)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#2F855A] font-bold">•</span>
                  <span>Clear campaign story explaining the need</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#2F855A] font-bold">•</span>
                  <span>Photos/videos related to the campaign</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#2F855A] font-bold">•</span>
                  <span>Bank account details for fund transfer</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#2F855A] font-bold">•</span>
                  <span>Contact information for verification</span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-[#EDF7F1] rounded-lg">
                <p className="text-xs text-[#2F855A] font-medium">
                  <Shield className="w-4 h-4 inline mr-1" />
                  All information is kept confidential and used only for verification purposes.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1 }}
          className="trust-card p-8 text-center"
        >
          <h2 className="text-3xl font-bold text-[#1F2937] mb-4">Ready to Make a Difference?</h2>
          <p className="text-[#6B7280] mb-6 max-w-2xl mx-auto">
            Browse campaigns and support a cause today. Your generosity can change lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/campaigns" className="donate-btn">
              Browse All Campaigns
            </Link>
            <Link to="/success-stories" className="btn-secondary">
              View Success Stories
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default HowItWorks
