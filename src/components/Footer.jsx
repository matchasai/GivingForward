import { CheckCircle, Heart, Mail, MapPin, Phone, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-[#E5E7EB] mt-16">

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-6 h-6 text-[#2F855A]" fill="#2F855A" />
              <h3 className="text-xl font-bold text-[#1F2937]">GivingForward</h3>
            </div>
            <p className="text-[#6B7280] text-sm mb-4">
              Empowering communities through transparent, verified crowdfunding. 
              Every donation creates real impact, tracked from start to finish.
            </p>
            <p className="text-xs text-[#9CA3AF]">
              Our mission: Making generosity accessible and trustworthy for everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#1F2937] font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li>
                <Link to="/campaigns" className="hover:text-[#2F855A] transition-colors">
                  Browse Campaigns
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-[#2F855A] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/success-stories" className="hover:text-[#2F855A] transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#2F855A] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#2F855A] transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[#1F2937] font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li>
                <Link to="/contact" className="hover:text-[#2F855A] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#2F855A] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#2F855A] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-[#2F855A] transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <a href="#trust" className="hover:text-[#2F855A] transition-colors">
                  Trust & Safety
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-[#1F2937] font-semibold mb-4">Get In Touch</h4>
            <ul className="space-y-3 text-sm text-[#6B7280]">
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-[#2F855A] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-[#1F2937]">Email</p>
                  <a href="mailto:support@givingforward.org" className="hover:text-[#2F855A] transition-colors">
                    support@givingforward.org
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-[#2F855A] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-[#1F2937]">Phone</p>
                  <a href="tel:+911234567890" className="hover:text-[#2F855A] transition-colors">
                    +91 123 456 7890
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#2F855A] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-[#1F2937]">Address</p>
                  <p>123 Charity Street,<br />Mumbai, India 400001</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#E5E7EB] mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-[#6B7280]">
              © {currentYear} GivingForward. All rights reserved. Made with{' '}
              <Heart className="w-4 h-4 inline text-[#2F855A]" fill="#2F855A" /> for a better tomorrow.
            </p>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-[#2F855A]" />
                <span className="text-xs text-[#6B7280]">Secure payments</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-[#2F855A]" />
                <span className="text-xs text-[#6B7280]">Verified platform</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
