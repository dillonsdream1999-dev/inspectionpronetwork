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
        .select('*', { count: 'exact' })
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

    const territories = allTerritories


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

