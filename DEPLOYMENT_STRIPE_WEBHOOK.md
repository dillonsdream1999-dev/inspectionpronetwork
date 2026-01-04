# Stripe Webhook Configuration for Production Deployment

## Webhook Endpoint Setup

### 1. In Stripe Dashboard

1. Go to **Developers** → **Webhooks** → **Add endpoint**

2. **Endpoint URL**: 
   ```
   https://your-production-domain.com/api/stripe/webhook
   ```
   *(Replace `your-production-domain.com` with your actual domain, e.g., `inspectionpronetwork.com`)*

3. **Events to Listen For** - Select these three events:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`

4. **Click "Add endpoint"**

5. **Copy the Signing Secret** (starts with `whsec_`) - You'll need this for your environment variables

### 2. Environment Variables

Add the following to your production environment variables (Vercel, etc.):

```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

*(Use the signing secret from step 5 above)*

## Required Stripe Products & Prices

Make sure you have created these products in Stripe:

1. **Base Territory Subscription**
   - Price: $250/month
   - Environment variable: `STRIPE_PRICE_BASE_250=price_xxx`

2. **Adjacent Territory Subscription**  
   - Price: $150/month *(Note: Updated from $220)*
   - Environment variable: `STRIPE_PRICE_ADJACENT_220=price_xxx` *(Note: variable name hasn't changed but price is $150)*

3. **DMA Territory Subscription** *(If applicable)*
   - Price: $3,000/month
   - You may need to add this as `STRIPE_PRICE_DMA_3000=price_xxx` if DMA pricing is implemented

## What Each Webhook Event Does

### `checkout.session.completed`
- Creates the `territory_ownership` record in your database
- Updates territory status to `taken`
- Deletes the temporary hold record
- Associates the subscription with the company and territory

### `customer.subscription.updated`
- Updates ownership status if subscription becomes active again
- Handles subscription status changes

### `customer.subscription.deleted`
- Marks ownership as `canceled` in your database
- Sets `ended_at` timestamp
- Updates territory status back to `available`
- Re-evaluates adjacent discount eligibility for remaining subscriptions
- Revokes adjacent discounts if no longer eligible

## Testing the Webhook

After deploying:

1. Go to Stripe Dashboard → Webhooks → Your endpoint
2. Click "Send test webhook" or use the test mode
3. Check your application logs to verify webhook is received and processed
4. Verify database changes are made correctly

## Important Notes

- The webhook endpoint requires the `STRIPE_WEBHOOK_SECRET` to verify requests
- Webhook failures will be logged - check your application logs if subscriptions aren't being created
- Stripe will retry failed webhooks automatically
- Use Stripe Dashboard → Webhooks → Your endpoint to view webhook delivery logs and retry failed events

## Complete Environment Variables Checklist

```bash
# Stripe Keys
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Stripe Price IDs
STRIPE_PRICE_BASE_250=price_xxx
STRIPE_PRICE_ADJACENT_220=price_xxx

# App URL (for redirect URLs in checkout)
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
```





