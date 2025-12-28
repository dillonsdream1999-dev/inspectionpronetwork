import Link from 'next/link'
import { Phone, MessageSquare } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <Link href="/">
                <img 
                  src="/inspection-pro-network-logo.png" 
                  alt="Inspection Pro Network" 
                  className="h-10 w-auto brightness-0 invert"
                />
              </Link>
            </div>
            <p className="text-sm max-w-md">
              Connect with high-intent homeowners in your exclusive territory. 
              No bidding wars. No lead guarantees. Just predictable access to inspection-driven demand.
            </p>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Questions?</h4>
            <p className="text-sm text-slate-400 mb-3">
              We're here to help! Call or text us:
            </p>
            <div className="space-y-2">
              <a 
                href="tel:8169262111" 
                className="flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 transition-colors"
              >
                <Phone className="w-4 h-4" />
                (816) 926-2111
              </a>
              <a 
                href="sms:8169262111" 
                className="flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Text Us
              </a>
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/territories" className="text-sm hover:text-white transition-colors">
                  Browse Territories
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm hover:text-white transition-colors">
                  Operator Login
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs">
            © {new Date().getFullYear()} Inspection Pro Network. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            Month-to-month subscriptions • Cancel anytime
          </p>
        </div>
      </div>
    </footer>
  )
}

