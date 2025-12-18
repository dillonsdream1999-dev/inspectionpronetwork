# Vercel Environment Variables - Quick Reference

Copy these values to your Vercel project settings. Some values you'll need to get from your `.env.local` file or Supabase/Stripe dashboards.

## ✅ Values You Already Have

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://slprilsytlezwaaznrvs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[Get from Supabase Dashboard → Settings → API → anon/public key]
SUPABASE_SERVICE_ROLE_KEY=[Get from Supabase Dashboard → Settings → API → service_role key]

# Stripe API Keys (Test Mode - use these for development)
# Get from Stripe Dashboard → Developers → API keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_[your-publishable-key]
STRIPE_SECRET_KEY=sk_test_[your-secret-key]

# Stripe Price IDs
STRIPE_PRICE_BASE_250=price_1Sf19hPEXDL2tSj9l4amvoMa
STRIPE_PRICE_ADJACENT_150=price_1Sf1BCPEXDL2tSj9oJy7jl3z

# Stripe Webhook Secret
# For local development: Get from Stripe CLI output when running `stripe listen`
# For production: Get from Stripe Dashboard → Webhooks → Signing secret
STRIPE_WEBHOOK_SECRET=whsec_[your-webhook-secret]

# App URL (update after first deployment)
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

## 📝 How to Get Missing Values

### Supabase Keys:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL` (already have: `https://slprilsytlezwaaznrvs.supabase.co`)
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

### Stripe Webhook Secret (Production):
1. Go to https://dashboard.stripe.com/webhooks
2. Click **Add endpoint**
3. Set URL: `https://your-app-name.vercel.app/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`)

### App URL:
- After your first Vercel deployment, update `NEXT_PUBLIC_APP_URL` with your actual Vercel domain
- Example: `https://inspection-pro-network.vercel.app`

## 🔄 For Production (When Ready)

When you're ready to go live, switch to Stripe **Live** keys:

1. Go to Stripe Dashboard → **Developers** → **API keys**
2. Toggle to **Live mode**
3. Copy the **live** keys (they start with `pk_live_` and `sk_live_`)
4. Update in Vercel:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` → use live publishable key
   - `STRIPE_SECRET_KEY` → use live secret key
5. Create a new webhook endpoint for production
6. Update `STRIPE_WEBHOOK_SECRET` with the production webhook secret

## ✅ Quick Copy-Paste for Vercel

When adding to Vercel, use this format (fill in the bracketed values):

```
NEXT_PUBLIC_SUPABASE_URL=https://slprilsytlezwaaznrvs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_[your-publishable-key]
STRIPE_SECRET_KEY=sk_test_[your-secret-key]
STRIPE_PRICE_BASE_250=price_1Sf19hPEXDL2tSj9l4amvoMa
STRIPE_PRICE_ADJACENT_150=price_1Sf1BCPEXDL2tSj9oJy7jl3z
STRIPE_WEBHOOK_SECRET=whsec_[get-from-stripe-dashboard-after-creating-webhook]
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

