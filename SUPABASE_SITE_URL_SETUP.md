# Supabase Site URL Configuration

## Issue: Password Reset Redirects to localhost

If password reset emails are redirecting to `localhost:3000` instead of your production URL, you need to configure Supabase's Site URL setting.

## Solution

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Navigate to Authentication Settings**
   - Go to **Authentication** → **URL Configuration** (or **Settings** → **Authentication**)

3. **Update Site URL**
   - **Site URL**: Set this to your production URL
     - **Set to**: `https://www.inspectionpronetwork.com`
   
4. **Update Redirect URLs** (if applicable)
   - Add your production callback URL to the **Redirect URLs** list:
     - `https://www.inspectionpronetwork.com/auth/callback`
   - Add your localhost for development (optional):
     - `http://localhost:3000/auth/callback`

5. **Save Changes**
   - Click **Save** or **Update**

## Additional Configuration

The code now uses `NEXT_PUBLIC_APP_URL` environment variable for redirect URLs. Make sure to set this in Vercel:

1. Go to Vercel → Your Project → **Settings** → **Environment Variables**
2. Add:
   - Name: `NEXT_PUBLIC_APP_URL`
   - Value: `https://www.inspectionpronetwork.com`
   - Environments: Production (and Preview if needed)
3. Redeploy after adding the variable

## Why This Matters

Supabase uses the **Site URL** setting as the base URL for all authentication redirects. If it's set to `localhost:3000`, all password reset and email confirmation links will redirect to localhost, even if you're using the production site.

**For your setup:**
- Site URL should be: `https://www.inspectionpronetwork.com`
- Redirect URLs should include: `https://www.inspectionpronetwork.com/auth/callback`

## Testing

After updating:
1. Request a new password reset
2. Check the email link
3. The `redirect_to` parameter should now point to your production URL
4. Clicking the link should redirect to your production site, not localhost

