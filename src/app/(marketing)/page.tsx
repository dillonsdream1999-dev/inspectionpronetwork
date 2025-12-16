import Link from 'next/link'
import { CostComparison } from '@/components/marketing/CostComparison'
import { 
  MapPin, 
  Smartphone, 
  ArrowRight, 
  CheckCircle2, 
  Shield, 
  Calendar,
  Target,
  TrendingDown,
  Zap,
  Users,
  Bot,
  Search,
  AlertTriangle,
  PhoneCall,
  Clock,
  MessageSquare,
  DollarSign,
  Lock,
  BadgeCheck,
  ChevronDown,
  XCircle,
  Inbox
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
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 animate-fade-in">
              <Shield className="w-4 h-4 text-brand-400" />
              <span className="text-sm font-medium">Exclusive Territories • Month-to-Month • Cancel Anytime</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-slide-up">
              Bed Bug Pros:{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">
                Get Exclusive Access to High-Intent Homeowners
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl mx-auto animate-slide-up animation-delay-100">
              Homeowners complete guided bed bug inspections in our app—then request professional help. 
              Claim your territory and be the only treatment company who receives those requests.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animation-delay-200 relative z-10">
              <Link 
                href="/territories" 
                className="inline-flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white text-lg px-8 py-3 rounded-lg font-semibold transition-colors cursor-pointer"
              >
                Check Territory Availability
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a 
                href="#what-is-ipn" 
                className="inline-flex items-center justify-center gap-2 text-white hover:bg-white/10 text-lg px-8 py-3 rounded-lg font-semibold transition-colors cursor-pointer border border-white/20"
              >
                Learn More
                <ChevronDown className="w-5 h-5" />
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
              <Calendar className="w-6 h-6 text-brand-500" />
              <span className="font-medium text-slate-700">Month-to-Month Subscription</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Shield className="w-6 h-6 text-accent-500" />
              <span className="font-medium text-slate-700">Cancel Anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* What is Inspection Pro Network */}
      <section id="what-is-ipn" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              What is Inspection Pro Network?
            </h2>
            <p className="text-xl text-slate-600">
              A private referral network that routes high-intent bed bug inspection requests 
              to <strong className="text-slate-900">one exclusive operator per territory</strong>.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center mb-6">
                <Inbox className="w-6 h-6 text-brand-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Where Leads Come From</h3>
              <p className="text-slate-600 mb-4">
                Requests come from homeowners who used the <strong>Bed Bug Inspection Pro</strong> app 
                to inspect their home and believe they may have bed bug indicators.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Completed a structured inspection process</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Found signs consistent with bed bugs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Requested professional confirmation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Entered contact details and location</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-6">
                <BadgeCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">What Makes Them High-Intent</h3>
              <p className="text-slate-600 mb-4">
                These homeowners have already taken action. They're not just Googling—they're preparing 
                to solve a problem.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Spent time inspecting instead of guessing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Moved past "do I have bed bugs?" panic-searching</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Decided they want professional confirmation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Prepared to schedule an inspection</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 bg-brand-50 rounded-2xl p-8 max-w-3xl mx-auto border border-brand-200">
            <p className="text-center text-brand-900 text-lg">
              <strong>You're not buying cold scraped contacts.</strong> You're receiving inbound requests 
              from homeowners who are typically further along than standard Google or directory leads.
            </p>
          </div>
        </div>
      </section>

      {/* Not a Typical Lead Network */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Not a Typical Lead Network
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Yes, it's a lead network—but it behaves like an exclusive referral channel, 
              not a shared lead marketplace.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Typical Lead Networks */}
            <div className="bg-red-50 rounded-2xl p-8 border-2 border-red-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Typical Lead Networks</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-red-700 text-xs font-bold">✕</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Sell leads to multiple companies</p>
                    <p className="text-sm text-slate-600">You're racing against 3-5 other operators for every lead</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-red-700 text-xs font-bold">✕</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Create price-shopping behavior</p>
                    <p className="text-sm text-slate-600">Homeowners learn to pit companies against each other</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-red-700 text-xs font-bold">✕</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Attract low-intent inquiries</p>
                    <p className="text-sm text-slate-600">Many leads are just shopping around or not serious</p>
                  </div>
                </li>
              </ul>
            </div>
            
            {/* Inspection Pro Network */}
            <div className="bg-emerald-50 rounded-2xl p-8 border-2 border-emerald-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Inspection Pro Network</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-emerald-700 text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Routes exclusively (one operator per territory)</p>
                    <p className="text-sm text-slate-600">You're not competing—requests in your area go to you</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-emerald-700 text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Generates inspection-intent requests</p>
                    <p className="text-sm text-slate-600">Not general pest calls—specific bed bug inspection needs</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-emerald-700 text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Uses the app as a filter</p>
                    <p className="text-sm text-slate-600">Reduces tire-kickers and education time</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our inspection-driven platform connects you with homeowners who have already 
              taken action to investigate a potential problem.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 h-full shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center mb-6">
                  <Smartphone className="w-7 h-7 text-brand-600" />
                </div>
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Homeowners Use the App
                </h3>
                <p className="text-slate-600">
                  Concerned homeowners download Bed Bug Inspection Pro and complete a guided 
                  self-inspection—checking mattress seams, headboards, furniture, and more.
                </p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 h-full shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-accent-100 flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-accent-600" />
                </div>
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-accent-500 text-white flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  They Request Professional Help
                </h3>
                <p className="text-slate-600">
                  After finding signs (or strong suspicion), they request professional confirmation 
                  and next steps—entering their contact details and location.
                </p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 h-full shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6">
                  <MapPin className="w-7 h-7 text-emerald-600" />
                </div>
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Routed Exclusively to You
                </h3>
                <p className="text-slate-600">
                  Requests are routed exclusively to the territory owner. No competing with 
                  other companies—you receive the lead and handle outreach directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Not Google Ads */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                Why Not Google Ads?
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Digital advertising for pest control is notoriously expensive and unpredictable. 
                Territory access offers a different approach.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                    <TrendingDown className="w-5 h-5 text-red-600 rotate-180" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Expensive</h4>
                    <p className="text-slate-600 text-sm">High CPCs for pest control keywords, often $20-50+ per click</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Competitive</h4>
                    <p className="text-slate-600 text-sm">Bidding against national franchises and aggregators</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Volatile</h4>
                    <p className="text-slate-600 text-sm">Costs fluctuate with season and competition</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-brand-50 rounded-xl border border-brand-200">
                <p className="text-brand-900 font-medium">
                  Compare predictable territory access vs. bidding wars. 
                  <span className="block mt-2 text-brand-700 text-sm">
                    $250/month for exclusive access—designed so one inspection/treatment covers the month.
                  </span>
                </p>
              </div>
            </div>
            
            <div>
              <CostComparison />
            </div>
          </div>
        </div>
      </section>

      {/* Google AI Overview Impact */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 rounded-full px-4 py-2 mb-6">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Industry Shift</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Google AI Overviews Changed Everything
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              The bed bug industry is experiencing a fundamental shift in how homeowners 
              find and contact pest control professionals.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* The Problem */}
            <div className="bg-white rounded-2xl p-8 border-2 border-red-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">The AI Overview Problem</h3>
              </div>
              
              <div className="space-y-4 text-slate-700">
                <p>
                  When homeowners Google "do I have bed bugs?" or "bed bug signs," Google's AI now 
                  provides instant answers directly in search results. Users get their questions 
                  answered without ever clicking through to your website.
                </p>
                <p>
                  <strong className="text-red-700">The result?</strong> Fewer clicks, fewer calls, 
                  and dramatically reduced organic traffic for pest control companies—even those 
                  who invested heavily in SEO.
                </p>
                
                <div className="bg-red-50 rounded-lg p-4 border border-red-200 mt-6">
                  <div className="flex items-start gap-3">
                    <Search className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                    <div>
                      <p className="font-medium text-slate-900 mb-1">Zero-Click Searches</p>
                      <p className="text-sm text-slate-600">
                        AI Overviews satisfy user queries instantly, meaning homeowners 
                        never reach your site—even if you rank #1.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* The Opportunity */}
            <div className="bg-white rounded-2xl p-8 border-2 border-emerald-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <PhoneCall className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">The High-Intent Opportunity</h3>
              </div>
              
              <div className="space-y-4 text-slate-700">
                <p>
                  Here's what Google can't replace: <strong className="text-emerald-700">the moment 
                  a homeowner decides they need professional help.</strong>
                </p>
                <p>
                  Bed Bug Inspection Pro captures users at exactly this inflection point. After 
                  completing a guided self-inspection—checking mattress seams, headboards, and 
                  furniture—many users realize they need expert eyes on the situation.
                </p>
                <p>
                  <strong className="text-emerald-700">These aren't casual researchers.</strong> They've 
                  already invested 10-15 minutes inspecting their home. They're concerned, motivated, 
                  and ready to take action.
                </p>
                
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200 mt-6">
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                    <div>
                      <p className="font-medium text-slate-900 mb-1">Action-Ready Homeowners</p>
                      <p className="text-sm text-slate-600">
                        Users who complete an inspection and request help have demonstrated 
                        genuine concern and intent to solve their problem.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom callout */}
          <div className="mt-12 bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-3">
              Bypass Google Ads. Connect Directly with Homeowners.
            </h3>
            <p className="text-brand-100 max-w-2xl mx-auto mb-6">
              While your competitors burn money on expensive clicks and bidding wars, you'll have 
              exclusive access to high-intent leads generated through our inspection app.
            </p>
            <Link href="/territories" className="inline-flex items-center gap-2 bg-white text-brand-700 hover:bg-brand-50 font-semibold px-6 py-3 rounded-lg transition-colors">
              Claim Your Territory
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              What You Receive With Each Lead
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to make contact and close the inspection.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-slate-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-brand-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">Contact Name</h4>
              <p className="text-sm text-slate-600">Homeowner's name for personalized outreach</p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-4">
                <PhoneCall className="w-6 h-6 text-brand-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">Phone / Email</h4>
              <p className="text-sm text-slate-600">Direct contact information</p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-brand-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">Service Address</h4>
              <p className="text-sm text-slate-600">ZIP/city or full address</p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-brand-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">Context</h4>
              <p className="text-sm text-slate-600">What they found and where they looked</p>
            </div>
          </div>
          
          <div className="mt-12 bg-amber-50 rounded-xl p-6 max-w-2xl mx-auto border border-amber-200">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 mt-1 shrink-0" />
              <div>
                <p className="font-semibold text-slate-900 mb-1">Speed Matters</p>
                <p className="text-sm text-slate-700">
                  Fast response = higher close rate. We recommend initial contact within 5-15 minutes, 
                  with same-day scheduling options whenever possible. Operators who win treat these 
                  like inbound emergency work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-slate-600">
              Flat monthly fee. No per-lead charges. No long-term contracts.
            </p>
          </div>
          
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl p-8 border-2 border-brand-500 relative shadow-lg">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-brand-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                  Exclusive Territory
                </span>
              </div>
              
              <div className="text-center mb-8">
                <div className="text-5xl font-bold text-slate-900 mb-2">
                  $250<span className="text-2xl font-normal text-slate-500">/mo</span>
                </div>
                <p className="text-slate-500">per territory • month-to-month</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-slate-700">Territory exclusivity—no competing operators</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-slate-700">All inbound inspection requests routed to you</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-slate-700">Lead management dashboard</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-slate-700">Cancel anytime—no long-term commitment</span>
                </li>
              </ul>
              
              <div className="bg-accent-50 rounded-lg p-4 mb-6 border border-accent-200">
                <p className="text-sm text-accent-900 font-medium">
                  💰 Adjacent Territory Discount
                </p>
                <p className="text-sm text-accent-700 mt-1">
                  Expand your coverage for $220/mo per additional adjacent territory ($30 savings each)
                </p>
              </div>
              
              <Link href="/territories" className="flex items-center justify-center gap-2 w-full bg-brand-600 hover:bg-brand-700 text-white text-lg py-3 rounded-lg font-semibold transition-colors">
                Browse Territories
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <p className="text-center text-sm text-slate-500 mt-4">
                Designed so one inspection/treatment covers the month.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="space-y-6">
            {/* FAQ Item */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-2">Are the leads shared with other companies?</h3>
              <p className="text-slate-600">
                <strong>No.</strong> Inspection Pro Network is exclusive by territory. You're not competing 
                with 3 other companies for the same request. If your territory is assigned to you, 
                requests in that area route to you only.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-2">What do you mean by "territory"?</h3>
              <p className="text-slate-600">
                A territory is typically defined by a metro area, county grouping, or set of zip codes 
                (depending on density). The goal is simple: no overlap and no bidding wars. As the 
                network grows, territory definitions can tighten to stay fair and profitable for operators.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-2">How many leads will I get per month?</h3>
              <p className="text-slate-600">
                Lead volume depends on population density, seasonality, local demand, and territory size. 
                We will not promise a fixed number of leads—that's how lead networks overpromise and underdeliver. 
                The pitch is: <strong>inspection-ready opportunities routed exclusively</strong>. Early on, 
                we focus on quality and exclusivity while refining what converts best.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-2">Do I pay per lead?</h3>
              <p className="text-slate-600">
                <strong>No.</strong> We use a flat monthly model because operators want predictable cost, 
                we want operator feedback (not transactional churn), and it avoids the "lead seller" feel. 
                If we ever introduce optional pay-per-lead add-ons later, founding operators will be 
                notified first and protected.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-2">What if a homeowner doesn't actually have bed bugs?</h3>
              <p className="text-slate-600">
                That happens in real life. These are high-intent suspicion leads, not guaranteed infestations. 
                But even false positives are valuable—you can charge for inspection/confirmation, build trust 
                and referral potential, and become their go-to if the problem appears later. Your close rate 
                depends on whether you sell inspection as a service.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-2">Will you list multiple operators in my territory?</h3>
              <p className="text-slate-600">
                <strong>No, not during the founding model.</strong> Exclusivity is the whole point. If the 
                network grows to where demand exceeds one operator's capacity, we expand territories or 
                create adjacent territories—we don't stack competitors on top of you.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-2">Do you require a specific inspection price or treatment method?</h3>
              <p className="text-slate-600">
                <strong>No.</strong> You run your business—you set pricing, decide treatment methods, 
                and manage scheduling and customer experience. We are the referral and qualification layer, 
                not your operations manager.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-2">What are the requirements to join?</h3>
              <p className="text-slate-600 mb-3">
                Baseline expectations: you actively offer bed bug inspections and/or treatment, 
                you can respond quickly to inbound requests, you have basic professionalism and follow-through, 
                and you agree not to misrepresent the network or app to homeowners.
              </p>
              <p className="text-slate-600">
                <em>Optional but helpful:</em> Reviews and proof of experience, K9 inspection capability, 
                heat treatment capability.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-2">Can I buy additional territories?</h3>
              <p className="text-slate-600">
                <strong>Yes</strong> (if available). We can structure add-on territories as adjacent 
                territories at a discount ($220/mo), radius expansion, or secondary markets you already serve.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-2">What should I say when I call the lead?</h3>
              <p className="text-slate-600 mb-3">
                Simple is best:
              </p>
              <p className="text-slate-800 italic bg-white p-4 rounded-lg border border-slate-200">
                "Hi — this is [Name] with [Company]. You requested a bed bug inspection follow-up after 
                using the Inspection Pro app. I'm local in your area. When can we schedule a professional 
                inspection to confirm what you found?"
              </p>
              <p className="text-slate-600 mt-3">
                Then stop talking and let them answer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-brand-600 to-brand-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Claim Your Territory?
          </h2>
          <p className="text-xl text-brand-100 mb-8">
            Check availability in your area and secure exclusive access to 
            inspection-driven homeowner demand.
          </p>
          <Link href="/territories" className="inline-flex items-center gap-2 bg-white text-brand-700 hover:bg-brand-50 text-lg px-8 py-3 rounded-lg font-semibold transition-colors">
            Check Territory Availability
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
