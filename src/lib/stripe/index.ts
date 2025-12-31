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
  DMA: process.env.STRIPE_PRICE_DMA_3000 || process.env.STRIPE_PRICE_BASE_250!, // Fallback to base if DMA price not set
}

// Helper function to build checkout URLs with proper validation
function getCheckoutUrl(path: string, territoryId: string, status: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_APP_URL environment variable is not set')
  }
  
  // Ensure URL has a scheme
  let url = baseUrl.trim()
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    // Default to https if no scheme provided
    url = `https://${url}`
  }
  
  // Remove trailing slash if present
  url = url.replace(/\/$/, '')
  
  // Build the full URL
  const fullPath = path.startsWith('/') ? path : `/${path}`
  return `${url}${fullPath}?checkout=${status}&territory=${territoryId}`
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
    success_url: getCheckoutUrl('/dashboard', territoryId, 'success'),
    cancel_url: getCheckoutUrl('/territories', territoryId, 'canceled'),
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
