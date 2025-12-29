import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
      typescript: true,
    })
  }
  return stripeInstance
}

// For backwards compatibility
export const stripe = {
  get checkout() {
    return getStripe().checkout
  },
  get subscriptions() {
    return getStripe().subscriptions
  },
  get customers() {
    return getStripe().customers
  },
  get webhooks() {
    return getStripe().webhooks
  },
}

export const PRICES = {
  BASE: process.env.STRIPE_PRICE_BASE_250!,
  ADJACENT: process.env.STRIPE_PRICE_ADJACENT_220!,
}

export async function createCheckoutSession({
  companyId,
  territoryId,
  priceId,
  customerEmail,
  stripeCustomerId,
}: {
  companyId: string
  territoryId: string
  priceId: string
  customerEmail: string
  stripeCustomerId?: string
}) {
  const stripe = getStripe()
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer: stripeCustomerId,
    customer_email: stripeCustomerId ? undefined : customerEmail,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      company_id: companyId,
      territory_id: territoryId,
    },
    subscription_data: {
      metadata: {
        company_id: companyId,
        territory_id: territoryId,
      },
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success&territory=${territoryId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/territories?checkout=canceled&territory=${territoryId}`,
    expires_at: Math.floor(Date.now() / 1000) + 60 * 30, // 30 minutes
  })

  return session
}

export async function cancelSubscription(subscriptionId: string) {
  const stripe = getStripe()
  return await stripe.subscriptions.cancel(subscriptionId)
}

export async function updateSubscriptionPrice(subscriptionId: string, newPriceId: string) {
  const stripe = getStripe()
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const itemId = subscription.items.data[0]?.id
  
  if (!itemId) {
    throw new Error('No subscription item found')
  }
  
  return await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: itemId,
        price: newPriceId,
      },
    ],
    proration_behavior: 'none', // Change takes effect next billing cycle
  })
}
