import { motion } from 'framer-motion'
import { Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("https://formspree.io/f/xnnvvabq", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: new FormData(e.target),
      });

      if (response.ok) {
        toast.success("Message sent successfully!");
        e.target.reset();
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        let data = null;
        try {
          data = await response.json();
        } catch {
          // ignore non-JSON responses
        }

        if (data?.errors?.length) {
          toast.error(
            "Form submission error: " + data.errors.map((err) => err.message).join(", ")
          );
        } else {
          toast.error("Something went wrong. Please try again later.");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen calm-bg">
      <div className="section-container">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 bg-[#EDF7F1] px-4 py-2 rounded-full mb-4">
            <MessageCircle className="w-5 h-5 text-[#2F855A]" />
            <span className="text-sm font-semibold text-[#2F855A]">We're Here to Help</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#1F2937] mb-4">
            Get In Touch
          </h1>
          <p className="text-lg text-[#6B7280] max-w-3xl mx-auto">
            Have questions? Need support? Want to start a campaign? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-6"
          >
            <div className="trust-card p-6">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#EDF7F1] text-[#2F855A] rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1F2937] mb-1">Email</h3>
                    <a href="mailto:support@givingforward.org" className="text-[#6B7280] hover:text-[#2F855A] transition-colors">
                      support@givingforward.org
                    </a>
                    <p className="text-sm text-[#9CA3AF] mt-1">We reply within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#E0E7FF] text-[#1D4ED8] rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1F2937] mb-1">Phone</h3>
                    <a href="tel:+911234567890" className="text-[#6B7280] hover:text-[#2F855A] transition-colors">
                      +91 123 456 7890
                    </a>
                    <p className="text-sm text-[#9CA3AF] mt-1">Mon-Sat, 10 AM - 6 PM IST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#FEF3C7] text-[#CA8A04] rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1F2937] mb-1">Office</h3>
                    <p className="text-[#6B7280]">
                      123 Charity Street<br />
                      Mumbai, Maharashtra<br />
                      India 400001
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="trust-card p-6 bg-[#EDF7F1] border border-[#2F855A]/20">
              <h3 className="font-semibold text-[#1F2937] mb-3">Quick Response</h3>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                For urgent campaign issues or donation concerns, please email us directly 
                with your order/campaign ID for faster assistance.
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="trust-card p-8">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-6">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#1F2937] mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#2F855A] text-[#1F2937] placeholder-[#9CA3AF]"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#1F2937] mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#2F855A] text-[#1F2937] placeholder-[#9CA3AF]"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-[#1F2937] mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#2F855A] text-[#1F2937]"
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="campaign">Start a Campaign</option>
                    <option value="donation">Donation Issue</option>
                    <option value="technical">Technical Support</option>
                    <option value="feedback">Feedback</option>
                    <option value="report">Report a Problem</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#1F2937] mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#2F855A] text-[#1F2937] placeholder-[#9CA3AF] resize-none"
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="donate-btn w-full disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                <p className="text-sm text-[#6B7280] text-center">
                  By submitting this form, you agree to our privacy policy and terms of service.
                </p>
              </form>
            </div>
          </motion.div>
        </div>

        {/* FAQ Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="trust-card p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-[#1F2937] mb-3">Looking for Quick Answers?</h2>
          <p className="text-[#6B7280] mb-6">
            Many common questions are answered in our FAQ section.
          </p>
          <a href="/faq" className="btn-secondary inline-flex">
            Visit FAQ
          </a>
        </motion.div>
      </div>
    </div>
  )
}

export default Contact
