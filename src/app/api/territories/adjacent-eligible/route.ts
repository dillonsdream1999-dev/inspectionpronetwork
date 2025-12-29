import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
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

    // Collect all adjacent territory IDs
    const adjacentIds = new Set<string>()
    ownedTerritories.forEach((ot) => {
      const territory = ot.territories
      territory?.adjacent_ids?.forEach((id: string) => {
        // Don't include already owned territories
        if (!ownedTerritories.some((owned) => owned.territory_id === id)) {
          adjacentIds.add(id)
        }
      })
    })

    return NextResponse.json({ eligible: Array.from(adjacentIds) })
  } catch (error) {
    console.error('Adjacent eligible error:', error)
    return NextResponse.json({ eligible: [] })
  }
}

