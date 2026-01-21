import { motion } from 'framer-motion'
import { Award, CheckCircle, Heart, Shield, Target, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

const AboutUs = () => {
  const values = [
    {
      icon: Shield,
      title: 'Transparency',
      description: 'Every rupee is tracked. We believe donors deserve to know exactly where their money goes.',
      color: '#2F855A',
      bgColor: '#EDF7F1'
    },
    {
      icon: Heart,
      title: 'Compassion',
      description: 'We connect genuine needs with generous hearts, building a community of care.',
      color: '#DB2777',
      bgColor: '#FCE7F3'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Together, we create lasting change. No act of kindness is too small.',
      color: '#1D4ED8',
      bgColor: '#E0E7FF'
    },
    {
      icon: CheckCircle,
      title: 'Integrity',
      description: 'We verify every campaign rigorously. Trust is earned, not assumed.',
      color: '#CA8A04',
      bgColor: '#FEF3C7'
    }
  ]

  const milestones = [
    { year: '2024', event: 'GivingForward founded with a mission to rebuild trust in online fundraising' },
    { year: '2025', event: 'Launched platform with end-to-end verification process' },
    { year: '2026', event: 'Helped 100+ families through medical and educational campaigns' }
  ]

  return (
    <div className="min-h-screen calm-bg">
      <div className="section-container">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-[#EDF7F1] px-4 py-2 rounded-full mb-4">
            <Heart className="w-5 h-5 text-[#2F855A]" fill="#2F855A" />
            <span className="text-sm font-semibold text-[#2F855A]">Our Story</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#1F2937] mb-6">
            About GivingForward
          </h1>
          <p className="text-xl text-[#6B7280] max-w-3xl mx-auto leading-relaxed">
            We're building a crowdfunding platform where transparency isn't just a promise—it's how we operate. 
            Every campaign is verified. Every donation is tracked. Every story is real.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="trust-card p-8 mb-12 text-center"
        >
          <Target className="w-12 h-12 text-[#2F855A] mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-[#1F2937] mb-4">Our Mission</h2>
          <p className="text-lg text-[#4B5563] max-w-3xl mx-auto leading-relaxed">
            To create a trusted platform where genuine needs meet generous hearts. We believe in the power 
            of community to transform lives, and we're committed to making every donation count through 
            rigorous verification, complete transparency, and unwavering accountability.
          </p>
        </motion.div>

        {/* Core Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[#2F855A] mb-2">What Drives Us</p>
            <h2 className="text-3xl font-bold text-[#1F2937]">Our Core Values</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="trust-card p-6 card-lift"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: value.bgColor }}
                >
                  <value.icon className="w-8 h-8" style={{ color: value.color }} />
                </div>
                <h3 className="text-2xl font-bold text-[#1F2937] mb-3">{value.title}</h3>
                <p className="text-[#6B7280] leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How We Work */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="trust-card p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-[#1F2937] mb-6 text-center">How We Ensure Trust</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#EDF7F1] text-[#2F855A] rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-[#1F2937] mb-2">Rigorous Verification</h3>
              <p className="text-sm text-[#6B7280]">
                Every campaign undergoes document checks, ID verification, and background validation before going live.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#E0E7FF] text-[#1D4ED8] rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-[#1F2937] mb-2">Real-time Tracking</h3>
              <p className="text-sm text-[#6B7280]">
                Donors receive regular updates with receipts, photos, and progress reports on how funds are being used.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#FEF3C7] text-[#CA8A04] rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-[#1F2937] mb-2">Ongoing Accountability</h3>
              <p className="text-sm text-[#6B7280]">
                Campaign creators must provide proof of expenditure and regular status updates until completion.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[#2F855A] mb-2">Our Journey</p>
            <h2 className="text-3xl font-bold text-[#1F2937]">Milestones</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0 w-16 h-16 bg-[#EDF7F1] text-[#2F855A] rounded-full flex items-center justify-center font-bold">
                  {milestone.year}
                </div>
                <div className="flex-1 trust-card p-4">
                  <p className="text-[#4B5563]">{milestone.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.2 }}
          className="trust-card p-8 text-center mb-12"
        >
          <Award className="w-12 h-12 text-[#2F855A] mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-[#1F2937] mb-4">Built by People Who Care</h2>
          <p className="text-[#6B7280] max-w-2xl mx-auto mb-6">
            Our team includes social workers, technologists, and volunteers who believe in using technology 
            to create positive social impact. We're not just building a platform—we're building trust.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.4 }}
          className="trust-card p-8 text-center"
        >
          <h2 className="text-3xl font-bold text-[#1F2937] mb-4">Join Our Community</h2>
          <p className="text-[#6B7280] mb-6 max-w-2xl mx-auto">
            Whether you want to support a cause or need help yourself, you're in the right place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/campaigns" className="donate-btn">
              Browse Campaigns
            </Link>
            <Link to="/contact" className="btn-secondary">
              Get In Touch
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AboutUs
