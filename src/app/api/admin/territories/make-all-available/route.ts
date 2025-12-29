import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function POST(_request: NextRequest) {
  try {
    // Verify the requester is an admin
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

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Use service client for admin operations
    const serviceClient = await createServiceClient()

    // Get all territories with active ownerships
    const { data: activeOwnerships } = await serviceClient
      .from('territory_ownership')
      .select('territory_id')
      .eq('status', 'active')

    const takenTerritoryIds = new Set(
      activeOwnerships?.map(o => o.territory_id) || []
    )

    // Update all territories that don't have active ownerships to 'available'
    // This will update territories with status 'taken', 'held', or any other status
    const { data: allTerritories } = await serviceClient
      .from('territories')
      .select('id')

    if (!allTerritories) {
      return NextResponse.json({ error: 'Failed to fetch territories' }, { status: 500 })
    }

    const territoriesToUpdate = allTerritories
      .filter(t => !takenTerritoryIds.has(t.id))
      .map(t => t.id)

    if (territoriesToUpdate.length === 0) {
      return NextResponse.json({ 
        message: 'All territories with active subscriptions are already marked as taken. No territories to update.',
        updated: 0
      })
    }

    // Update territories to available
    const { error: updateError } = await serviceClient
      .from('territories')
      .update({ status: 'available' })
      .in('id', territoriesToUpdate)

    if (updateError) {
      console.error('Error updating territories:', updateError)
      return NextResponse.json(
        { error: `Failed to update territories: ${updateError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Successfully set ${territoriesToUpdate.length} territories to available status`,
      updated: territoriesToUpdate.length,
      keptTaken: takenTerritoryIds.size
    })
  } catch (error) {
    console.error('Error making territories available:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

