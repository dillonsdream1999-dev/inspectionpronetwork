import { createClient } from '@/lib/supabase/server'
import { MapPin, Building2, Users2, DollarSign } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Get counts
  const { count: territoriesCount } = await supabase
    .from('territories')
    .select('*', { count: 'exact', head: true })

  const { count: availableCount } = await supabase
    .from('territories')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'available')

  const { count: takenCount } = await supabase
    .from('territories')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'taken')

  const { count: companiesCount } = await supabase
    .from('companies')
    .select('*', { count: 'exact', head: true })

  const { count: leadsCount } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })

  const { data: activeSubscriptions } = await supabase
    .from('territory_ownership')
    .select('price_type')
    .eq('status', 'active')

  const mrr = activeSubscriptions?.reduce((acc, sub) => {
    return acc + (sub.price_type === 'adjacent' ? 220 : 250)
  }, 0) || 0

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-slate-400 mt-1">Overview of platform metrics</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-brand-600/20 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-brand-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{territoriesCount || 0}</p>
          <p className="text-sm text-slate-400">Total Territories</p>
          <div className="mt-2 text-xs text-slate-500">
            {availableCount} available • {takenCount} taken
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{companiesCount || 0}</p>
          <p className="text-sm text-slate-400">Registered Companies</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center">
              <Users2 className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{leadsCount || 0}</p>
          <p className="text-sm text-slate-400">Total Leads</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-accent-600/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-accent-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">${mrr.toLocaleString()}</p>
          <p className="text-sm text-slate-400">Monthly Recurring Revenue</p>
          <div className="mt-2 text-xs text-slate-500">
            {activeSubscriptions?.length || 0} active subscriptions
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl border border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-lg font-bold text-white">Territory Breakdown</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Available</span>
                <span className="text-white font-medium">{availableCount}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full" 
                  style={{ width: `${((availableCount || 0) / (territoriesCount || 1)) * 100}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Taken</span>
                <span className="text-white font-medium">{takenCount}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${((takenCount || 0) / (territoriesCount || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-lg font-bold text-white">Revenue Breakdown</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Base subscriptions ($250)</span>
                <span className="text-white font-medium">
                  {activeSubscriptions?.filter(s => s.price_type === 'base').length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Adjacent subscriptions ($220)</span>
                <span className="text-white font-medium">
                  {activeSubscriptions?.filter(s => s.price_type === 'adjacent').length || 0}
                </span>
              </div>
              <div className="border-t border-slate-700 pt-4 flex items-center justify-between">
                <span className="text-white font-medium">Total MRR</span>
                <span className="text-2xl font-bold text-emerald-400">${mrr.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

