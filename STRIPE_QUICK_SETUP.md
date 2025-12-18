# Stripe Quick Setup Checklist

## ✅ Required Environment Variables

Add these to your `.env.local` file:

```env
# Stripe API Keys (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Stripe Price IDs (create products in Stripe Dashboard first)
STRIPE_PRICE_BASE_250=price_...
STRIPE_PRICE_ADJACENT_150=price_...

# Stripe Webhook Secret (for production, or use Stripe CLI for local)
STRIPE_WEBHOOK_SECRET=whsec_...

# Your app URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📋 Step-by-Step Setup

### 1. Create Stripe Products & Prices

1. Go to **Stripe Dashboard** → **Products** → **Add product**

2. **Base Territory Subscription ($250/month)**
   - Name: `Territory Subscription - Base`
   - Price: `$250.00`
   - Billing: `Monthly recurring`
   - Copy the **Price ID** (starts with `price_`)
   - Add to `.env.local` as `STRIPE_PRICE_BASE_250`

3. **Adjacent Territory Subscription ($150/month)**
   - Name: `Territory Subscription - Adjacent`
   - Price: `$150.00`
   - Billing: `Monthly recurring`
   - Copy the **Price ID** (starts with `price_`)
   - Add to `.env.local` as `STRIPE_PRICE_ADJACENT_150`

### 2. Get API Keys

1. Go to **Stripe Dashboard** → **Developers** → **API keys**
2. Copy **Secret key** (starts with `sk_test_` or `sk_live_`)
3. Copy **Publishable key** (starts with `pk_test_` or `pk_live_`)
4. Add to `.env.local`

### 3. Setup Webhooks

#### For Local Development:

1. Install Stripe CLI:
   ```bash
   # Windows (using scoop)
   scoop install stripe
   
   # Or download from: https://stripe.com/docs/stripe-cli
   ```

2. Login:
   ```bash
   stripe login
   ```

3. Forward webhooks:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

4. Copy the webhook secret (starts with `whsec_`) to `.env.local`

#### For Production:

1. Go to **Stripe Dashboard** → **Developers** → **Webhooks** → **Add endpoint**

2. Configure:
   - Endpoint URL: `https://your-domain.com/api/stripe/webhook`
   - Events to listen:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`

3. Copy the **Signing secret** to your production environment

### 4. Test

1. Restart your Next.js dev server after adding env variables
2. Try claiming a territory
3. Use test card: `4242 4242 4242 4242`
4. Any future expiry, any CVC, any ZIP

## 🔍 Troubleshooting

### "Payment configuration error"
- Check that `STRIPE_PRICE_BASE_250` and `STRIPE_PRICE_ADJACENT_150` are set
- Verify the price IDs exist in Stripe Dashboard

### "Unauthorized" errors
- Check `STRIPE_SECRET_KEY` is set correctly
- Make sure you're using the right key (test vs live)

### Webhooks not working
- For local: Make sure Stripe CLI is running: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- Check `STRIPE_WEBHOOK_SECRET` matches the CLI output
- For production: Verify webhook endpoint URL is correct

### Checkout redirects but doesn't complete
- Check browser console for errors
- Verify `NEXT_PUBLIC_APP_URL` matches your actual URL
- Check Stripe Dashboard → **Payments** for failed attempts

## 📝 Example .env.local

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe
STRIPE_SECRET_KEY=sk_test_51AbCdEf...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51AbCdEf...
STRIPE_PRICE_BASE_250=price_1AbCdEf...
STRIPE_PRICE_ADJACENT_150=price_1XyZaBc...
STRIPE_WEBHOOK_SECRET=whsec_AbCdEf...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

