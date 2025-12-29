# Vercel Environment Variables Setup

This document lists all required environment variables that must be set in your Vercel project for the application to work correctly.

## Required Environment Variables

### Supabase Variables

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Description: Your Supabase project URL
   - How to find: Go to your Supabase dashboard → Project Settings → API → Project URL
   - Example: `https://xxxxxxxxxxxxx.supabase.co`
   - **Important**: Must be prefixed with `NEXT_PUBLIC_` to be available in the browser

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Description: Your Supabase anonymous/public key
   - How to find: Go to your Supabase dashboard → Project Settings → API → anon/public key
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Important**: Must be prefixed with `NEXT_PUBLIC_` to be available in the browser

3. **SUPABASE_SERVICE_ROLE_KEY**
   - Description: Your Supabase service role key (server-side only)
   - How to find: Go to your Supabase dashboard → Project Settings → API → service_role key
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Warning**: Keep this secret! Never expose this in client-side code

### Stripe Variables

4. **STRIPE_SECRET_KEY**
   - Description: Your Stripe secret key
   - How to find: Go to Stripe Dashboard → Developers → API keys → Secret key
   - Example: `sk_test_...` (test) or `sk_live_...` (production)

5. **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**
   - Description: Your Stripe publishable key
   - How to find: Go to Stripe Dashboard → Developers → API keys → Publishable key
   - Example: `pk_test_...` (test) or `pk_live_...` (production)
   - **Important**: Must be prefixed with `NEXT_PUBLIC_` to be available in the browser

6. **STRIPE_WEBHOOK_SECRET**
   - Description: Your Stripe webhook signing secret
   - How to find: 
     - Go to Stripe Dashboard → Developers → Webhooks
     - Click on your webhook endpoint
     - Click "Reveal" next to "Signing secret"
   - Example: `whsec_...`
   - **Important**: Use the signing secret for the webhook endpoint: `/api/stripe/webhook`

## How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New** for each variable
5. Enter the variable name and value
6. Select the appropriate environments (Production, Preview, Development)
7. Click **Save**
8. **Redeploy** your application for changes to take effect

## Verifying Environment Variables

After setting the environment variables:

1. Go to your Vercel project dashboard
2. Click on the latest deployment
3. Check the build logs to ensure no errors related to missing environment variables
4. Test the application to ensure it's working correctly

## Troubleshooting

### Error: "@supabase/ssr: Your project's URL and API key are required"

This means `NEXT_PUBLIC_SUPABASE_URL` and/or `NEXT_PUBLIC_SUPABASE_ANON_KEY` are missing.

**Solution**: 
1. Verify the variables are set in Vercel
2. Make sure they're prefixed with `NEXT_PUBLIC_`
3. Redeploy the application

### Error: Missing environment variables in API routes

Check that all required variables are set, especially:
- `STRIPE_SECRET_KEY` (for Stripe API calls)
- `SUPABASE_SERVICE_ROLE_KEY` (for admin operations)
- `STRIPE_WEBHOOK_SECRET` (for webhook verification)

## Security Notes

- Never commit `.env` files to Git
- Use different keys for production and development when possible
- The service role key (`SUPABASE_SERVICE_ROLE_KEY`) has admin access - keep it secret
- Only use `NEXT_PUBLIC_` prefix for variables that are safe to expose in the browser

