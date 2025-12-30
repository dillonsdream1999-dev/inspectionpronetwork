import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getStripe, PRICES, updateSubscriptionPrice } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  const stripe = getStripe()

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        const companyId = session.metadata?.company_id
        const territoryId = session.metadata?.territory_id
        const customerId = session.customer as string
        const subscriptionId = session.subscription as string

        if (!companyId || !territoryId || !subscriptionId) {
          console.error('Missing metadata in checkout session')
          break
        }

        // Get subscription details to determine price type
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const priceId = subscription.items.data[0]?.price.id
        const priceType = priceId === PRICES.ADJACENT ? 'adjacent' : 'base'

        // Create territory ownership record
        const { error: ownershipError } = await supabase
          .from('territory_ownership')
          .insert({
            territory_id: territoryId,
            company_id: companyId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            price_type: priceType,
            status: 'active',
          })

        if (ownershipError) {
          console.error('Failed to create ownership:', ownershipError)
          throw ownershipError
        }

        // Get territory details to check if it's a DMA
        const { data: territory } = await supabase
          .from('territories')
          .select('is_dma')
          .eq('id', territoryId)
          .single()

        // Update territory status to taken
        await supabase
          .from('territories')
          .update({ status: 'taken' })
          .eq('id', territoryId)

        // If this is a DMA purchase, mark all linked individual territories as taken
        if (territory?.is_dma) {
          const { error: dmaError } = await supabase
            .from('territories')
            .update({ status: 'taken' })
            .eq('dma_id', territoryId)
            .neq('is_dma', true) // Only update individual territories, not other DMAs

          if (dmaError) {
            console.error('Failed to update DMA-linked territories:', dmaError)
          } else {
            console.log(`DMA ${territoryId} claimed, linked individual territories marked as taken`)
          }
        }

        // Delete the hold
        await supabase
          .from('territory_holds')
          .delete()
          .eq('territory_id', territoryId)

        console.log(`Territory ${territoryId} claimed by company ${companyId}`)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const subscriptionId = subscription.id
        const status = subscription.status

        // Update ownership status
        if (status === 'active') {
          await supabase
            .from('territory_ownership')
            .update({ status: 'active' })
            .eq('stripe_subscription_id', subscriptionId)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const subscriptionId = subscription.id

        // Get the ownership record
        const { data: ownership } = await supabase
          .from('territory_ownership')
          .select('*, territories(*)')
          .eq('stripe_subscription_id', subscriptionId)
          .single()

        if (!ownership) {
          console.error('Ownership not found for subscription:', subscriptionId)
          break
        }

        // Update ownership to canceled
        await supabase
          .from('territory_ownership')
          .update({ 
            status: 'canceled',
            ended_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscriptionId)

        // Get territory details to check if it's a DMA
        const territory = ownership.territories as { id: string; is_dma?: boolean } | null
        const isDMA = territory?.is_dma === true

        // Update territory to available
        await supabase
          .from('territories')
          .update({ status: 'available' })
          .eq('id', ownership.territory_id)

        // If this was a DMA subscription, mark all linked individual territories as available
        if (isDMA) {
          const { error: dmaError } = await supabase
            .from('territories')
            .update({ status: 'available' })
            .eq('dma_id', ownership.territory_id)
            .neq('is_dma', true) // Only update individual territories, not other DMAs

          if (dmaError) {
            console.error('Failed to update DMA-linked territories:', dmaError)
          } else {
            console.log(`DMA ${ownership.territory_id} canceled, linked individual territories marked as available`)
          }
        }

        // Check if any remaining territories lose their adjacency discount
        await handleAdjacentDiscountRevocation(supabase, ownership.company_id)

        console.log(`Subscription ${subscriptionId} canceled, territory released`)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handleAdjacentDiscountRevocation(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  companyId: string
  // canceledTerritoryId is not currently used but kept for future reference
) {
  // Get all active territories for this company with adjacent discount
  const { data: adjacentOwnerships } = await supabase
    .from('territory_ownership')
    .select('*, territories(*)')
    .eq('company_id', companyId)
    .eq('status', 'active')
    .eq('price_type', 'adjacent')

  if (!adjacentOwnerships || adjacentOwnerships.length === 0) return

  // For each territory with adjacent discount, check if it's still adjacent to another owned territory
  for (const ownership of adjacentOwnerships) {
    const territory = ownership.territories as { adjacent_ids: string[] } | null
    if (!territory) continue

    // Get all other active territories (excluding the one being checked)
    const { data: otherOwnerships } = await supabase
      .from('territory_ownership')
      .select('territory_id')
      .eq('company_id', companyId)
      .eq('status', 'active')
      .neq('territory_id', ownership.territory_id)

    if (!otherOwnerships || otherOwnerships.length === 0) {
      // No other territories, must revoke discount
      await revokeAdjacentDiscount(supabase, ownership)
      continue
    }

    const otherTerritoryIds = otherOwnerships.map(o => o.territory_id)
    const stillAdjacent = territory.adjacent_ids?.some(id => otherTerritoryIds.includes(id))

    if (!stillAdjacent) {
      await revokeAdjacentDiscount(supabase, ownership)
    }
  }
}

async function revokeAdjacentDiscount(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  ownership: { stripe_subscription_id: string; territory_id: string }
) {
  try {
    // Update Stripe subscription to base price (takes effect next billing cycle)
    await updateSubscriptionPrice(ownership.stripe_subscription_id, PRICES.BASE)

    // Update our record
    await supabase
      .from('territory_ownership')
      .update({ price_type: 'base' })
      .eq('stripe_subscription_id', ownership.stripe_subscription_id)

    console.log(`Adjacent discount revoked for territory ${ownership.territory_id}`)
  } catch (error) {
    console.error('Failed to revoke adjacent discount:', error)
  }
}

