import { createClient } from '@/lib/supabase/server'
import { 
  TrendingUp, 
  Users, 
  Phone, 
  CheckCircle2,
  Clock
} from 'lucide-react'

export default async function AnalyticsPage() {
  const supabase = await createClient()

  // Get date ranges
  const now = new Date()
  const today = new Date(now.setHours(0, 0, 0, 0))
  const last7Days = new Date(today)
  last7Days.setDate(last7Days.getDate() - 7)
  const last30Days = new Date(today)
  last30Days.setDate(last30Days.getDate() - 30)
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Total leads
  const { count: totalLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })

  // Leads this month
  const { count: leadsThisMonth } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', thisMonth.toISOString())

  // Leads last 30 days
  const { count: leadsLast30Days } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', last30Days.toISOString())

  // Leads by status
  const { count: newLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new')

  const { count: contactedLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'contacted')

  const { count: bookedLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'booked')

  // Recent leads (last 10)
  const { data: recentLeads } = await supabase
    .from('leads')
    .select(`
      id,
      created_at,
      status,
      zip,
      room_type,
      contact_pref,
      territories (name, state),
      companies (name)
    `)
    .order('created_at', { ascending: false })
    .limit(10)

  // Territory statistics (commented out - not currently used in UI)
  // const { count: totalTerritories } = await supabase
  //   .from('territories')
  //   .select('*', { count: 'exact', head: true })
  //   .eq('is_dma', false)

  // const { count: availableTerritories } = await supabase
  //   .from('territories')
  //   .select('*', { count: 'exact', head: true })
  //   .eq('status', 'available')
  //   .eq('is_dma', false)

  // const { count: takenTerritories } = await supabase
  //   .from('territories')
  //   .select('*', { count: 'exact', head: true })
  //   .eq('status', 'taken')
  //   .eq('is_dma', false)

  // Active subscriptions
  const { count: activeSubscriptions } = await supabase
    .from('territory_ownership')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  // Companies with active subscriptions
  const { data: activeCompanies } = await supabase
    .from('companies')
    .select(`
      id,
      name,
      created_at,
      territory_ownership!inner (id, status)
    `)
    .eq('territory_ownership.status', 'active')

  // Leads by contact preference
  const { count: phoneLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('contact_pref', 'phone')

  const { count: emailLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('contact_pref', 'email')

  const { count: textLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('contact_pref', 'text')

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Analytics & Tracking</h1>
        <p className="text-slate-400 mt-1">Platform usage statistics and metrics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
              <Phone className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{totalLeads || 0}</p>
          <p className="text-sm text-slate-400">Total Leads</p>
          <p className="text-xs text-slate-500 mt-2">{leadsThisMonth || 0} this month</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{bookedLeads || 0}</p>
          <p className="text-sm text-slate-400">Booked Leads</p>
          <p className="text-xs text-slate-500 mt-2">
            {totalLeads ? `${Math.round(((bookedLeads || 0) / totalLeads) * 100)}%` : '0%'} conversion
          </p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{activeSubscriptions || 0}</p>
          <p className="text-sm text-slate-400">Active Subscriptions</p>
          <p className="text-xs text-slate-500 mt-2">{new Set(activeCompanies?.map(c => c.id) || []).size} companies</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-600/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{leadsLast30Days || 0}</p>
          <p className="text-sm text-slate-400">Leads (Last 30 Days)</p>
          <p className="text-xs text-slate-500 mt-2">
            {leadsLast30Days ? Math.round((leadsLast30Days / 30) * 10) / 10 : 0} per day avg
          </p>
        </div>
      </div>

      {/* Lead Status Breakdown */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800 rounded-xl border border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-lg font-bold text-white">Lead Status Breakdown</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    New
                  </span>
                  <span className="text-white font-medium">{newLeads || 0}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${totalLeads ? ((newLeads || 0) / totalLeads) * 100 : 0}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contacted
                  </span>
                  <span className="text-white font-medium">{contactedLeads || 0}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-amber-500 h-2 rounded-full" 
                    style={{ width: `${totalLeads ? ((contactedLeads || 0) / totalLeads) * 100 : 0}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Booked
                  </span>
                  <span className="text-white font-medium">{bookedLeads || 0}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full" 
                    style={{ width: `${totalLeads ? ((bookedLeads || 0) / totalLeads) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Preference Breakdown */}
        <div className="bg-slate-800 rounded-xl border border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-lg font-bold text-white">Contact Preference</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400">Phone</span>
                  <span className="text-white font-medium">{phoneLeads || 0}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${totalLeads ? ((phoneLeads || 0) / totalLeads) * 100 : 0}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400">Email</span>
                  <span className="text-white font-medium">{emailLeads || 0}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${totalLeads ? ((emailLeads || 0) / totalLeads) * 100 : 0}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400">Text</span>
                  <span className="text-white font-medium">{textLeads || 0}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full" 
                    style={{ width: `${totalLeads ? ((textLeads || 0) / totalLeads) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="bg-slate-800 rounded-xl border border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-lg font-bold text-white">Recent Leads</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Territory
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  ZIP
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Contact
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {recentLeads && recentLeads.length > 0 ? (
                recentLeads.map((lead: {
                  id: string
                  created_at: string
                  status: string
                  zip: string
                  contact_pref: string
                  territories: { name: string; state: string } | null
                  companies: { name: string } | null
                }) => {
                  const territory = lead.territories as { name: string; state: string } | null
                  const company = lead.companies as { name: string } | null
                  
                  const statusColors = {
                    new: 'bg-blue-500/20 text-blue-400',
                    contacted: 'bg-amber-500/20 text-amber-400',
                    booked: 'bg-emerald-500/20 text-emerald-400',
                    not_a_fit: 'bg-slate-500/20 text-slate-400'
                  }

                  return (
                    <tr key={lead.id} className="hover:bg-slate-700/30">
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {territory ? `${territory.name}, ${territory.state}` : '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {company?.name || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {lead.zip || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[lead.status as keyof typeof statusColors] || statusColors.new}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300 capitalize">
                        {lead.contact_pref || '—'}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No leads yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}



