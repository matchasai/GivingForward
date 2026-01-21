import { motion } from 'framer-motion'
import { FileText, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

const Terms = () => {
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
              <FileText className="w-5 h-5 text-[#2F855A]" />
              <span className="text-sm font-semibold text-[#2F855A]">Legal</span>
            </div>
            <h1 className="text-4xl font-bold text-[#1F2937] mb-4">Terms & Conditions</h1>
            <p className="text-[#6B7280]">Last updated: January 21, 2026</p>
          </div>

          <div className="trust-card p-8 prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-[#1F2937] mb-4">1. Acceptance of Terms</h2>
            <p className="text-[#4B5563] leading-relaxed mb-6">
              By accessing and using GivingForward ("the Platform"), you accept and agree to be bound by these Terms and Conditions. 
              If you do not agree to these terms, please do not use our services.
            </p>

            <h2 className="text-2xl font-bold text-[#1F2937] mb-4">2. Platform Services</h2>
            <p className="text-[#4B5563] leading-relaxed mb-6">
              GivingForward provides an online crowdfunding platform that connects campaign creators with donors. 
              We facilitate donations but are not responsible for the ultimate use of funds by campaign creators.
            </p>

            <h2 className="text-2xl font-bold text-[#1F2937] mb-4">3. User Responsibilities</h2>
            <h3 className="text-xl font-semibold text-[#1F2937] mb-3">For Donors:</h3>
            <ul className="list-disc pl-6 text-[#4B5563] space-y-2 mb-4">
              <li>Donations are voluntary and non-refundable except in cases of verified fraud</li>
              <li>You are responsible for verifying campaign information before donating</li>
              <li>Tax deductions are subject to local tax laws and regulations</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#1F2937] mb-3">For Campaign Creators:</h3>
            <ul className="list-disc pl-6 text-[#4B5563] space-y-2 mb-6">
              <li>All information provided must be truthful and accurate</li>
              <li>You must provide regular updates and proof of fund utilization</li>
              <li>Fraudulent campaigns will result in legal action and fund recovery</li>
              <li>You agree to our verification process including document and ID checks</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#1F2937] mb-4">4. Platform Fees</h2>
            <p className="text-[#4B5563] leading-relaxed mb-6">
              GivingForward charges a platform fee of 5-7% on donations to cover operational costs, payment processing, 
              and campaign verification. This fee is clearly disclosed before any donation is made.
            </p>

            <h2 className="text-2xl font-bold text-[#1F2937] mb-4">5. Campaign Verification</h2>
            <p className="text-[#4B5563] leading-relaxed mb-6">
              We conduct thorough verification of all campaigns including document checks, ID verification, and background validation. 
              However, we cannot guarantee the accuracy of all information provided by campaign creators. Donors are encouraged to 
              exercise due diligence.
            </p>

            <h2 className="text-2xl font-bold text-[#1F2937] mb-4">6. Refund Policy</h2>
            <p className="text-[#4B5563] leading-relaxed mb-6">
              Donations are generally non-refundable. Refunds are considered only in cases of:
            </p>
            <ul className="list-disc pl-6 text-[#4B5563] space-y-2 mb-6">
              <li>Verified fraud or misrepresentation by campaign creator</li>
              <li>Duplicate payments made in error</li>
              <li>Campaign cancelled before funds are disbursed</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#1F2937] mb-4">7. Privacy & Data Protection</h2>
            <p className="text-[#4B5563] leading-relaxed mb-6">
              Your personal information is protected under our <Link to="/privacy" className="text-[#2F855A] hover:underline">Privacy Policy</Link>. 
              We do not sell or share your data with third parties except as required for payment processing and legal compliance.
            </p>

            <h2 className="text-2xl font-bold text-[#1F2937] mb-4">8. Limitation of Liability</h2>
            <p className="text-[#4B5563] leading-relaxed mb-6">
              GivingForward acts as an intermediary platform. We are not responsible for:
            </p>
            <ul className="list-disc pl-6 text-[#4B5563] space-y-2 mb-6">
              <li>How campaign creators use the funds raised</li>
              <li>Disputes between donors and campaign creators</li>
              <li>Outcomes of campaigns or medical treatments</li>
              <li>Third-party payment processing issues</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#1F2937] mb-4">9. Account Termination</h2>
            <p className="text-[#4B5563] leading-relaxed mb-6">
              We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, 
              or misuse the platform in any way.
            </p>

            <h2 className="text-2xl font-bold text-[#1F2937] mb-4">10. Changes to Terms</h2>
            <p className="text-[#4B5563] leading-relaxed mb-6">
              We may update these terms periodically. Continued use of the platform after changes constitutes acceptance 
              of the new terms.
            </p>

            <h2 className="text-2xl font-bold text-[#1F2937] mb-4">11. Governing Law</h2>
            <p className="text-[#4B5563] leading-relaxed mb-6">
              These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction 
              of the courts in Mumbai, Maharashtra.
            </p>

            <h2 className="text-2xl font-bold text-[#1F2937] mb-4">12. Contact</h2>
            <p className="text-[#4B5563] leading-relaxed">
              For questions about these terms, contact us at{' '}
              <a href="mailto:legal@givingforward.org" className="text-[#2F855A] hover:underline">
                legal@givingforward.org
              </a>
            </p>
          </div>

          <div className="trust-card p-6 mt-8 bg-[#EDF7F1] border border-[#2F855A]/20">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-[#2F855A] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-[#1F2937] mb-2">Your Rights & Protection</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  We're committed to protecting both donors and campaign creators. If you believe any terms have been violated 
                  or have concerns about a campaign, please <Link to="/contact" className="text-[#2F855A] hover:underline font-medium">contact us</Link> immediately.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Terms
