# Stripe Checkout Fix Checklist

## Common Issues and Fixes

### 1. Missing Environment Variables

**Required Environment Variables in Vercel:**

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_live_xxx (or sk_test_xxx for testing)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx (or pk_test_xxx for testing)

# Stripe Price IDs (MUST be created in Stripe Dashboard first)
STRIPE_PRICE_BASE_250=price_xxx
STRIPE_PRICE_ADJACENT_220=price_xxx

# Optional: DMA Price (if you're selling DMAs)
STRIPE_PRICE_DMA_3000=price_xxx

# Webhook Secret
STRIPE_WEBHOOK_SECRET=whsec_xxx

# App URL (for redirect URLs)
NEXT_PUBLIC_APP_URL=https://www.inspectionpronetwork.com
```

**How to Check:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify all variables above are set
3. Make sure they're set for the correct environment (Production/Preview/Development)

### 2. Missing Stripe Products/Prices

**You MUST create these in Stripe Dashboard:**

1. **Base Territory Subscription**
   - Go to Stripe Dashboard → Products → Add product
   - Name: `Territory Subscription - Base`
   - Price: `$250.00` per month (recurring)
   - Copy the Price ID (starts with `price_`)
   - Add to Vercel as: `STRIPE_PRICE_BASE_250`

2. **Adjacent Territory Subscription**
   - Name: `Territory Subscription - Adjacent`
   - Price: `$150.00` per month (recurring) - Note: Code says $220 but UI shows $150
   - Copy the Price ID
   - Add to Vercel as: `STRIPE_PRICE_ADJACENT_220`

3. **DMA Territory Subscription** (if selling DMAs)
   - Name: `DMA Territory Subscription`
   - Price: `$3,000.00` per month (recurring)
   - Copy the Price ID
   - Add to Vercel as: `STRIPE_PRICE_DMA_3000`

### 3. Webhook Not Configured

**In Stripe Dashboard:**

1. Go to **Developers** → **Webhooks** → **Add endpoint**
2. Endpoint URL: `https://www.inspectionpronetwork.com/api/stripe/webhook`
3. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the **Signing secret** (starts with `whsec_`)
5. Add to Vercel as: `STRIPE_WEBHOOK_SECRET`

### 4. Code Issues to Fix

**Issue: DMA Pricing Not Handled**

The checkout route doesn't check if a territory is a DMA and use the $3000 price. You may need to:

1. Add DMA price to `src/lib/stripe/index.ts`:
```typescript
export const PRICES = {
  BASE: process.env.STRIPE_PRICE_BASE_250!,
  ADJACENT: process.env.STRIPE_PRICE_ADJACENT_220!,
  DMA: process.env.STRIPE_PRICE_DMA_3000!, // Add this
}
```

2. Update checkout route to use DMA price for DMA territories

### 5. Testing Checklist

**Before going live:**

- [ ] All environment variables are set in Vercel
- [ ] Stripe products/prices are created
- [ ] Webhook endpoint is configured
- [ ] Test checkout with Stripe test card: `4242 4242 4242 4242`
- [ ] Verify webhook is receiving events (check Stripe Dashboard → Webhooks → Your endpoint → Recent events)
- [ ] Check browser console for errors
- [ ] Check Vercel function logs for errors

### 6. Common Error Messages

**"STRIPE_SECRET_KEY is not set"**
- Solution: Add `STRIPE_SECRET_KEY` to Vercel environment variables

**"STRIPE_PRICE_BASE_250 is not set"**
- Solution: Create the product in Stripe and add the price ID to Vercel

**"Invalid price ID"**
- Solution: Verify the price ID is correct and exists in your Stripe account

**"Webhook signature verification failed"**
- Solution: Check that `STRIPE_WEBHOOK_SECRET` matches the signing secret in Stripe Dashboard

**Checkout redirects but subscription not created**
- Solution: Check webhook is configured and receiving events. Check Vercel function logs for webhook errors.

