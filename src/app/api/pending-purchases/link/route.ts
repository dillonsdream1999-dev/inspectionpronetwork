import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

/**
 * Links pending territory purchases to a user's account after signup
 * This is called after the user creates their account and company
 */
export async function POST(request: NextRequest) {
  try {
    const serviceClient = await createServiceClient()
    const { email, companyId } = await request.json()

    if (!email || !companyId) {
      return NextResponse.json(
        { error: 'Email and company ID are required' },
        { status: 400 }
      )
    }

    // Find all pending purchases for this email
    const { data: pendingPurchases, error: fetchError } = await serviceClient
      .from('pending_territory_purchases')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .is('completed_at', null)

    if (fetchError) {
      console.error('Error fetching pending purchases:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch pending purchases' },
        { status: 500 }
      )
    }

    if (!pendingPurchases || pendingPurchases.length === 0) {
      return NextResponse.json({
        success: true,
        linked: 0,
        message: 'No pending purchases found',
      })
    }

    // Link each pending purchase to the company
    const linkedPurchases = []
    for (const purchase of pendingPurchases) {
      // Create territory ownership record
      const { error: ownershipError } = await serviceClient
        .from('territory_ownership')
        .insert({
          territory_id: purchase.territory_id,
          company_id: companyId,
          stripe_customer_id: purchase.stripe_customer_id,
          stripe_subscription_id: purchase.stripe_subscription_id,
          price_type: purchase.price_type,
          status: 'active',
        })

      if (ownershipError) {
        console.error('Error creating ownership for purchase:', purchase.id, ownershipError)
        continue // Skip this one but try the others
      }

      // Mark pending purchase as completed
      await serviceClient
        .from('pending_territory_purchases')
        .update({ completed_at: new Date().toISOString() })
        .eq('id', purchase.id)

      linkedPurchases.push(purchase.territory_id)
    }

    return NextResponse.json({
      success: true,
      linked: linkedPurchases.length,
      territoryIds: linkedPurchases,
    })
  } catch (error) {
    console.error('Error linking pending purchases:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


