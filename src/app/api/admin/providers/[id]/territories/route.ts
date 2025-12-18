import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: companyId } = await params

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

    // Parse request body
    const body = await request.json()
    const { territoryId, priceType = 'base' } = body as {
      territoryId: string
      priceType?: 'base' | 'adjacent'
    }

    if (!territoryId) {
      return NextResponse.json(
        { error: 'Territory ID is required' },
        { status: 400 }
      )
    }

    // Use service client for admin operations
    const serviceClient = await createServiceClient()

    // Verify company exists
    const { data: company } = await serviceClient
      .from('companies')
      .select('id, name')
      .eq('id', companyId)
      .single()

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    // Check territory is available
    const { data: territory } = await serviceClient
      .from('territories')
      .select('id, name, status')
      .eq('id', territoryId)
      .single()

    if (!territory) {
      return NextResponse.json(
        { error: 'Territory not found' },
        { status: 404 }
      )
    }

    if (territory.status !== 'available') {
      return NextResponse.json(
        { error: 'Territory is not available' },
        { status: 400 }
      )
    }

    // Create ownership with 'manual' as Stripe IDs
    const { error: ownershipError } = await serviceClient
      .from('territory_ownership')
      .insert({
        territory_id: territoryId,
        company_id: companyId,
        stripe_customer_id: 'manual',
        stripe_subscription_id: `manual_${companyId}_${territoryId}`,
        price_type: priceType,
        status: 'active',
      })

    if (ownershipError) {
      console.error('Failed to create ownership:', ownershipError)
      return NextResponse.json(
        { error: `Failed to assign territory: ${ownershipError.message}` },
        { status: 500 }
      )
    }

    // Update territory status
    await serviceClient
      .from('territories')
      .update({ status: 'taken' })
      .eq('id', territoryId)

    return NextResponse.json({
      success: true,
      message: `Territory "${territory.name}" assigned to "${company.name}"`,
    })
  } catch (error) {
    console.error('Error assigning territory:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: companyId } = await params

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

    const { searchParams } = new URL(request.url)
    const territoryId = searchParams.get('territoryId')

    if (!territoryId) {
      return NextResponse.json(
        { error: 'Territory ID is required' },
        { status: 400 }
      )
    }

    const serviceClient = await createServiceClient()

    // Get the ownership record
    const { data: ownership } = await serviceClient
      .from('territory_ownership')
      .select('id, stripe_subscription_id')
      .eq('company_id', companyId)
      .eq('territory_id', territoryId)
      .eq('status', 'active')
      .single()

    if (!ownership) {
      return NextResponse.json(
        { error: 'Territory ownership not found' },
        { status: 404 }
      )
    }

    // Only allow removal of manually assigned territories
    if (!ownership.stripe_subscription_id.startsWith('manual')) {
      return NextResponse.json(
        { error: 'Cannot remove Stripe-subscribed territories from admin panel. Cancel the subscription in Stripe.' },
        { status: 400 }
      )
    }

    // Update ownership to canceled
    await serviceClient
      .from('territory_ownership')
      .update({ 
        status: 'canceled',
        ended_at: new Date().toISOString()
      })
      .eq('id', ownership.id)

    // Update territory to available
    await serviceClient
      .from('territories')
      .update({ status: 'available' })
      .eq('id', territoryId)

    return NextResponse.json({
      success: true,
      message: 'Territory removed from provider',
    })
  } catch (error) {
    console.error('Error removing territory:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

