import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession, PRICES } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { territoryId } = await request.json()
    
    if (!territoryId) {
      return NextResponse.json({ error: 'Territory ID required' }, { status: 400 })
    }

    // Get user's company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('owner_user_id', user.id)
      .single()

    if (companyError || !company) {
      return NextResponse.json({ error: 'Company not found. Please complete your profile first.' }, { status: 400 })
    }

    // Check if territory is available
    const { data: territory, error: territoryError } = await supabase
      .from('territories')
      .select('*')
      .eq('id', territoryId)
      .single()

    if (territoryError || !territory) {
      return NextResponse.json({ error: 'Territory not found' }, { status: 404 })
    }

    if (territory.status !== 'available') {
      // Check if there's an expired hold
      const { data: existingHold } = await supabase
        .from('territory_holds')
        .select('*')
        .eq('territory_id', territoryId)
        .single()

      if (existingHold && new Date(existingHold.expires_at) > new Date()) {
        return NextResponse.json({ error: 'Territory is currently held by another operator' }, { status: 400 })
      }
    }

    // Check if eligible for adjacent discount
    const { data: ownedTerritories } = await supabase
      .from('territory_ownership')
      .select('territory_id')
      .eq('company_id', company.id)
      .eq('status', 'active')

    let isAdjacentEligible = false
    if (ownedTerritories && ownedTerritories.length > 0) {
      const ownedIds = ownedTerritories.map((t: { territory_id: string }) => t.territory_id)
      isAdjacentEligible = territory.adjacent_ids?.some((id: string) => ownedIds.includes(id)) || false
    }

    const priceId = isAdjacentEligible ? PRICES.ADJACENT : PRICES.BASE

    // Validate price IDs are set
    if (!PRICES.BASE || !PRICES.ADJACENT) {
      console.error('Stripe price IDs not configured:', { BASE: PRICES.BASE, ADJACENT: PRICES.ADJACENT })
      return NextResponse.json({ 
        error: 'Payment configuration error. Please contact support.' 
      }, { status: 500 })
    }

    // Create a hold on the territory
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes

    // Delete any existing expired holds first
    await supabase
      .from('territory_holds')
      .delete()
      .eq('territory_id', territoryId)
      .lt('expires_at', new Date().toISOString())

    const { error: holdError } = await supabase
      .from('territory_holds')
      .upsert({
        territory_id: territoryId,
        company_id: company.id,
        expires_at: expiresAt,
      })

    if (holdError) {
      console.error('Hold error:', holdError)
      return NextResponse.json({ error: 'Failed to hold territory' }, { status: 500 })
    }

    // Update territory status to held
    await supabase
      .from('territories')
      .update({ status: 'held' })
      .eq('id', territoryId)

    // Get or check for existing Stripe customer (skip if 'manual')
    const { data: existingOwnership } = await supabase
      .from('territory_ownership')
      .select('stripe_customer_id')
      .eq('company_id', company.id)
      .neq('stripe_customer_id', 'manual') // Exclude manually assigned territories
      .limit(1)
      .single()

    // Only use existing customer ID if it's a real Stripe customer (not 'manual')
    const stripeCustomerId = existingOwnership?.stripe_customer_id && 
                             existingOwnership.stripe_customer_id !== 'manual'
      ? existingOwnership.stripe_customer_id
      : undefined

    // Create Stripe checkout session
    const session = await createCheckoutSession({
      companyId: company.id,
      territoryId,
      priceId,
      customerEmail: company.billing_email || user.email!,
      stripeCustomerId,
    })

    // Update hold with checkout session ID
    await supabase
      .from('territory_holds')
      .update({ checkout_session_id: session.id })
      .eq('territory_id', territoryId)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

