import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Tables } from '@/types/database'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const state = searchParams.get('state')
    const metro = searchParams.get('metro')
    const zip = searchParams.get('zip')
    const status = searchParams.get('status')

    // Use range query to fetch all territories in batches if needed
    // Supabase has a max limit, so we'll fetch in chunks if necessary
    let allTerritories: Tables<'territories'>[] = []
    let offset = 0
    const batchSize = 1000
    let hasMore = true

    while (hasMore) {
      let query = supabase
        .from('territories')
        .select('*, is_dma, dma_id', { count: 'exact' }) // Explicitly select is_dma and dma_id
        .order('state', { ascending: true })
        .order('name', { ascending: true })
        .range(offset, offset + batchSize - 1)

      if (state) {
        query = query.eq('state', state)
      }

      if (metro) {
        query = query.ilike('metro_area', `%${metro}%`)
      }

      if (zip) {
        query = query.contains('zip_codes', [zip])
      }

      if (status) {
        query = query.eq('status', status)
      }

      const { data: batch, error: batchError } = await query

      if (batchError) {
        return NextResponse.json({ error: batchError.message }, { status: 500 })
      }

      if (batch && batch.length > 0) {
        allTerritories = [...allTerritories, ...batch]
        offset += batchSize
        hasMore = batch.length === batchSize
      } else {
        hasMore = false
      }
    }

    // Get all active ownerships and filter to only DMAs
    const { data: allActiveOwnerships } = await supabase
      .from('territory_ownership')
      .select(`
        territory_id,
        territories (is_dma)
      `)
      .eq('status', 'active')

    // Filter to only get DMAs
    const ownedDMAIds = new Set<string>()
    allActiveOwnerships?.forEach((ownership) => {
      // Handle territories as array or single object
      const territories = Array.isArray(ownership.territories) ? ownership.territories : ownership.territories ? [ownership.territories] : []
      const territory = territories[0] as { is_dma?: boolean } | undefined
      
      // If this ownership is for a DMA, add it to our set
      if (territory?.is_dma === true) {
        ownedDMAIds.add(ownership.territory_id)
        console.log('[Territories API] Found owned DMA:', ownership.territory_id, 'is_dma:', territory.is_dma)
      }
    })

    console.log('[Territories API] Owned DMA IDs:', Array.from(ownedDMAIds))
    console.log('[Territories API] Total territories:', allTerritories.length)
    
    // Count territories with dma_id
    const territoriesWithDMA = allTerritories.filter(t => t.dma_id)
    console.log('[Territories API] Territories with dma_id:', territoriesWithDMA.length)
    if (territoriesWithDMA.length > 0) {
      console.log('[Territories API] Sample territory with dma_id:', {
        id: territoriesWithDMA[0].id,
        name: territoriesWithDMA[0].name,
        dma_id: territoriesWithDMA[0].dma_id
      })
    }

    // Update territories to show "taken" if they're linked to an owned DMA
    let markedCount = 0
    const territories = allTerritories.map((territory) => {
      // Check if this territory is linked to an owned DMA
      if (territory.dma_id) {
        // Convert both to strings for comparison (UUIDs might be different types)
        const dmaIdStr = String(territory.dma_id).toLowerCase().trim()
        const isLinkedToOwnedDMA = Array.from(ownedDMAIds).some(ownedId => {
          const ownedIdStr = String(ownedId).toLowerCase().trim()
          return ownedIdStr === dmaIdStr
        })
        
        if (isLinkedToOwnedDMA) {
          markedCount++
          console.log(`[Territories API] Marking territory ${territory.id} (${territory.name}) as taken - linked to DMA ${dmaIdStr}`)
          return {
            ...territory,
            status: 'taken' as const
          }
        }
      }
      return territory
    })
    
    console.log(`[Territories API] Marked ${markedCount} territories as taken due to DMA ownership`)

    // Clean up expired holds
    const { data: expiredHolds } = await supabase
      .from('territory_holds')
      .select('territory_id')
      .lt('expires_at', new Date().toISOString())

    if (expiredHolds && expiredHolds.length > 0) {
      const expiredTerritoryIds = expiredHolds.map(h => h.territory_id)
      
      await supabase
        .from('territories')
        .update({ status: 'available' })
        .in('id', expiredTerritoryIds)
        .eq('status', 'held')

      await supabase
        .from('territory_holds')
        .delete()
        .lt('expires_at', new Date().toISOString())
    }

    return NextResponse.json({ territories })
  } catch (error) {
    console.error('Territories API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

