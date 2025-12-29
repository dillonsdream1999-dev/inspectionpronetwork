import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get total active territories
    const { count: totalCount } = await supabase
      .from('territory_ownership')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    // Get recent signups (last 24 hours)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const { data: recentSignups } = await supabase
      .from('territory_ownership')
      .select(`
        id,
        created_at,
        territories (name, state)
      `)
      .eq('status', 'active')
      .gte('created_at', yesterday.toISOString())
      .order('created_at', { ascending: false })
      .limit(5)

    // Get signups in last 24 hours count
    const { count: signups24h } = await supabase
      .from('territory_ownership')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .gte('created_at', yesterday.toISOString())

    return NextResponse.json({
      totalCount: totalCount || 0,
      recentSignups: recentSignups?.map(s => {
        // Handle territories as potentially array or object
        const territories = s.territories as { name: string; state: string }[] | { name: string; state: string } | null | undefined
        const territory = Array.isArray(territories) 
          ? (territories.length > 0 ? territories[0] : null)
          : territories
        
        return {
          id: s.id,
          territoryName: territory?.name || 'Unknown',
          state: territory?.state || '',
          createdAt: s.created_at
        }
      }) || [],
      signups24h: signups24h || 0
    })
  } catch (error) {
    console.error('Social proof API error:', error)
    return NextResponse.json({ 
      totalCount: 0, 
      recentSignups: [], 
      signups24h: 0 
    })
  }
}




