import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createServiceClient()

    // Get recent territory signups (last 30 days, limit to 10 most recent)
    const { data: recentSignups, error } = await supabase
      .from('territory_ownership')
      .select(`
        id,
        started_at,
        territories (
          name,
          state
        ),
        companies (
          name
        )
      `)
      .eq('status', 'active')
      .order('started_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error fetching social proof:', error)
      return NextResponse.json({ error: 'Failed to fetch signups' }, { status: 500 })
    }

    // Get total count of active territories
    const { count: totalCount } = await supabase
      .from('territory_ownership')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    // Get signups in last 24 hours
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    const { count: todayCount } = await supabase
      .from('territory_ownership')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .gte('started_at', yesterday.toISOString())

    return NextResponse.json({
      recentSignups: recentSignups || [],
      totalCount: totalCount || 0,
      todayCount: todayCount || 0,
    })
  } catch (error) {
    console.error('Social proof API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

