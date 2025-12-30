import { createClient } from '@/lib/supabase/server'
import { TerritoryAdminTable } from '@/components/admin/TerritoryAdminTable'
import { TerritoryUploader } from '@/components/admin/TerritoryUploader'
import { MakeAllAvailableButton } from '@/components/admin/MakeAllAvailableButton'
import { MapPin, Plus, Upload } from 'lucide-react'
import Link from 'next/link'
import type { Tables } from '@/types/database'
import type { TerritoryStatus } from '@/types/database'

interface TerritoryWithOwnership extends Tables<'territories'> {
  // dma_id and is_dma are now in the base Tables<'territories'> type, so we don't need to redefine them
  territory_ownership: {
    id: string
    company_id: string
    status: string
    price_type: string
    companies: { name: string } | null
  }[] | null // Ensure it can be null or an array
}

export default async function AdminTerritoriesPage() {
  const supabase = await createClient()

  // Fetch all territories in batches to avoid Supabase limit
  let allTerritories: TerritoryWithOwnership[] = []
  let offset = 0
  const batchSize = 1000
  let hasMore = true

  while (hasMore) {
    const { data: batch, error } = await supabase
      .from('territories')
      .select(`
        *,
        territory_ownership (
          id,
          company_id,
          status,
          price_type,
          companies (name)
        )
      `)
      .order('state', { ascending: true })
      .order('name', { ascending: true })
      .range(offset, offset + batchSize - 1)

    if (error) {
      console.error('Error fetching territories:', error)
      break
    }

    if (batch && batch.length > 0) {
      allTerritories = [...allTerritories, ...batch]
      offset += batchSize
      hasMore = batch.length === batchSize
    } else {
      hasMore = false
    }
  }

  // Get all active ownerships with company info
  const { data: allActiveOwnerships } = await supabase
    .from('territory_ownership')
    .select(`
      territory_id,
      company_id,
      companies (name),
      territories (is_dma)
    `)
    .eq('status', 'active')

  // Filter to only get DMAs and create maps
  const ownedDMAIds = new Set<string>()
  const dmaOwnerMap = new Map<string, string>()
  
  allActiveOwnerships?.forEach((ownership) => {
    // Handle territories as array or single object
    const territories = Array.isArray(ownership.territories) ? ownership.territories : ownership.territories ? [ownership.territories] : []
    const territory = territories[0] as { is_dma?: boolean } | undefined
    
    // If this ownership is for a DMA, add it to our sets
    if (territory?.is_dma) {
      // Handle companies as array (Supabase relationship)
      const company = Array.isArray(ownership.companies) ? ownership.companies[0] : ownership.companies
      const companyName = company?.name || 'Unknown'
      ownedDMAIds.add(ownership.territory_id)
      dmaOwnerMap.set(ownership.territory_id, companyName)
      console.log('Admin: Found owned DMA:', ownership.territory_id, 'by', companyName)
    }
  })

  console.log('Admin: Owned DMA IDs:', Array.from(ownedDMAIds))

  // Update territories to show "taken" if they're linked to an owned DMA
  const territories: TerritoryWithOwnership[] = allTerritories.map((territory) => {
    // If territory has dma_id and that DMA is owned, mark as taken
    // Now that dma_id is in the type, we can access it directly
    if (territory.dma_id) {
      // Convert both to strings for comparison (UUIDs might be different types)
      const dmaIdStr = String(territory.dma_id)
      const isLinkedToOwnedDMA = Array.from(ownedDMAIds).some(ownedId => String(ownedId) === dmaIdStr)
      
      if (isLinkedToOwnedDMA) {
        const dmaOwnerName = dmaOwnerMap.get(dmaIdStr) || dmaOwnerMap.get(Array.from(ownedDMAIds).find(ownedId => String(ownedId) === dmaIdStr) || '')
        console.log(`Admin: Marking territory ${territory.id} (${territory.name}) as taken - linked to DMA ${dmaIdStr}`)
        return {
          ...territory,
          status: 'taken' as TerritoryStatus,
          // Add a virtual ownership record to show the DMA owner
          territory_ownership: dmaOwnerName ? [{
            id: `dma-${territory.dma_id}`,
            company_id: '',
            status: 'active',
            price_type: 'base',
            companies: { name: dmaOwnerName }
          }] : (territory.territory_ownership || [])
        }
      }
    }
    return territory
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Territories</h1>
          <p className="text-slate-400 mt-1">Manage territory definitions and availability</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/territories/new"
            className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Territory
          </Link>
        </div>
      </div>

      {/* Bulk Operations */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Uploader */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Upload className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-white">Bulk Import</h2>
          </div>
          <TerritoryUploader />
        </div>

        {/* Make All Available */}
        <MakeAllAvailableButton />
      </div>

      {/* Territories Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-white">All Territories</h2>
            <span className="text-sm text-slate-500">({territories?.length || 0})</span>
          </div>
        </div>
        
        {!territories || territories.length === 0 ? (
          <div className="p-12 text-center">
            <MapPin className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-lg text-slate-400">No territories defined</p>
            <p className="text-sm text-slate-500 mt-1">
              Create territories or import them from a JSON file
            </p>
          </div>
        ) : (
          <TerritoryAdminTable territories={territories} />
        )}
      </div>
    </div>
  )
}

