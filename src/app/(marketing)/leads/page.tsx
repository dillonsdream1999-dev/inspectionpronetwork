import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowRight, 
  CheckCircle2, 
  PhoneCall
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
              How We Send Bed Bug Treatment Leads
            </h1>
            <p className="text-2xl sm:text-3xl text-brand-200 mb-8">
              (Without Google Ads)
            </p>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 mb-8 max-w-3xl mx-auto border border-white/10">
              <p className="text-lg text-slate-300">
                We send homeowners who already checked their home for bed bugs
              </p>
              <p className="text-lg text-slate-300 mt-2">
                and are now asking for professional treatment.
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

      {/* The Problem Most Bed Bug Companies Have */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              The Problem Most Bed Bug Companies Have
            </h2>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
            <p className="text-lg text-slate-700 italic mb-6">
              If you treat bed bugs, this probably sounds familiar:
            </p>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
              <p className="text-lg font-semibold text-slate-900">
                Google Ads are expensive
              </p>
            </div>
            
            <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
              <p className="text-lg font-semibold text-slate-900">
                Many calls are just questions
              </p>
            </div>
            
            <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
              <p className="text-lg font-semibold text-slate-900">
                People want free advice
              </p>
            </div>
            
            <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
              <p className="text-lg font-semibold text-slate-900">
                Most callers are not ready to buy
              </p>
            </div>
            
            <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
              <p className="text-lg font-semibold text-slate-900">
                You compete with several companies for the same lead
              </p>
            </div>
          </div>
          
          <div className="bg-slate-900 text-white rounded-2xl p-8 text-center">
            <p className="text-2xl font-bold">
              This wastes time and money.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do (Very Simple) */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              What We Do (Very Simple)
            </h2>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-slate-200 mb-8">
            <p className="text-xl font-bold text-slate-900 mb-6">
              We do not send inspection calls.
            </p>
            <p className="text-xl font-bold text-slate-900 mb-8">
              We only send bed bug treatment requests.
            </p>
            
            <p className="text-lg text-slate-700 mb-6">
              Before a homeowner ever contacts a company, they:
            </p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-700">Use our free bed bug inspection app</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-700">Follow simple steps to check their home</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-700">Learn what bed bugs look like</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-700">Decide they likely have bed bugs</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-700">Ask for professional treatment</span>
              </li>
            </ul>
            
            <div className="bg-brand-50 rounded-xl p-6 border-2 border-brand-200">
              <p className="text-lg font-bold text-slate-900">
                Only after this happens does the lead get sent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Kind of Leads You Receive */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              What Kind of Leads You Receive
            </h2>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-emerald-200">
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <span className="text-lg text-slate-900 font-semibold">Homeowners who already inspected</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <span className="text-lg text-slate-900 font-semibold">People who believe they have bed bugs</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <span className="text-lg text-slate-900 font-semibold">People asking for treatment</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <span className="text-lg text-slate-900 font-semibold">No shared leads</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <span className="text-lg text-slate-900 font-semibold">No bidding against other companies</span>
              </div>
            </div>
            
            <div className="bg-emerald-50 rounded-xl p-6 border-2 border-emerald-300 mt-6">
              <p className="text-lg font-bold text-slate-900 text-center">
                Each territory has one provider only.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How Leads Are Created (This Matters) */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              How Leads Are Created (This Matters)
            </h2>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-slate-200 mb-8">
            <p className="text-xl font-bold text-slate-900 mb-6">
              This is not a "hope people find us" system.
            </p>
            
            <p className="text-lg text-slate-700 mb-6">
              If you own a territory, we actively market the inspection app in your area.
            </p>
            
            <p className="text-lg font-semibold text-slate-900 mb-4">
              That includes:
            </p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <span className="text-slate-700">Paid advertising</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <span className="text-slate-700">Local promotion</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <span className="text-slate-700">Ongoing demand generation</span>
              </li>
            </ul>
            
            <div className="bg-brand-50 rounded-xl p-6 border-2 border-brand-200">
              <p className="text-lg text-slate-700 mb-2">
                Our job is to bring homeowners in your territory into the app
              </p>
              <p className="text-lg text-slate-700 mb-2">
                so they complete the inspection and request treatment.
              </p>
              <p className="text-lg font-bold text-slate-900 mt-4">
                You are not left waiting on organic traffic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Way to Think About It */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Simple Way to Think About It
            </h2>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-slate-200">
            <p className="text-lg font-semibold text-slate-900 mb-6">
              Instead of getting calls like:
            </p>
            
            <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200 mb-6">
              <p className="text-xl font-bold text-slate-900 italic">
                "Do I have bed bugs?"
              </p>
            </div>
            
            <p className="text-lg font-semibold text-slate-900 mb-6 text-center">
              You get calls like:
            </p>
            
            <div className="bg-emerald-50 rounded-xl p-6 border-2 border-emerald-200">
              <p className="text-xl font-bold text-slate-900 italic">
                "I already checked. I think I have bed bugs. I need treatment."
              </p>
            </div>
            
            <p className="text-2xl font-bold text-slate-900 text-center mt-8">
              That is the difference.
            </p>
          </div>
        </div>
      </section>

      {/* Real Example From a Territory Owner */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Real Example From a Territory Owner
            </h2>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-emerald-200 mb-8">
            <p className="text-xl text-slate-900 font-semibold mb-6">
              One bed bug company started with:
            </p>
            
            <ul className="space-y-2 mb-8 text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span><strong>1 main territory</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span><strong>3 adjacent territories</strong></span>
              </li>
            </ul>
            
            <p className="text-lg font-semibold text-slate-900 mb-8">
              In the first 30 days:
            </p>
            
            <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-bold text-emerald-700 mb-1">27</p>
                  <p className="text-slate-700">homeowners requested treatment</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-emerald-700 mb-1">19</p>
                  <p className="text-slate-700">jobs were sold</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-emerald-700 mb-1">$1,475</p>
                  <p className="text-slate-700">average job</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-emerald-700 mb-1">$28,025</p>
                  <p className="text-slate-700">total revenue</p>
                </div>
              </div>
            </div>
            
            <div className="bg-brand-50 rounded-xl p-6 border-2 border-brand-300">
              <p className="text-lg font-semibold text-slate-900 mb-4">
                They paid $750 total for their territories.
              </p>
              
              <p className="text-lg text-slate-700 mb-2">
                These were not inspection calls.
              </p>
              <p className="text-lg text-slate-700">
                These were homeowners ready to move forward.
              </p>
            </div>
            
            <p className="text-center text-slate-600 italic mt-8">
              Results vary by area, but this shows what is possible when a territory is active and marketed.
            </p>
          </div>
        </div>
      </section>

      {/* Territory Rules (Very Clear) */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Territory Rules (Very Clear)
            </h2>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-slate-200">
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <span className="text-lg text-slate-900 font-semibold">One company per territory</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <span className="text-lg text-slate-900 font-semibold">No shared leads</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <span className="text-lg text-slate-900 font-semibold">No bidding wars</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <span className="text-lg text-slate-900 font-semibold">No pay-per-lead pricing</span>
              </div>
            </div>
            
            <div className="bg-slate-900 text-white rounded-xl p-6 mt-6">
              <p className="text-lg font-bold text-center">
                Once a territory is active, it stays protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Pricing
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Individual Territory */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Individual Territory
              </h3>
              
              <p className="text-4xl font-bold text-brand-600 mb-2">
                $250
              </p>
              <p className="text-slate-600 mb-6">per month</p>
              
              <ul className="space-y-2 text-slate-700 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Covers about 75,000 people</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Adjacent territories available at a discount</span>
                </li>
              </ul>
            </div>
            
            {/* Entire DMA */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-brand-300 relative">
              <div className="absolute top-4 right-4 bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                JANUARY SPECIAL
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Entire DMA (Metro Area)
              </h3>
              
              <div className="mb-2">
                <p className="text-2xl text-slate-400 line-through">
                  Regular price: $3,000 per month
                </p>
                <p className="text-4xl font-bold text-brand-600">
                  $1,500
                </p>
                <p className="text-slate-600">per month <span className="text-brand-600 font-bold">(50% off)</span></p>
              </div>
              
              <ul className="space-y-2 text-slate-700 mb-4">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Covers the full metro area</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Locks out competitors</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Best option for aggressive growth</span>
                </li>
              </ul>
              
              <p className="text-sm font-semibold text-slate-600 mt-4">
                January pricing is limited.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Risk-Free to Start */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Risk-Free to Start
            </h2>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-emerald-200">
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <p className="text-lg font-bold text-slate-900 mb-2">Month-to-month</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-slate-900 mb-2">Cancel anytime</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-slate-900 mb-2">No long-term contracts</p>
              </div>
            </div>
            
            <div className="bg-emerald-50 rounded-xl p-6 border-2 border-emerald-300 text-center">
              <p className="text-lg font-bold text-slate-900">
                If the leads make sense, you stay.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who This Is Best For */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Who This Is Best For
            </h2>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-slate-200 mb-8">
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-lg text-slate-700">Companies that treat bed bugs regularly</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-lg text-slate-700">Owners tired of paying Google Ads</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-lg text-slate-700">Businesses that want exclusive leads</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-lg text-slate-700">Operators who want predictable demand</span>
              </li>
            </ul>
            
            <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200 mt-6">
              <p className="text-lg font-semibold text-slate-900">
                This is not for inspection-only companies
              </p>
              <p className="text-lg font-semibold text-slate-900 mt-2">
                or very low-price chemical-only services.
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
              Visual Overview
            </h2>
          </div>
          
          <div className="bg-slate-50 rounded-2xl sm:p-8 p-0 border border-slate-200 mb-6 overflow-hidden sm:overflow-visible">
            <div className="relative w-[100vw] aspect-[3/4] sm:aspect-[16/10] overflow-hidden left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 sm:w-full sm:rounded-lg">
              <Image
                src="/lead-generation-infographic.png"
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

      {/* Next Step */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Next Step
            </h2>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-brand-300">
            <p className="text-lg text-slate-700 mb-6">
              Check if your territory is available.
            </p>
            
            <div className="text-center">
              <Link 
                href="/territories"
                className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-lg px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Check Territory Availability
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            <p className="text-center text-slate-600 mt-6">
              If your area is open, we'll show you how to activate it.
            </p>
          </div>
        </div>
      </section>

      {/* Final Note (Important) */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Final Note (Important)
            </h2>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <p className="text-xl text-slate-300 mb-4">
              We are not selling software.
            </p>
            <p className="text-xl text-slate-300 mb-4">
              We are not selling inspections.
            </p>
            
            <div className="bg-brand-500/20 backdrop-blur-sm rounded-xl p-6 border border-brand-400/30 mt-6">
              <p className="text-xl font-bold text-white text-center">
                We are selling bed bug treatment leads
              </p>
              <p className="text-lg text-brand-100 text-center mt-2">
                from homeowners who already used the inspection app
              </p>
              <p className="text-lg text-brand-100 text-center mt-2">
                and are ready to move forward.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
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
      </section>
    </div>
  )
}
