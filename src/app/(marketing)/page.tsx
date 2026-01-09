import Link from 'next/link'
import { 
  ArrowRight, 
  CheckCircle2, 
  PhoneCall,
  Shield,
  MapPin,
  Smartphone,
  Target
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-brand-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Stop Competing for Bed Bug Jobs
            </h1>
            <p className="text-2xl sm:text-3xl text-brand-200 mb-8">
              Own the Territory Instead
            </p>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 mb-8 max-w-3xl mx-auto border border-white/10">
              <p className="text-lg text-slate-300">
                Get exclusive bed bug treatment leads from homeowners
              </p>
              <p className="text-lg text-slate-300 mt-2">
                who already checked their home and want professional help.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/territories" 
                className="inline-flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white text-lg px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Check Territory Availability
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a 
                href="tel:8169622111" 
                className="inline-flex items-center justify-center gap-2 text-white hover:bg-white/10 text-lg px-8 py-3 rounded-lg font-semibold transition-colors border border-white/20"
              >
                <PhoneCall className="w-5 h-5" />
                Call (816) 962-2111
              </a>
            </div>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f8fafc"/>
          </svg>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              <span className="font-medium text-slate-700">Exclusive Territory Access</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Shield className="w-6 h-6 text-brand-500" />
              <span className="font-medium text-slate-700">Month-to-Month Subscription</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-accent-500" />
              <span className="font-medium text-slate-700">Cancel Anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* What This Is (Very Simple) */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              What This Is (Very Simple)
            </h2>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-slate-200 mb-8">
            <p className="text-xl font-bold text-slate-900 mb-6">
              Inspection Pro Network sends you bed bug treatment leads.
            </p>
            
            <p className="text-lg text-slate-700 mb-6">
              These are not random calls. These are homeowners who:
            </p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-700">Used our free bed bug inspection app</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-700">Checked their home for bed bugs</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-700">Learned what bed bugs look like</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-700">Decided they need professional treatment</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-700">Requested help from a local expert</span>
              </li>
            </ul>
            
            <div className="bg-brand-50 rounded-xl p-6 border-2 border-brand-200">
              <p className="text-lg font-bold text-slate-900">
                That expert is you. And you are the only one in your territory.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-slate-200">
              <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center mb-6 mx-auto">
                <Smartphone className="w-7 h-7 text-brand-600" />
              </div>
              <div className="text-center mb-4">
                <div className="inline-flex w-8 h-8 rounded-full bg-brand-600 text-white items-center justify-center font-bold text-sm mb-3">
                  1
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">
                Homeowner Uses App
              </h3>
              <p className="text-slate-600 text-center">
                They download the free app and check their home for bed bugs.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-slate-200">
              <div className="w-14 h-14 rounded-2xl bg-accent-100 flex items-center justify-center mb-6 mx-auto">
                <Target className="w-7 h-7 text-accent-600" />
              </div>
              <div className="text-center mb-4">
                <div className="inline-flex w-8 h-8 rounded-full bg-accent-500 text-white items-center justify-center font-bold text-sm mb-3">
                  2
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">
                They Request Help
              </h3>
              <p className="text-slate-600 text-center">
                After finding signs, they ask for professional treatment.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-slate-200">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6 mx-auto">
                <MapPin className="w-7 h-7 text-emerald-600" />
              </div>
              <div className="text-center mb-4">
                <div className="inline-flex w-8 h-8 rounded-full bg-emerald-500 text-white items-center justify-center font-bold text-sm mb-3">
                  3
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">
                Lead Goes to You
              </h3>
              <p className="text-slate-600 text-center">
                The request comes to you. Only you. No competition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Is Different */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Why This Is Different
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Typical Lead Companies */}
            <div className="bg-red-50 rounded-2xl p-8 border-2 border-red-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Typical Lead Companies</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold text-xl">✕</span>
                  <div>
                    <p className="font-semibold text-slate-900">Sell to multiple companies</p>
                    <p className="text-sm text-slate-600">You race 3-5 others for every lead</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold text-xl">✕</span>
                  <div>
                    <p className="font-semibold text-slate-900">Create price wars</p>
                    <p className="text-sm text-slate-600">Homeowners shop you against competitors</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold text-xl">✕</span>
                  <div>
                    <p className="font-semibold text-slate-900">Low-intent calls</p>
                    <p className="text-sm text-slate-600">Many just want free advice</p>
                  </div>
                </li>
              </ul>
            </div>
            
            {/* Inspection Pro Network */}
            <div className="bg-emerald-50 rounded-2xl p-8 border-2 border-emerald-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Inspection Pro Network</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">One operator per territory</p>
                    <p className="text-sm text-slate-600">No competition. Leads go to you only.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Treatment-ready leads</p>
                    <p className="text-sm text-slate-600">Homeowners already checked and want help</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">No bidding wars</p>
                    <p className="text-sm text-slate-600">You set your price. No race to the bottom.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-slate-900 text-white rounded-2xl p-8 text-center">
            <p className="text-2xl font-bold mb-2">
              One territory. One operator. No competition.
            </p>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              What You Get
            </h2>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-slate-200">
            <ul className="space-y-4 mb-6">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-lg text-slate-900 font-semibold">Exclusive territory access</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-lg text-slate-900 font-semibold">Treatment-ready bed bug leads</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-lg text-slate-900 font-semibold">No shared leads</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-lg text-slate-900 font-semibold">No Google Ads needed</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-lg text-slate-900 font-semibold">No bidding wars</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-lg text-slate-900 font-semibold">Month-to-month. Cancel anytime.</span>
              </li>
            </ul>
            
            <div className="bg-emerald-50 rounded-xl p-6 border-2 border-emerald-300 mt-6">
              <p className="text-lg font-bold text-slate-900 text-center">
                You own your territory. No one else can claim it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Simple Pricing
            </h2>
            <p className="text-lg text-slate-600">
              Flat monthly fee. No per-lead charges. No long-term contracts.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Individual Territory */}
            <div className="bg-white rounded-2xl p-8 border-2 border-brand-200 relative shadow-lg">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-slate-900 mb-2">
                  $99<span className="text-xl font-normal text-slate-500">/mo</span>
                </div>
                <p className="text-sm text-slate-600 font-medium">Individual Territory</p>
              </div>
              
              <ul className="space-y-3 mb-6 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Territory exclusivity—no competing operators</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">All treatment requests routed to you</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Marketing support in your territory</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Email or phone support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Cancel anytime—no long-term commitment</span>
                </li>
              </ul>
            </div>

            {/* Full DMA */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border-2 border-amber-400 relative shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-amber-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                  🏆 Premium
                </span>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-slate-900 mb-2">
                  $1,000<span className="text-xl font-normal text-slate-500">/mo</span>
                </div>
                <p className="text-sm text-slate-600 font-medium">Full DMA Ownership</p>
                <p className="text-xs text-amber-700 mt-1 font-medium">Entire Market Coverage</p>
              </div>
              
              <ul className="space-y-3 mb-6 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700"><strong>Direct Phone Support</strong> - Priority access to our team</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700"><strong>Marketing Spend Included</strong> - We drive users to the inspection app in your DMA</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700"><strong>More Leads</strong> - Increased app usage = more treatment requests</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Exclusive control of entire Designated Market Area</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link href="/territories" className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-lg px-8 py-3 rounded-lg font-semibold transition-colors">
              Browse Territories
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-center text-sm text-slate-500 mt-4">
              One bed bug job covers the monthly cost.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-2">Are the leads shared with other companies?</h3>
              <p className="text-slate-600">
                <strong>No.</strong> Each territory has one operator only. You are not competing with anyone else for the same leads.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-2">What do you mean by "territory"?</h3>
              <p className="text-slate-600">
                A territory is a specific area (like a metro area or set of zip codes). When you own a territory, all bed bug treatment requests from that area go to you. No one else can claim it.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-2">How many leads will I get per month?</h3>
              <p className="text-slate-600">
                It depends on your territory size and population. We don't promise a fixed number. We promise exclusive, treatment-ready leads. Quality over quantity.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-2">Do I pay per lead?</h3>
              <p className="text-slate-600">
                <strong>No.</strong> You pay a flat monthly fee. No per-lead charges. No surprises.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-2">What if a homeowner doesn't actually have bed bugs?</h3>
              <p className="text-slate-600">
                That happens. These are high-intent suspicion leads. Even if they don't have bed bugs, you can charge for the inspection and become their go-to if the problem appears later.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-2">Is there a long-term contract?</h3>
              <p className="text-slate-600">
                <strong>No.</strong> Month-to-month. Cancel anytime. Stay because it works.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-gradient-to-br from-brand-600 to-brand-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <PhoneCall className="w-12 h-12 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Questions? We're Here to Help
          </h2>
          <p className="text-xl text-brand-100 mb-8 max-w-2xl mx-auto">
            Want to know more about territories, pricing, or how it works? Give us a call or text.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="tel:8169622111" 
              className="inline-flex items-center justify-center gap-2 bg-white text-brand-600 hover:bg-brand-50 text-lg px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              <PhoneCall className="w-5 h-5" />
              Call (816) 962-2111
            </a>
            <a 
              href="sms:8169622111" 
              className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-white text-lg px-8 py-3 rounded-lg font-semibold transition-colors border border-white/20"
            >
              Text Us
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            Ready to Claim Your Territory?
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Check availability in your area and secure exclusive access to treatment-ready bed bug leads.
          </p>
          <Link href="/territories" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-lg px-8 py-3 rounded-lg font-semibold transition-colors">
            Check Territory Availability
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
