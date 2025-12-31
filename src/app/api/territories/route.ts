import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import type { Tables } from '@/types/database'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const serviceClient = await createServiceClient()
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

      // Don't filter by status at database level - we need to mark DMA-linked territories as taken first
      // Status filtering will be done after we process DMA ownership
      // if (status) {
      //   query = query.eq('status', status)
      // }

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
    // Use service client to bypass RLS and see all ownerships
    const { data: allActiveOwnerships } = await serviceClient
      .from('territory_ownership')
      .select('territory_id')
      .eq('status', 'active')

    console.log('[Territories API] Total active ownership records:', allActiveOwnerships?.length || 0)

    // Get the territory IDs from active ownerships
    const ownedTerritoryIds = new Set<string>(
      allActiveOwnerships?.map(o => o.territory_id) || []
    )

    console.log('[Territories API] Unique owned territory IDs:', ownedTerritoryIds.size)

    // Now fetch territory details for these owned territories to find which ones are DMAs
    const ownedDMAIds = new Set<string>()
    if (ownedTerritoryIds.size > 0) {
      const { data: ownedTerritories } = await serviceClient
        .from('territories')
        .select('id, name, is_dma')
        .in('id', Array.from(ownedTerritoryIds))

      console.log('[Territories API] Fetched territory details for owned territories:', ownedTerritories?.length || 0)

      ownedTerritories?.forEach((territory) => {
        console.log(`[Territories API] Owned territory: ${territory.id} (${territory.name}), is_dma: ${territory.is_dma} (type: ${typeof territory.is_dma})`)
        if (territory.is_dma === true) {
          ownedDMAIds.add(territory.id)
          console.log('[Territories API] Found owned DMA:', territory.id, territory.name)
        }
      })
    }
    
    // Also check for DMAs that have status='taken' directly (in case they don't have ownership records)
    // This handles cases where DMAs are marked as taken in the territories table
    const { data: takenDMAs } = await serviceClient
      .from('territories')
      .select('id, name')
      .eq('is_dma', true)
      .eq('status', 'taken')
    
    takenDMAs?.forEach((dma) => {
      ownedDMAIds.add(dma.id)
      console.log('[Territories API] Found DMA with status=taken:', dma.id, dma.name)
    })

    console.log('[Territories API] Owned DMA IDs:', Array.from(ownedDMAIds))
    console.log('[Territories API] Total active ownerships:', ownedTerritoryIds.size)
    console.log('[Territories API] Total territories fetched:', allTerritories.length)
    
    if (ownedDMAIds.size === 0) {
      console.warn('[Territories API] WARNING: No owned DMAs found! Check if any DMA territories have active ownership records.')
    }
    
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

    // Apply status filter AFTER marking DMA-linked territories as taken
    const statusFilteredTerritories = status
      ? territories.filter(t => t.status === status)
      : territories

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

    return NextResponse.json({ territories: statusFilteredTerritories })
  } catch (error) {
    console.error('Territories API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

