export default function TermsPage() {
  return (
    <div className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-slate-600 mb-4">
            By accessing and using Inspection Pro Network, you agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not use our services.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">2. Service Description</h2>
          <p className="text-slate-600 mb-4">
            Inspection Pro Network provides a platform for pest control operators to access exclusive territory 
            subscriptions. We connect operators with homeowners who use the Bed Bug Inspection Pro mobile application.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">3. No Guarantees</h2>
          <p className="text-slate-600 mb-4">
            <strong>Important:</strong> Territory subscriptions do not guarantee any specific number of leads, 
            inquiries, or bookings. Lead volume varies based on many factors including season, location, 
            market conditions, and app adoption in your territory.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">4. Subscription Terms</h2>
          <p className="text-slate-600 mb-4">
            Subscriptions are billed monthly and may be canceled at any time. Upon cancellation, you will 
            retain access until the end of your current billing period. Territory exclusivity ends when 
            your subscription is canceled or lapses.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">5. Territory Exclusivity</h2>
          <p className="text-slate-600 mb-4">
            Each territory can only have one active subscriber at a time. Exclusivity is maintained only 
            while your subscription is active and in good standing.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">6. Adjacent Territory Discount</h2>
          <p className="text-slate-600 mb-4">
            Adjacent territory discounts are applied when you already own an active subscription to a 
            directly adjacent territory. If the qualifying territory subscription is canceled, any 
            discounted territories will revert to standard pricing at the next billing cycle.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">7. Contact</h2>
          <p className="text-slate-600 mb-4">
            For questions about these terms, please contact us through the platform.
          </p>
        </div>
      </div>
    </div>
  )
}

