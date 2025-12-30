import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const state = searchParams.get('state')
    const metro = searchParams.get('metro')
    const zip = searchParams.get('zip')
    const status = searchParams.get('status')

    let query = supabase
      .from('territories')
      .select('*', { count: 'exact' })
      .order('state', { ascending: true })
      .order('name', { ascending: true })
      .limit(10000) // Set a high limit to ensure all territories are returned

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

    const { data: territories, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

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

