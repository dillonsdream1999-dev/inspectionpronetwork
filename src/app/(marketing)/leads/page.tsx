import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowRight, 
  CheckCircle2, 
  XCircle,
  PhoneCall,
  Shield,
  AlertCircle,
  DollarSign,
  TrendingDown,
  Lock,
  Users
} from 'lucide-react'

export default function TreatmentLeadsPage() {
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
              Stop Paying for Bed Bug Leads That Don't Turn Into Jobs
            </h1>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 mb-8 max-w-3xl mx-auto border border-white/10">
              <div className="space-y-4 text-lg text-slate-300">
                <p>Google Ads are expensive.</p>
                <p>Lead companies sell the same homeowner to 5 contractors.</p>
                <p>And most "leads" aren't even sure they have bed bugs.</p>
              </div>
              
              <div className="mt-8 pt-8 border-t border-white/10 space-y-2">
                <p className="text-xl text-slate-200 font-semibold">So you waste time.</p>
                <p className="text-xl text-slate-200 font-semibold">You waste money.</p>
                <p className="text-xl text-slate-200 font-semibold">And you still don't get predictable bed bug jobs.</p>
              </div>
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

      {/* The 4 Problems With Getting Bed Bug Jobs */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              The 4 Problems With Getting Bed Bug Jobs
            </h2>
          </div>
          
          <div className="space-y-6 mb-8">
            <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
              <p className="text-xl font-bold text-slate-900 mb-2">
                1. Google Ads are overpriced and competitive
              </p>
              <p className="text-slate-700">National brands outbid you. Costs keep rising.</p>
            </div>
            
            <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
              <p className="text-xl font-bold text-slate-900 mb-2">
                2. Leads are shared and turn into bidding wars
              </p>
              <p className="text-slate-700">You race other companies to the phone and lose on price.</p>
            </div>
            
            <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
              <p className="text-xl font-bold text-slate-900 mb-2">
                3. Most leads aren't treatment-ready
              </p>
              <p className="text-slate-700">You spend time educating people who never book.</p>
            </div>
            
            <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
              <p className="text-xl font-bold text-slate-900 mb-2">
                4. Lead flow is unpredictable
              </p>
              <p className="text-slate-700">Some months you're slammed. Others, trucks sit idle.</p>
            </div>
          </div>
          
          <div className="bg-slate-900 text-white rounded-2xl p-8 text-center">
            <p className="text-2xl font-bold">
              That's not a system.
            </p>
            <p className="text-2xl font-bold mt-2">
              That's gambling.
            </p>
          </div>
        </div>
      </section>

      {/* Case Study Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Real Results From a New Territory Owner (Month 1)
            </h2>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-emerald-200 mb-8">
            <p className="text-xl text-slate-900 font-semibold mb-6">
              One operator started with:
            </p>
            <ul className="space-y-2 mb-8 text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span><strong>1 core territory</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span><strong>3 adjacent territories</strong></span>
              </li>
            </ul>
            <p className="text-slate-600 italic mb-8">
              No ads. No prior relationship. No warm list.
            </p>
            
            <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Month 1 Results</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-bold text-emerald-700 mb-1">27</p>
                  <p className="text-slate-700">leads received</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-emerald-700 mb-1">19</p>
                  <p className="text-slate-700">jobs sold</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-emerald-700 mb-1">70%</p>
                  <p className="text-slate-700">close rate</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-emerald-700 mb-1">$1,475</p>
                  <p className="text-slate-700">average job value</p>
                </div>
              </div>
            </div>
            
            <div className="bg-brand-50 rounded-xl p-6 border-2 border-brand-300">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Revenue vs Cost</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-700 font-semibold">$28,025 in closed revenue</span>
                  <span className="text-2xl font-bold text-emerald-700">$28,025</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700 font-semibold">$750 total subscription cost</span>
                  <span className="text-2xl font-bold text-red-600">$750</span>
                </div>
                <div className="pt-4 border-t border-brand-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-slate-900">37× return in the first month</span>
                    <span className="text-3xl font-bold text-emerald-700">37×</span>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-center text-xl font-bold text-slate-900 mt-8">
              One operator. One system. One month.
            </p>
          </div>
        </div>
      </section>

      {/* Why This Case Study Matters */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Why This Case Study Matters
            </h2>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-slate-200">
            <p className="text-xl text-slate-900 font-semibold mb-6">
              These weren't cold leads.
            </p>
            
            <p className="text-lg text-slate-700 mb-6 font-semibold">
              Every homeowner:
            </p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-700">Used the inspection app</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-700">Confirmed a bed bug issue</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-700">Requested professional help</span>
              </li>
            </ul>
            
            <div className="bg-emerald-50 rounded-xl p-6 border-2 border-emerald-200">
              <p className="text-lg font-semibold text-slate-900 mb-2">
                And every lead went to <strong>one operator only</strong>.
              </p>
              <div className="space-y-2 text-slate-700 mt-4">
                <p className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <span>No competition.</span>
                </p>
                <p className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <span>No price shopping.</span>
                </p>
                <p className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <span>No education required.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              The Solution: Exclusive, Treatment-Ready Bed Bug Leads
            </h2>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-slate-200 mb-8">
            <div className="space-y-4 mb-8">
              <p className="text-xl text-slate-900 font-semibold">
                We don't sell ads.
              </p>
              <p className="text-xl text-slate-900 font-semibold">
                We don't sell lists.
              </p>
              <p className="text-xl text-slate-900 font-semibold">
                We don't share leads.
              </p>
            </div>
            
            <p className="text-lg text-slate-700 mb-8">
              We built a <strong className="text-slate-900">free bed bug inspection app</strong> homeowners actually use.
            </p>
            
            <div className="bg-brand-50 rounded-xl p-6 border border-brand-200">
              <p className="text-lg font-semibold text-slate-900 mb-4">
                Here's how it works:
              </p>
              
              <p className="text-lg text-slate-700 mb-4 font-semibold">
                Homeowners:
              </p>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Inspect their home room-by-room</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Learn what bed bugs actually look like</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Learn where bed bugs hide</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Understand when professional treatment is needed</span>
                </li>
              </ul>
              
              <p className="text-lg font-semibold text-slate-900 mt-6">
                Only <strong>after</strong> that…<br />
                They click <strong>"Contact a Local Bed Bug Expert."</strong>
              </p>
              
              <p className="text-xl font-bold text-slate-900 mt-4 text-center">
                That expert is <strong>you</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Overview - Infographic */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Visual Overview of the System
            </h2>
          </div>
          
          <div className="bg-slate-50 rounded-2xl sm:p-8 p-0 border border-slate-200 mb-6 overflow-hidden sm:overflow-visible">
            <div className="relative w-[100vw] aspect-[3/4] sm:aspect-[16/10] overflow-hidden left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 sm:w-full sm:rounded-lg">
              <Image
                src="/inspection-pro-network-flyer.png"
                alt="How Inspection Pro Network Generates High-Intent Leads - Homeowners self-inspect through the app, get educated on bed bug treatment, and treatment-ready leads are routed to one operator per territory"
                fill
                className="object-contain bg-white"
                priority
                sizes="100vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* One Homeowner → One Operator → One Territory */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              One Homeowner → One Operator → One Territory
            </h2>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-emerald-200">
            <div className="space-y-4 mb-8">
              <p className="text-xl text-slate-900 font-semibold text-center">
                No bidding.
              </p>
              <p className="text-xl text-slate-900 font-semibold text-center">
                No speed dialing.
              </p>
              <p className="text-xl text-slate-900 font-semibold text-center">
                No competition.
              </p>
            </div>
            
            <div className="bg-emerald-50 rounded-xl p-6 border-2 border-emerald-300 mb-6">
              <p className="text-lg font-semibold text-slate-900 mb-4">
                Each territory has <strong>one provider</strong>.
              </p>
              <p className="text-lg text-slate-700">
                When a homeowner reaches out, the lead goes <strong>only to you</strong>.<br />
                Not you and four others.<br />
                Not a race.<br />
                Not a price war.
              </p>
            </div>
            
            <p className="text-xl font-bold text-slate-900 text-center">
              Just a treatment-ready customer.
            </p>
          </div>
        </div>
      </section>

      {/* Why These Leads Close */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Why These Leads Close
            </h2>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-brand-200">
            <p className="text-xl text-slate-900 font-semibold mb-6">
              Because the homeowner already:
            </p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-lg text-slate-700">Looked for bed bugs</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-lg text-slate-700">Confirmed a real concern</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-lg text-slate-700">Decided they need help</span>
              </li>
            </ul>
            
            <div className="bg-brand-50 rounded-xl p-6 border-2 border-brand-300">
              <p className="text-lg text-slate-700 mb-2">
                You're not convincing them.
              </p>
              <p className="text-lg text-slate-700 mb-2">
                You're not educating them from scratch.
              </p>
              <p className="text-xl font-bold text-slate-900 mt-4">
                You're booking the job.
              </p>
            </div>
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
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-slate-700">Exclusive bed bug leads</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-slate-700">One operator per territory</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-slate-700">No Google Ads</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-slate-700">No shared leads</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-slate-700">No lead brokers</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-slate-700">No wasted calls</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-slate-700">No long-term contracts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Pricing Reality */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              The Pricing Reality
            </h2>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-slate-200 mb-8">
            <p className="text-xl text-slate-900 font-semibold mb-6 text-center">
              Let's do the math.
            </p>
            
            <p className="text-lg text-slate-700 mb-8 text-center">
              A single bed bug job is worth <strong className="text-slate-900">$1,500–$3,500</strong>.
            </p>
            
            <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200 mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">The Old Way</h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <span>$30–$60 per Google click</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <span>10–20 clicks per call</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <span>Shared leads sold to multiple companies</span>
                </li>
              </ul>
              <p className="text-lg font-semibold text-slate-900 mt-4">
                You spend <strong>$500–$1,000</strong><br />
                Just to <em>maybe</em> win one job.
              </p>
              <p className="text-slate-700 mt-2">
                Lose the bid? That money is gone.
              </p>
            </div>
            
            <div className="bg-emerald-50 rounded-xl p-6 border-2 border-emerald-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4">The Inspection Pro Network Way</h3>
              <ul className="space-y-2 text-slate-700 mb-4">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>No ads</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>No bidding</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>No shared leads</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>One operator per territory</span>
                </li>
              </ul>
              <p className="text-lg font-semibold text-slate-900 mt-4">
                You pay for <strong>access</strong>, not hope.
              </p>
              <p className="text-xl font-bold text-emerald-700 mt-2">
                Close <strong>one job</strong> and this pays for itself.<br />
                Everything after that is profit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Guarantee */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              The Guarantee
            </h2>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-brand-300">
            <div className="text-center mb-6">
              <Shield className="w-16 h-16 text-brand-600 mx-auto mb-4" />
              <p className="text-2xl font-bold text-slate-900">
                If this doesn't send you real, treatment-ready bed bug leads, you don't pay.
              </p>
            </div>
            
            <div className="bg-brand-50 rounded-xl p-6 border border-brand-200">
              <div className="space-y-3 text-slate-700">
                <p className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <span>No contracts.</span>
                </p>
                <p className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <span>No lock-ins.</span>
                </p>
                <p className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <span>No excuses.</span>
                </p>
              </div>
              
              <p className="text-lg text-slate-900 font-semibold mt-6">
                If homeowners aren't contacting you through the app,<br />
                there's no reason for you to stay.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-brand-600 to-brand-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Claim Your Territory Before a Competitor Does
          </h2>
          
          <p className="text-xl text-brand-100 mb-8 max-w-2xl mx-auto">
            There is <strong>one provider per territory</strong>.<br />
            Once it's taken, it's gone.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8 border border-white/20">
            <p className="text-lg text-brand-100 mb-6">
              If you want:
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Exclusive bed bug leads</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>No ads</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>No shared leads</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>No bidding wars</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link 
              href="/territories"
              className="inline-flex items-center justify-center gap-2 bg-white text-brand-600 hover:bg-brand-50 text-lg px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Check Territory Availability
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/territories"
              className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-white text-lg px-8 py-3 rounded-lg font-semibold transition-colors border border-white/20"
            >
              Activate Your Territory
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/territories"
              className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-white text-lg px-8 py-3 rounded-lg font-semibold transition-colors border border-white/20"
            >
              Start Receiving Treatment-Ready Leads
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          <p className="text-xl font-bold text-white">
            If one bed bug job covers the cost, waiting is the most expensive decision you can make.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              FAQ
            </h2>
          </div>
          
          <div className="space-y-8">
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                How are these leads different from HomeAdvisor or Angi?
              </h3>
              <p className="text-slate-700">
                They sell the same homeowner to multiple companies.<br />
                We don't.
              </p>
              <p className="text-slate-900 font-semibold mt-2">
                Each lead goes to <strong>one operator only</strong>.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                How do homeowners find the app?
              </h3>
              <p className="text-slate-700">
                They use a free bed bug inspection app.<br />
                If they confirm signs of bed bugs, they request help.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Are these homeowners ready to book?
              </h3>
              <p className="text-slate-700 font-semibold">
                Yes.
              </p>
              <p className="text-slate-700">
                They've already confirmed a real issue and want treatment.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                How many leads will I get?
              </h3>
              <p className="text-slate-700">
                It depends on your territory.
              </p>
              <p className="text-slate-700 mt-2">
                We don't promise volume.<br />
                We promise <strong className="text-slate-900">intent and exclusivity</strong>.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                What if the lead isn't real?
              </h3>
              <p className="text-slate-700">
                If the homeowner never contacts you or the lead is invalid,<br />
                you don't pay.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Is there a long-term contract?
              </h3>
              <p className="text-slate-700 font-semibold">
                No.
              </p>
              <p className="text-slate-700">
                Stay because it works.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Can another company join my area later?
              </h3>
              <p className="text-slate-700 font-semibold">
                No.
              </p>
              <p className="text-slate-700">
                One operator per territory.
              </p>
            </div>
            
            <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Who is this NOT a fit for?
              </h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <span>Companies that don't treat bed bugs</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <span>Operators who want shared leads</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <span>Businesses that don't follow up fast</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-2xl font-bold text-slate-900">
              The only thing you can lose is a territory you didn't claim.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
