import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { createCheckoutSession, PRICES } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const serviceClient = await createServiceClient()
    
    // Check if user is logged in (optional for guest checkout)
    const { data: { user } } = await supabase.auth.getUser()
    const isLoggedIn = !!user

    const { territoryId } = await request.json()
    
    if (!territoryId) {
      return NextResponse.json({ error: 'Territory ID required' }, { status: 400 })
    }

    // For logged-in users, get their company (for adjacent discount eligibility)
    let company = null
    let validCustomerId: string | undefined = undefined
    if (isLoggedIn) {
      const { data: existingCompany } = await supabase
        .from('companies')
        .select('*')
        .eq('owner_user_id', user!.id)
        .single()
      company = existingCompany

      // Get existing Stripe customer ID if logged in
      if (company) {
        const { data: existingOwnership } = await supabase
          .from('territory_ownership')
          .select('stripe_customer_id')
          .eq('company_id', company.id)
          .neq('stripe_customer_id', 'manual')
          .limit(1)
          .single()
        
        validCustomerId = existingOwnership?.stripe_customer_id?.startsWith('cus_') 
          ? existingOwnership.stripe_customer_id 
          : undefined
      }
    }

    // Check if territory is available (use service client to bypass RLS)
    const { data: territory, error: territoryError } = await serviceClient
      .from('territories')
      .select('*')
      .eq('id', territoryId)
      .single()

    if (territoryError || !territory) {
      return NextResponse.json({ error: 'Territory not found' }, { status: 404 })
    }

    if (territory.status !== 'available') {
      // Check if there's an expired hold
      const { data: existingHold } = await serviceClient
        .from('territory_holds')
        .select('*')
        .eq('territory_id', territoryId)
        .single()

      if (existingHold && new Date(existingHold.expires_at) > new Date()) {
        return NextResponse.json({ error: 'Territory is currently held by another operator' }, { status: 400 })
      }
    }

    // Check if territory is a DMA
    const isDMA = (territory as { is_dma?: boolean }).is_dma === true

    // Determine price based on territory type and eligibility
    let priceId: string
    if (isDMA) {
      // DMAs are always $3000/month
      if (!PRICES.DMA) {
        console.error('STRIPE_PRICE_DMA_3000 is not set')
        return NextResponse.json({ error: 'DMA pricing not configured. Please contact support.' }, { status: 500 })
      }
      priceId = PRICES.DMA
    } else {
      // For logged-in users with company, check adjacent discount eligibility
      let isAdjacentEligible = false
      if (company) {
        const { data: ownedTerritories } = await serviceClient
          .from('territory_ownership')
          .select('territory_id')
          .eq('company_id', company.id)
          .eq('status', 'active')

        if (ownedTerritories && ownedTerritories.length > 0) {
          const ownedIds = ownedTerritories.map((t: { territory_id: string }) => t.territory_id)
          isAdjacentEligible = territory.adjacent_ids?.some((id: string) => ownedIds.includes(id)) || false
        }
      }

      const selectedPrice = isAdjacentEligible ? PRICES.ADJACENT : PRICES.BASE
      if (!selectedPrice) {
        const missingPrice = isAdjacentEligible ? 'STRIPE_PRICE_ADJACENT_220' : 'STRIPE_PRICE_BASE_250'
        console.error(`${missingPrice} is not set`)
        return NextResponse.json({ error: 'Pricing not configured. Please contact support.' }, { status: 500 })
      }
      priceId = selectedPrice
    }

    // For guest checkout, we don't create holds (they'll be handled in webhook)
    // For logged-in users, create a hold
    if (isLoggedIn && company) {
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes

      // Delete any existing expired holds first
      await serviceClient
        .from('territory_holds')
        .delete()
        .eq('territory_id', territoryId)
        .lt('expires_at', new Date().toISOString())

      // Update territory status to held (will be updated to taken in webhook)
      await serviceClient
        .from('territories')
        .update({ status: 'held' })
        .eq('id', territoryId)
    }

    // Validate price ID before creating checkout session
    if (!priceId || priceId === 'undefined') {
      console.error('Invalid price ID:', priceId)
      return NextResponse.json({ error: 'Invalid pricing configuration. Please contact support.' }, { status: 500 })
    }

    // Create Stripe checkout session (guest checkout - no company_id required)
    let session
    try {
      session = await createCheckoutSession({
        companyId: company?.id, // Optional - null for guest checkout
        territoryId,
        priceId,
        customerEmail: user?.email || undefined, // Optional for guest checkout
        stripeCustomerId: validCustomerId,
        isGuestCheckout: !isLoggedIn || !company, // Mark as guest checkout
      })
    } catch (stripeError: unknown) {
      console.error('Stripe API error:', stripeError)
      const errorMessage = stripeError instanceof Error ? stripeError.message : 'Unknown Stripe error'
      return NextResponse.json({ 
        error: `Failed to create checkout session: ${errorMessage}` 
      }, { status: 500 })
    }

    // Update hold with checkout session ID (only if logged in)
    if (isLoggedIn && company) {
      await serviceClient
        .from('territory_holds')
        .update({ checkout_session_id: session.id })
        .eq('territory_id', territoryId)
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorDetails = error instanceof Error ? error.stack : String(error)
    console.error('Error details:', errorDetails)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 })
  }
}

