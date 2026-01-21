import { motion } from 'framer-motion'
import { Lock, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

const Privacy = () => {
  return (
    <div className="min-h-screen calm-bg">
      <div className="section-container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-[#EDF7F1] px-4 py-2 rounded-full mb-4">
              <Lock className="w-5 h-5 text-[#2F855A]" />
              <span className="text-sm font-semibold text-[#2F855A]">Privacy</span>
            </div>
            <h1 className="text-4xl font-bold text-[#1F2937] mb-4">Privacy Policy</h1>
            <p className="text-[#6B7280]">Last updated: January 21, 2026</p>
          </div>

          <div className="trust-card p-8 prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-[#1F2937] mb-4">1. Information We Collect</h2>
            <h3 className="text-xl font-semibold text-[#1F2937] mb-3">Personal Information:</h3>
            <ul className="list-disc pl-6 text-[#4B5563] space-y-2 mb-6">
              <li>Name, email address, phone number</li>
              <li>Payment information (processed securely through Razorpay)</li>
              <li>Address and location data</li>
              <li>Profile information and preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#1F2937] mb-3">For Campaign Creators:</h3>
            <ul className="list-disc pl-6 text-[#4B5563] space-y-2 mb-6">
              <li>Government-issued ID and verification documents</li>
              <li>Bank account details for fund transfer</li>
              <li>Supporting documents for campaign validation</li>
              <li>Photos and videos related to campaigns</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#1F2937] mb-3">Usage Data:</h3>
            <ul className="list-disc pl-6 text-[#4B5563] space-y-2 mb-6">
              <li>Browser type, IP address, device information</li>
              <li>Pages visited, time spent on site, click behavior</li>
              <li>Referring/exit pages and URLs</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#1F2937] mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-[#4B5563] space-y-2 mb-6">
              <li>Process donations and campaign transactions</li>
              <li>Verify campaigns and prevent fraud</li>
              <li>Send donation receipts and campaign updates</li>
              <li>Improve platform functionality and user experience</li>
              <li>Communicate important platform changes or security issues</li>
              <li>Comply with legal requirements and regulations</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#1F2937] mb-4">3. Information Sharing</h2>
            <p className="text-[#4B5563] leading-relaxed mb-4">
              We <strong>do not sell</strong> your personal information. We share data only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-[#4B5563] space-y-2 mb-6">
              <li><strong>Payment Processing:</strong> With Razorpay for secure payment transactions</li>
              <li><strong>Campaign Information:</strong> Donor names may be visible to campaign creators (unless anonymous donation)</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or government authorities</li>
              <li><strong>Fraud Prevention:</strong> With law enforcement in cases of verified fraud</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#1F2937] mb-4">4. Data Security</h2>
            <p className="text-[#4B5563] leading-relaxed mb-4">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc pl-6 text-[#4B5563] space-y-2 mb-6">
              <li>SSL/TLS encryption for all data transmission</li>
              <li>Secure password hashing and storage</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Limited employee access to personal data</li>
              <li>Secure backup and disaster recovery procedures</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#1F2937] mb-4">5. Cookies & Tracking</h2>
            <p className="text-[#4B5563] leading-relaxed mb-6">
              We use cookies and similar technologies to enhance your experience, analyze usage patterns, and remember 
              your preferences. You can control cookie settings through your browser, but some features may not work 
              properly if cookies are disabled.
            </p>

            <h2 className="text-2xl font-bold text-[#1F2937] mb-4">6. Your Rights</h2>
            <p className="text-[#4B5563] leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-[#4B5563] space-y-2 mb-6">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data (subject to legal retention requirements)</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing emails (donation receipts and essential communications cannot be opted out)</li>
              <li><strong>Data Portability:</strong> Receive your data in a structured, machine-readable format</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#1F2937] mb-4">7. Data Retention</h2>
            <p className="text-[#4B5563] leading-relaxed mb-6">
              We retain your personal information for as long as your account is active or as needed to provide services. 
              Donation records and receipts are retained for 7 years for tax and legal compliance purposes, even after 
              account deletion.
            </p>

            <h2 className="text-2xl font-bold text-[#1F2937] mb-4">8. Children's Privacy</h2>
            <p className="text-[#4B5563] leading-relaxed mb-6">
              Our platform is not intended for users under 18 years of age. We do not knowingly collect personal information 
              from children. If you believe a child has provided us with personal data, please contact us immediately.
            </p>

            <h2 className="text-2xl font-bold text-[#1F2937] mb-4">9. Third-Party Links</h2>
            <p className="text-[#4B5563] leading-relaxed mb-6">
              Our platform may contain links to external websites. We are not responsible for the privacy practices of these 
              third-party sites. Please review their privacy policies before providing any personal information.
            </p>

            <h2 className="text-2xl font-bold text-[#1F2937] mb-4">10. Changes to This Policy</h2>
            <p className="text-[#4B5563] leading-relaxed mb-6">
              We may update this privacy policy periodically. We will notify users of significant changes via email or 
              prominent notice on our platform. Your continued use after changes constitutes acceptance of the updated policy.
            </p>

            <h2 className="text-2xl font-bold text-[#1F2937] mb-4">11. Contact Us</h2>
            <p className="text-[#4B5563] leading-relaxed">
              For privacy-related questions, data access requests, or to exercise your rights, contact us at{' '}
              <a href="mailto:privacy@givingforward.org" className="text-[#2F855A] hover:underline">
                privacy@givingforward.org
              </a>
              {' '}or visit our <Link to="/contact" className="text-[#2F855A] hover:underline">contact page</Link>.
            </p>
          </div>

          <div className="trust-card p-6 mt-8 bg-[#EDF7F1] border border-[#2F855A]/20">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-[#2F855A] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-[#1F2937] mb-2">Your Privacy Matters</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  We take data protection seriously. Your information is used solely to provide our services and is never 
                  sold to third parties. If you have concerns about how your data is handled, please don't hesitate to 
                  <Link to="/contact" className="text-[#2F855A] hover:underline font-medium"> reach out</Link>.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Privacy
