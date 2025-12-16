import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'

interface TerritoryImport {
  name: string
  state: string
  metro_area?: string
  type: 'metro' | 'rural'
  population_est: number
  zip_codes: string[]
  adjacent_territory_names?: string[]
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { territories }: { territories: TerritoryImport[] } = await request.json()

    if (!territories || !Array.isArray(territories)) {
      return NextResponse.json({ error: 'Invalid data format. Expected { territories: [...] }' }, { status: 400 })
    }

    const serviceClient = await createServiceClient()

    // First pass: Insert all territories without adjacency
    const insertedTerritories: { id: string; name: string }[] = []

    for (const territory of territories) {
      const { data, error } = await serviceClient
        .from('territories')
        .insert({
          name: territory.name,
          state: territory.state,
          metro_area: territory.metro_area || null,
          type: territory.type,
          population_est: territory.population_est,
          zip_codes: territory.zip_codes,
          adjacent_ids: [],
          status: 'available'
        })
        .select('id, name')
        .single()

      if (error) {
        console.error('Error inserting territory:', error)
        continue
      }

      insertedTerritories.push(data)
    }

    // Second pass: Update adjacency relationships
    for (const territory of territories) {
      if (!territory.adjacent_territory_names || territory.adjacent_territory_names.length === 0) {
        continue
      }

      const currentTerritory = insertedTerritories.find(t => t.name === territory.name)
      if (!currentTerritory) continue

      const adjacentIds = territory.adjacent_territory_names
        .map(name => insertedTerritories.find(t => t.name === name)?.id)
        .filter((id): id is string => id !== undefined)

      if (adjacentIds.length > 0) {
        await serviceClient
          .from('territories')
          .update({ adjacent_ids: adjacentIds })
          .eq('id', currentTerritory.id)
      }
    }

    return NextResponse.json({ 
      imported: insertedTerritories.length,
      territories: insertedTerritories 
    })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json({ error: 'Failed to import territories' }, { status: 500 })
  }
}

