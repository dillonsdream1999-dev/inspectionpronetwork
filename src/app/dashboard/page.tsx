import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { 
  MapPin, 
  Users2, 
  TrendingUp, 
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Phone
} from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get company
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('owner_user_id', user.id)
    .single()

  if (!company) {
    redirect('/dashboard/settings?setup=true')
  }

  // Get active territories
  const { data: territories } = await supabase
    .from('territory_ownership')
    .select(`
      *,
      territories (*)
    `)
    .eq('company_id', company.id)
    .eq('status', 'active')

  // Get recent leads
  const { data: recentLeads } = await supabase
    .from('leads')
    .select('*')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false })
    .limit(5)

  // Get lead counts
  const { count: newLeadsCount } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', company.id)
    .eq('status', 'new')

  const { count: totalLeadsCount } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', company.id)

  const territoryCount = territories?.length || 0
  const monthlySpend = territories?.reduce((acc, t) => {
    return acc + (t.price_type === 'adjacent' ? 150 : 250)
  }, 0) || 0

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back, {company.name}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-brand-600" />
              </div>
              <span className="badge-info">Active</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{territoryCount}</p>
            <p className="text-sm text-slate-500">Active Territories</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Users2 className="w-6 h-6 text-emerald-600" />
              </div>
              {(newLeadsCount || 0) > 0 && (
                <span className="badge-success">{newLeadsCount} new</span>
              )}
            </div>
            <p className="text-3xl font-bold text-slate-900">{totalLeadsCount || 0}</p>
            <p className="text-sm text-slate-500">Total Leads</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">${monthlySpend}</p>
            <p className="text-sm text-slate-500">Monthly Subscription</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {recentLeads?.filter(l => l.status === 'booked').length || 0}
            </p>
            <p className="text-sm text-slate-500">Booked Jobs</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Leads */}
          <div className="card">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Recent Leads</h2>
                <Link 
                  href="/dashboard/leads" 
                  className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  View all
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {!recentLeads || recentLeads.length === 0 ? (
              <div className="p-8 text-center">
                <Users2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No leads yet</p>
                <p className="text-sm text-slate-500 mt-1">
                  Leads will appear here when homeowners request help in your territory
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentLeads.map((lead) => {
                  const statusConfig = {
                    new: { icon: AlertCircle, class: 'text-amber-500' },
                    contacted: { icon: Clock, class: 'text-blue-500' },
                    booked: { icon: CheckCircle2, class: 'text-emerald-500' },
                    not_a_fit: { icon: AlertCircle, class: 'text-slate-400' }
                  }
                  const status = statusConfig[lead.status as keyof typeof statusConfig] || statusConfig.new
                  const StatusIcon = status.icon

                  return (
                    <Link
                      key={lead.id}
                      href={`/dashboard/leads/${lead.id}`}
                      className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors"
                    >
                      <StatusIcon className={`w-5 h-5 ${status.class}`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">
                          {lead.contact_name || 'Anonymous'}
                        </p>
                        <p className="text-sm text-slate-500">
                          {lead.zip} • {lead.room_type || 'Not specified'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-slate-400 capitalize">{lead.status.replace('_', ' ')}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Active Territories */}
          <div className="card">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">My Territories</h2>
                <Link 
                  href="/dashboard/territories" 
                  className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  Manage
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {!territories || territories.length === 0 ? (
              <div className="p-8 text-center">
                <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No active territories</p>
                <Link 
                  href="/territories" 
                  className="btn-primary mt-4"
                >
                  Browse Territories
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {territories.map((ownership) => {
                  const territory = ownership.territories as {
                    name: string
                    state: string
                    type: string
                    population_est: number
                  } | null

                  return (
                    <div key={ownership.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">
                            {territory?.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            {territory?.state} • ~{territory?.population_est?.toLocaleString()} pop.
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-slate-900">
                            ${ownership.price_type === 'adjacent' ? 150 : 250}/mo
                          </p>
                          {ownership.price_type === 'adjacent' && (
                            <span className="text-xs text-emerald-600">Adjacent discount</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}

                <div className="p-4 bg-slate-50">
                  <Link 
                    href="/territories" 
                    className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1"
                  >
                    <MapPin className="w-4 h-4" />
                    Add another territory
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

