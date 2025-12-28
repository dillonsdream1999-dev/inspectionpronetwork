import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// This endpoint finds the territory and owner company for a given ZIP code
// It properly handles DMA ownership - if a territory is part of a DMA, it returns the DMA owner
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const zip = searchParams.get('zip')

    if (!zip) {
      return NextResponse.json({ error: 'ZIP code is required' }, { status: 400 })
    }

    const supabase = await createServiceClient()

    // Find territory that contains this ZIP code
    const { data: territories, error: territoryError } = await supabase
      .from('territories')
      .select('id, name, dma_id')
      .contains('zip_codes', [zip])
      .limit(1)

    if (territoryError) {
      return NextResponse.json({ error: territoryError.message }, { status: 500 })
    }

    if (!territories || territories.length === 0) {
      return NextResponse.json({ error: 'No territory found for this ZIP code' }, { status: 404 })
    }

    const territory = territories[0]

    // Use the database function to get the owner company (handles DMA ownership)
    const { data: ownerResult, error: ownerError } = await supabase
      .rpc('get_territory_owner', { territory_uuid: territory.id })

    if (ownerError) {
      console.error('Error getting territory owner:', ownerError)
      return NextResponse.json({ error: ownerError.message }, { status: 500 })
    }

    // RPC returns the value directly, not wrapped
    const companyId = ownerResult as string | null

    if (!companyId) {
      return NextResponse.json({ 
        error: 'No active owner found for this territory',
        territory_id: territory.id,
        territory_name: territory.name
      }, { status: 404 })
    }

    return NextResponse.json({
      territory_id: territory.id,
      territory_name: territory.name,
      company_id: companyId
    })
  } catch (error) {
    console.error('ZIP lookup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

