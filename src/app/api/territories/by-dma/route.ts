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
    const { data: territories, error } = await supabase
      .from('territories')
      .select('id, name, state, metro_area, population_est, zip_codes, status')
      .eq('dma_id', dmaId)
      .eq('is_dma', false) // Only fetch individual territories
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

    console.log(`[by-dma API] DMA ${dmaId} is ${isDMAOwned ? 'owned' : 'not owned'}, marking ${territoriesWithStatus.length} territories as ${isDMAOwned ? 'taken' : territory.status}`)

    return NextResponse.json({ territories: territoriesWithStatus })
  } catch (error) {
    console.error('API error fetching territories by DMA:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



