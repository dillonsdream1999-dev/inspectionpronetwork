import { createClient } from '@/lib/supabase/server'
import { MapPin, Building2, Users2, DollarSign } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Get counts - separate individual territories from DMAs
  const { count: individualTerritoriesCount } = await supabase
    .from('territories')
    .select('*', { count: 'exact', head: true })
    .eq('is_dma', false)

  const { count: individualAvailableCount } = await supabase
    .from('territories')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'available')
    .eq('is_dma', false)

  const { count: individualTakenCount } = await supabase
    .from('territories')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'taken')
    .eq('is_dma', false)

  const { count: companiesCount } = await supabase
    .from('companies')
    .select('*', { count: 'exact', head: true })

  const { count: leadsCount } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })

  // Get active subscriptions with territory DMA info
  const { data: activeSubscriptions } = await supabase
    .from('territory_ownership')
    .select(`
      price_type,
      territories (id, is_dma, dma_id)
    `)
    .eq('status', 'active')

  // Get all active DMA IDs
  const activeDmaIds = new Set(
    activeSubscriptions
      ?.filter(sub => {
        // Handle territories as potentially array or object
        const territories = sub.territories as unknown
        if (Array.isArray(territories)) {
          return territories.some((t: { is_dma?: boolean }) => t?.is_dma === true)
        }
        const territory = territories as { is_dma?: boolean } | null | undefined
        return territory?.is_dma === true
      })
      .map(sub => {
        // Handle territories as potentially array or object
        const territories = sub.territories as unknown
        if (Array.isArray(territories)) {
          const dmaTerritory = territories.find((t: { is_dma?: boolean }) => t?.is_dma === true)
          return dmaTerritory?.id
        }
        const territory = territories as { id: string; is_dma?: boolean } | null | undefined
        return territory?.is_dma === true ? territory.id : undefined
      })
      .filter((id): id is string => !!id) || []
  )

  // Get all individual territories covered by active DMAs
  const { data: dmaCoveredTerritories } = await supabase
    .from('territories')
    .select('id')
    .in('dma_id', Array.from(activeDmaIds))
    .eq('is_dma', false) // Ensure we only get individual territories

  const dmaCoveredTerritoryIds = new Set(dmaCoveredTerritories?.map(t => t.id) || [])

  // Calculate MRR and subscription counts, avoiding double-counting
  let mrr = 0
  let baseSubscriptionsCount = 0
  let adjacentSubscriptionsCount = 0
  let dmaSubscriptionsCount = 0
  let dmaCoveredIndividualTerritoriesCount = 0

  activeSubscriptions?.forEach(sub => {
    // Handle territories as potentially array or object
    const territories = sub.territories as unknown
    let territory: { id: string; is_dma?: boolean } | null = null
    
    if (Array.isArray(territories)) {
      territory = territories[0] as { id: string; is_dma?: boolean } | null
    } else {
      territory = territories as { id: string; is_dma?: boolean } | null
    }
    
    if (!territory) return

    const isDMA = territory.is_dma || false

    if (isDMA) {
      mrr += 3000
      dmaSubscriptionsCount++
    } else if (!dmaCoveredTerritoryIds.has(territory.id)) {
      // Only count individual territories if they are NOT covered by a DMA subscription
      if (sub.price_type === 'adjacent') {
        mrr += 150
        adjacentSubscriptionsCount++
      } else {
        mrr += 250
        baseSubscriptionsCount++
      }
    } else {
      // This individual territory is covered by a DMA, so it's not counted as a separate base/adjacent sub
      dmaCoveredIndividualTerritoriesCount++
    }
  })

  // Get DMA count
  const { count: dmaCount } = await supabase
    .from('territories')
    .select('*', { count: 'exact', head: true })
    .eq('is_dma', true)

  const { count: dmaTakenCount } = await supabase
    .from('territories')
    .select('*', { count: 'exact', head: true })
    .eq('is_dma', true)
    .eq('status', 'taken')

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
          <p className="text-3xl font-bold text-white">{individualTerritoriesCount || 0}</p>
          <p className="text-sm text-slate-400">Individual Territories</p>
          <div className="mt-2 text-xs text-slate-500">
            {individualAvailableCount} available • {individualTakenCount} taken
            {dmaCount && dmaCount > 0 && (
              <span className="block mt-1">🏆 {dmaCount} DMAs ({dmaTakenCount || 0} taken)</span>
            )}
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
                <span className="text-white font-medium">{individualAvailableCount}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full" 
                  style={{ width: `${((individualAvailableCount || 0) / (individualTerritoriesCount || 1)) * 100}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Taken</span>
                <span className="text-white font-medium">{individualTakenCount}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${((individualTakenCount || 0) / (individualTerritoriesCount || 1)) * 100}%` }}
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
                  {baseSubscriptionsCount} (${(baseSubscriptionsCount * 250).toLocaleString()}/mo)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Adjacent subscriptions ($150)</span>
                <span className="text-white font-medium">
                  {adjacentSubscriptionsCount} (${(adjacentSubscriptionsCount * 150).toLocaleString()}/mo)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">🏆 DMA subscriptions ($3,000)</span>
                <span className="text-white font-medium">
                  {dmaSubscriptionsCount} (${(dmaSubscriptionsCount * 3000).toLocaleString()}/mo)
                </span>
              </div>
              {dmaCoveredIndividualTerritoriesCount > 0 && (
                <div className="flex items-center justify-between text-xs text-slate-500 italic">
                  <span>(Excluding {dmaCoveredIndividualTerritoriesCount} individual territories covered by DMAs)</span>
                  <span></span>
                </div>
              )}
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

