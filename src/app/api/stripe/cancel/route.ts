import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cancelSubscription } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { subscriptionId } = await request.json()
    
    if (!subscriptionId) {
      return NextResponse.json({ error: 'Subscription ID required' }, { status: 400 })
    }

    // Verify user owns this subscription
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('owner_user_id', user.id)
      .single()

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    const { data: ownership } = await supabase
      .from('territory_ownership')
      .select('*')
      .eq('stripe_subscription_id', subscriptionId)
      .eq('company_id', company.id)
      .single()

    if (!ownership) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }

    // Cancel in Stripe
    await cancelSubscription(subscriptionId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cancel error:', error)
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 })
  }
}

