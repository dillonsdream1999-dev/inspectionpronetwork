import Link from 'next/link'
import { 
  ArrowRight, 
  CheckCircle2, 
  XCircle,
  MapPin,
  Users,
  TrendingUp,
  Smartphone,
  Target,
  PhoneCall,
  MessageSquare,
  Shield,
  BarChart3,
  AlertCircle
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
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
              <Target className="w-4 h-4 text-brand-400" />
              <span className="text-sm font-medium">Exclusive Territory Coverage • Treatment-Ready Leads</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Exclusive Bed Bug Treatment Leads
            </h1>
            
            <p className="text-xl sm:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              From Homeowners Actively Looking for Treatment in Your Territory
            </p>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-8 max-w-2xl mx-auto border border-white/10">
              <p className="text-lg text-slate-200 mb-2">Not inspection questions.</p>
              <p className="text-lg text-slate-200">Not "can you tell me if this is a bed bug?" calls.</p>
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

      {/* Why This Works Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Why This Works
            </h2>
            <p className="text-lg text-slate-600">Simple Explanation</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
            <p className="text-lg text-slate-700 mb-6">
              Inspection Pro Network is built around a <strong className="text-slate-900">free mobile self-inspection app</strong> for homeowners.
            </p>
            
            <div className="space-y-4 mb-8">
              <p className="text-slate-700 font-medium">Homeowners use the app to:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Learn what bed bugs actually look like</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Walk through a guided self-check</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Decide for themselves whether professional treatment is needed</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-brand-50 rounded-xl p-6 border border-brand-200">
              <p className="text-brand-900 text-lg font-medium">
                When a homeowner believes treatment is necessary, they are connected with a local operator in their territory.
              </p>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-200">
              <p className="text-xl text-slate-900 font-semibold text-center">
                You're not paying for clicks.
              </p>
              <p className="text-xl text-slate-900 font-semibold text-center mt-2">
                You're benefiting from intent that already exists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You Receive Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              What You Receive as an Operator
            </h2>
            <p className="text-lg text-slate-600">
              Operators use Inspection Pro Network to receive:
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            <div className="bg-slate-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Homeowners who believe they have bed bugs</h3>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Requests that are treatment-focused, not educational</h3>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Leads generated from a free consumer app, not paid ads</h3>
            </div>
          </div>
          
          <div className="bg-emerald-50 rounded-2xl p-8 max-w-3xl mx-auto border-2 border-emerald-200">
            <p className="text-lg font-semibold text-slate-900 mb-4 text-center">Most operators see:</p>
            <div className="grid sm:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-emerald-700 mb-1">Fewer</p>
                <p className="text-sm text-slate-700">total calls</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-700 mb-1">Higher</p>
                <p className="text-sm text-slate-700">treatment intent</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-700 mb-1">Less time</p>
                <p className="text-sm text-slate-700">spent explaining bed bugs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Territories, Population & Coverage */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Territories, Population & Coverage
            </h2>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 mb-8">
            <p className="text-lg text-slate-700 mb-6">
              Each operator is assigned <strong className="text-slate-900">exclusive territory coverage</strong>.
            </p>
            
            <div className="space-y-4 mb-8">
              <p className="text-slate-700 font-medium">Territories are defined by:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">ZIP codes</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Population size</span>
                </li>
                <li className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Practical service radius</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6 mb-6">
              <p className="font-semibold text-slate-900 mb-3">Typical territory population ranges:</p>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-brand-600 font-medium">~75,000</span>
                  <span>population (standard)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-600 font-medium">Up to ~100,000</span>
                  <span>population in rural or low-density areas</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <p className="text-slate-700 font-medium">We do this to ensure:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Leads are not oversold</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Coverage remains realistic</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Operators see meaningful volume over time</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Volume Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Lead Volume
            </h2>
            <p className="text-lg text-slate-600">Realistic Expectations</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 mb-8">
            <p className="text-lg text-slate-700 mb-6">
              Because the homeowner app is:
            </p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                <span className="text-slate-700">Free to use</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                <span className="text-slate-700">Promoted online</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                <span className="text-slate-700">Marketed directly within each territory</span>
              </li>
            </ul>
            
            <div className="bg-brand-50 rounded-xl p-6 mb-6 border border-brand-200">
              <p className="font-semibold text-slate-900 mb-3">Most operators can expect:</p>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <BarChart3 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                  <span>Several treatment-intent leads per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                  <span>Volume increases as the app gains awareness locally</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4 pt-6 border-t border-slate-200">
              <p className="text-slate-900 font-medium italic">
                This is not a one-day spike.
              </p>
              <p className="text-slate-900 font-medium">
                It's a compounding channel as more homeowners use the app in your area.
              </p>
            </div>
            
            <div className="mt-8 bg-amber-50 rounded-xl p-6 border border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900 mb-1">No guarantees.</p>
                  <p className="font-medium text-slate-900 mb-1">No inflated promises.</p>
                  <p className="text-slate-700">Just real homeowners actively searching for answers — and treatment.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Pricing
            </h2>
            <p className="text-lg text-slate-600">Plain and Honest</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-slate-700"><strong className="text-slate-900">Monthly pricing</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-slate-700"><strong className="text-slate-900">No per-lead fees</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-slate-700">Typically <strong className="text-slate-900">less than the cost of two Google Ads leads</strong></span>
              </li>
            </ul>
            
            <div className="bg-brand-50 rounded-xl p-6 border border-brand-200">
              <p className="font-semibold text-slate-900 mb-3">Most operators use this to:</p>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-brand-600 shrink-0 mt-1" />
                  <span>Offset Google Ads spend</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-brand-600 shrink-0 mt-1" />
                  <span>Reduce wasted calls</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-brand-600 shrink-0 mt-1" />
                  <span>Add a predictable source of treatment-ready inquiries</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What This Is Not */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              What This Is Not
            </h2>
            <p className="text-lg text-slate-600">To avoid confusion:</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="w-6 h-6 text-red-600" />
                <h3 className="font-semibold text-slate-900">Not a diagnosis service</h3>
              </div>
            </div>
            
            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="w-6 h-6 text-red-600" />
                <h3 className="font-semibold text-slate-900">Not bulk lead selling</h3>
              </div>
            </div>
            
            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="w-6 h-6 text-red-600" />
                <h3 className="font-semibold text-slate-900">Not shared with unlimited operators</h3>
              </div>
            </div>
            
            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="w-6 h-6 text-red-600" />
                <h3 className="font-semibold text-slate-900">Not pay-per-lead</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
            <p className="font-semibold text-slate-900 mb-3">You still:</p>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Confirm the situation</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Set pricing</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Decide how to proceed</span>
              </li>
            </ul>
            <p className="mt-4 text-slate-900 font-medium">
              We focus on who reaches you, not how you run your business.
            </p>
          </div>
        </div>
      </section>

      {/* Is This a Fit? */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Is This a Fit?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-emerald-50 rounded-xl p-8 border-2 border-emerald-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                This works best if you:
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Actively treat bed bugs</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Want fewer low-intent calls</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Serve a defined service area</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Prefer exclusive coverage</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-amber-50 rounded-xl p-8 border-2 border-amber-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-amber-600" />
                May not be a fit if:
              </h3>
              <p className="text-slate-700">
                If you rely heavily on free inspections or very broad lead volume, this may not be the right fit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Next Step / CTA */}
      <section className="py-24 bg-gradient-to-br from-brand-600 to-brand-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-12 h-12 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Next Step
          </h2>
          <p className="text-xl text-brand-100 mb-8 max-w-2xl mx-auto">
            If you'd like to:
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10 text-left">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-brand-200 shrink-0 mt-0.5" />
              <span className="text-brand-50">See how territories are defined</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-brand-200 shrink-0 mt-0.5" />
              <span className="text-brand-50">Check availability in your area</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-brand-200 shrink-0 mt-0.5" />
              <span className="text-brand-50">Understand expected volume</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-brand-200 shrink-0 mt-0.5" />
              <span className="text-brand-50">Ask direct questions</span>
            </div>
          </div>
          
          <p className="text-lg text-brand-100 mb-8">
            You can review the overview or reach out directly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <Link 
              href="/territories"
              className="inline-flex items-center justify-center gap-2 bg-white text-brand-600 hover:bg-brand-50 text-lg px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              View Territories
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a 
              href="tel:8169622111" 
              className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-white text-lg px-8 py-3 rounded-lg font-semibold transition-colors border border-white/20"
            >
              <PhoneCall className="w-5 h-5" />
              Call (816) 962-2111
            </a>
            <a 
              href="sms:8169622111" 
              className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-white text-lg px-8 py-3 rounded-lg font-semibold transition-colors border border-white/20"
            >
              <MessageSquare className="w-5 h-5" />
              Text
            </a>
          </div>
          
          <p className="text-sm text-brand-200 italic">
            No pressure. If it's not a fit, that's fine.
          </p>
        </div>
      </section>
    </div>
  )
}

