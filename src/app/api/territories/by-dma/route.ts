import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const dmaId = searchParams.get('dmaId')

    if (!dmaId) {
      return NextResponse.json({ error: 'DMA ID is required' }, { status: 400 })
    }

    // Check if the DMA is owned
    const { data: dmaOwnership } = await supabase
      .from('territory_ownership')
      .select('id, status')
      .eq('territory_id', dmaId)
      .eq('status', 'active')
      .single()

    const isDMAOwned = !!dmaOwnership

    // Fetch territories linked to this DMA
    // Use .neq('is_dma', true) to get all non-DMA territories (including those where is_dma is null)
    const { data: territories, error } = await supabase
      .from('territories')
      .select('id, name, state, metro_area, population_est, zip_codes, status, dma_id')
      .eq('dma_id', dmaId)
      .neq('is_dma', true) // Only fetch individual territories (exclude DMAs, include null)
      .order('name', { ascending: true })

    if (error) {
      console.error('Supabase query error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // If DMA is owned, mark all linked territories as "taken"
    const territoriesWithStatus = territories?.map(territory => ({
      ...territory,
      status: isDMAOwned ? 'taken' as const : territory.status
    })) || []

    console.log(`[by-dma API] DMA ${dmaId} is ${isDMAOwned ? 'owned' : 'not owned'}, found ${territoriesWithStatus.length} linked territories`)
    if (territoriesWithStatus.length === 0) {
      console.warn(`[by-dma API] WARNING: No territories found with dma_id=${dmaId}. Checking if any territories have this dma_id...`)
      // Debug: Check if any territories have this dma_id at all
      const { data: allWithDmaId } = await supabase
        .from('territories')
        .select('id, name, is_dma, dma_id')
        .eq('dma_id', dmaId)
        .limit(10)
      console.log(`[by-dma API] Territories with dma_id=${dmaId}:`, allWithDmaId)
    }

    return NextResponse.json({ territories: territoriesWithStatus })
  } catch (error) {
    console.error('API error fetching territories by DMA:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



