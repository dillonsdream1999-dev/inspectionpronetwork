# Vercel Deployment Guide

This guide will help you deploy Inspection Pro Network to Vercel.

## Prerequisites

1. GitHub repository pushed (✅ Done)
2. Vercel account (sign up at https://vercel.com if needed)
3. All environment variables ready

## Step 1: Connect Repository to Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository: `dillonsdream1999-dev/inspectionpronetwork`
4. Vercel will auto-detect Next.js settings

## Step 2: Configure Build Settings

Vercel should auto-detect:
- **Framework Preset**: Next.js
- **Root Directory**: `./` (root)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

## Step 3: Add Environment Variables

In the Vercel project settings, add these environment variables:

### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=https://slprilsytlezwaaznrvs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### Stripe Configuration
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... (or pk_live_... for production)
STRIPE_SECRET_KEY=sk_test_... (or sk_live_... for production)
STRIPE_PRICE_BASE_250=price_1Sf19hPEXDL2tSj9l4amvoMa
STRIPE_PRICE_ADJACENT_150=price_1Sf1BCPEXDL2tSj9oJy7jl3z
STRIPE_WEBHOOK_SECRET=whsec_... (get from Stripe Dashboard)
```

### App URL
```
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

**Important**: After your first deployment, update `NEXT_PUBLIC_APP_URL` with your actual Vercel domain.

## Step 4: Configure Stripe Webhook for Production

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **"Add endpoint"**
3. Enter your Vercel URL: `https://your-app-name.vercel.app/api/stripe/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add it to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

## Step 5: Deploy

1. Click **"Deploy"** in Vercel
2. Wait for the build to complete
3. Your app will be live at `https://your-app-name.vercel.app`

## Step 6: Post-Deployment Checklist

- [ ] Update `NEXT_PUBLIC_APP_URL` in Vercel with your actual domain
- [ ] Configure Stripe webhook endpoint (see Step 4)
- [ ] Test the checkout flow
- [ ] Verify webhook events are being received
- [ ] Test admin features (provider creation, territory assignment)
- [ ] Test analytics dashboard

## Environment Variables Reference

### Required for All Environments
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_BASE_250`
- `STRIPE_PRICE_ADJACENT_150`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL`

### Production vs Development

**Development (local):**
- Use Stripe test keys (`pk_test_...`, `sk_test_...`)
- Use webhook secret from Stripe CLI (`whsec_...`)

**Production (Vercel):**
- Use Stripe live keys (`pk_live_...`, `sk_live_...`) when ready
- Use webhook secret from Stripe Dashboard production webhook
- Update `NEXT_PUBLIC_APP_URL` to your Vercel domain

## Troubleshooting

### Build Fails
- Check that all environment variables are set
- Verify Node.js version (Vercel uses Node 18+ by default)
- Check build logs in Vercel dashboard

### Webhooks Not Working
- Verify webhook URL is correct in Stripe Dashboard
- Check that `STRIPE_WEBHOOK_SECRET` matches the webhook signing secret
- View webhook logs in Stripe Dashboard → Developers → Webhooks

### CSS Not Loading
- Clear Vercel cache and redeploy
- Check that `globals.css` is imported in `src/app/layout.tsx`

### Database Connection Issues
- Verify Supabase environment variables are correct
- Check Supabase project is active
- Verify RLS policies allow access from your Vercel domain

## Vercel Configuration

The project includes `vercel.json` with:
- Extended timeout for Stripe webhook handler (30 seconds)

## Next Steps After Deployment

1. Set up a custom domain (optional)
2. Configure production Stripe keys
3. Set up monitoring and error tracking
4. Configure Supabase RLS policies for production
5. Set up database backups

## Support

For issues:
- Check Vercel deployment logs
- Check Stripe webhook logs
- Review Supabase logs
- Check browser console for client-side errors

