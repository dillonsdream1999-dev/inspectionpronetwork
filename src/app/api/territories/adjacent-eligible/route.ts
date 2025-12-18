import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ eligible: [] })
    }

    // Get user's company
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('owner_user_id', user.id)
      .single()

    if (!company) {
      return NextResponse.json({ eligible: [] })
    }

    // Get all active territories owned by this company
    const { data: ownedTerritoriesRaw } = await supabase
      .from('territory_ownership')
      .select('territory_id, territories(adjacent_ids)')
      .eq('company_id', company.id)
      .eq('status', 'active')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ownedTerritories = ownedTerritoriesRaw as any[] | null

    if (!ownedTerritories || ownedTerritories.length === 0) {
      return NextResponse.json({ eligible: [] })
    }

    // Get owned territory IDs
    const ownedIds = ownedTerritories.map((ot: { territory_id: string }) => ot.territory_id)

    // Collect all adjacent territory IDs from owned territories
    const adjacentIds = new Set<string>()
    ownedTerritories.forEach((ot) => {
      const territory = ot.territories as { adjacent_ids?: string[] } | null
      if (territory?.adjacent_ids && Array.isArray(territory.adjacent_ids)) {
        territory.adjacent_ids.forEach((id: string) => {
          // Only include if not already owned
          if (id && !ownedIds.includes(id)) {
            adjacentIds.add(id)
          }
        })
      }
    })

    const eligibleArray = Array.from(adjacentIds)
    console.log('Adjacent eligible check:', {
      ownedCount: ownedTerritories.length,
      ownedIds,
      eligibleCount: eligibleArray.length,
      eligible: eligibleArray.slice(0, 5) // Log first 5 for debugging
    })

    return NextResponse.json({ eligible: eligibleArray })
  } catch (error) {
    console.error('Adjacent eligible error:', error)
    return NextResponse.json({ eligible: [] })
  }
}

