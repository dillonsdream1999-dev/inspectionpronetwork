# Vercel Deployment Troubleshooting

## Issue: Deployment Not Updating

If your Vercel deployment doesn't seem to reflect the latest changes, try these steps:

### 1. Verify Code Was Pushed to GitHub

Check that your latest commits are on GitHub:
- Go to your GitHub repository
- Verify the latest commit is visible (should show "Replace magic link login with email/password authentication")

### 2. Check Vercel Deployment Status

In your Vercel dashboard:
- Go to your project → **Deployments** tab
- Check the latest deployment status:
  - ✅ **Ready** (green) = Successfully deployed
  - ⏳ **Building** = Still building
  - ❌ **Error** = Build failed (check logs)
  - ⚠️ **Cancelled** = Build was cancelled

### 3. Check Build Logs

If the build failed or seems stuck:
1. Click on the deployment
2. Click **View Build Logs**
3. Look for errors (usually in red)
4. Common issues:
   - Missing environment variables
   - TypeScript errors
   - Build timeouts
   - Dependency installation failures

### 4. Clear Build Cache

Vercel sometimes caches build artifacts. To force a fresh build:

**Option A: Via Vercel Dashboard**
1. Go to your project → **Settings** → **General**
2. Scroll to **Clear Build Cache**
3. Click **Clear Build Cache**
4. Trigger a new deployment

**Option B: Add Empty Commit (Forces New Build)**
```bash
git commit --allow-empty -m "Force redeploy"
git push
```

**Option C: Redeploy with Clean Build**
1. Go to Deployments tab
2. Click the "..." menu on the latest deployment
3. Select **Redeploy**
4. Check **"Use existing Build Cache"** = OFF
5. Click **Redeploy**

### 5. Browser Caching Issues

If the code deployed but you don't see changes in your browser:

1. **Hard Refresh**:
   - Windows/Linux: `Ctrl + Shift + R` or `Ctrl + F5`
   - Mac: `Cmd + Shift + R`

2. **Clear Browser Cache**:
   - Open DevTools (F12)
   - Right-click the refresh button
   - Select "Empty Cache and Hard Reload"

3. **Check in Incognito/Private Window**:
   - Open the site in a private/incognito window
   - This bypasses all cache

4. **Check the Actual Deployed URL**:
   - Make sure you're viewing the correct deployment URL
   - Production: `your-project.vercel.app` or your custom domain
   - Preview deployments have unique URLs

### 6. Verify Environment Variables

If the build succeeds but the app doesn't work:
1. Go to **Settings** → **Environment Variables**
2. Verify all required variables are set (see `VERCEL_ENV_SETUP.md`)
3. Make sure variables are set for **Production** environment
4. After adding/changing variables, **redeploy** is required

### 7. Check for Middleware/Edge Function Issues

If middleware or edge functions are causing issues:
- Check the deployment logs for Edge Runtime errors
- Verify environment variables are accessible in Edge Runtime (must be `NEXT_PUBLIC_*` for client-side)

### 8. Verify Next.js Build Output

After deployment, check:
1. Go to deployment → **Functions** tab
2. Verify routes are listed correctly
3. Check for any runtime errors in the logs

### 9. Force a Clean Deployment

If nothing else works:

1. **Delete `.next` folder locally** (if it exists):
   ```bash
   rm -rf .next
   git add .next
   git commit -m "Remove build cache"
   git push
   ```

2. **Clear Vercel Build Cache** (via dashboard)

3. **Create a new deployment**:
   ```bash
   git commit --allow-empty -m "Force clean deploy"
   git push
   ```

### 10. Check Vercel Build Configuration

Verify `package.json` has correct build scripts:
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start"
  }
}
```

## Still Not Working?

1. **Check Vercel Status Page**: https://www.vercel-status.com/
2. **Review Vercel Docs**: https://vercel.com/docs
3. **Check GitHub Integration**: Settings → Git → Verify repository is connected
4. **Review Deployment Settings**: Settings → General → Check build settings

## Quick Checklist

- [ ] Code pushed to GitHub (main/master branch)
- [ ] Vercel deployment status shows "Ready" (green)
- [ ] No build errors in deployment logs
- [ ] Environment variables are set
- [ ] Hard refreshed browser (Ctrl+Shift+R)
- [ ] Checked in incognito/private window
- [ ] Verified correct deployment URL
- [ ] Cleared Vercel build cache
- [ ] Redeployed with clean build cache

