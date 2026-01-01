# Supabase Email Configuration for Signup/Password Reset

## Issue: Email Confirmation Not Being Sent

If users are not receiving confirmation emails when signing up, you need to configure Supabase email settings.

## Configuration Steps

### 1. Enable Email Confirmation (if required)

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Settings** → **Email Auth**
3. Check the **"Enable email confirmations"** setting
4. If enabled, users must confirm their email before logging in
5. If disabled, users can log in immediately after signup

### 2. Configure Email Provider

Supabase can use:
- **Built-in SMTP** (default, limited to 4 emails/hour)
- **Custom SMTP** (recommended for production)

#### Option A: Use Built-in SMTP (for testing)

1. Go to **Authentication** → **Settings** → **Email Templates**
2. Emails will be sent from `noreply@mail.app.supabase.io`
3. **Limitation**: Only 4 emails per hour
4. **Note**: Emails may go to spam folder

#### Option B: Configure Custom SMTP (recommended for production)

1. Go to **Project Settings** → **Auth** → **SMTP Settings**
2. Enable **"Enable Custom SMTP"**
3. Enter your SMTP provider details:
   - **Sender email**: Your verified sender email (e.g., `noreply@inspectionpronetwork.com`)
   - **Sender name**: Display name (e.g., `Inspection Pro Network`)
   - **Host**: Your SMTP server (e.g., `smtp.sendgrid.net`, `smtp.gmail.com`)
   - **Port**: Usually `587` for TLS or `465` for SSL
   - **Username**: Your SMTP username
   - **Password**: Your SMTP password
   - **Secure**: Enable TLS/SSL

**Popular SMTP Providers:**
- **SendGrid**: Free tier available (100 emails/day)
- **Mailgun**: Free tier available (5,000 emails/month)
- **AWS SES**: Very cheap (pay per email)
- **Gmail**: Requires app-specific password

### 3. Verify Domain (for custom SMTP)

If using a custom sender email:
1. Verify your domain with your email provider
2. Set up SPF, DKIM, and DMARC records
3. This helps prevent emails from going to spam

### 4. Email Templates

You can customize email templates in:
**Authentication** → **Settings** → **Email Templates**

Templates available:
- **Confirm signup**: Sent when user signs up
- **Magic Link**: For passwordless login
- **Change Email Address**: When email is changed
- **Reset Password**: For password reset

### 5. Site URL Configuration

Make sure your Site URL is set correctly:

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to: `https://www.inspectionpronetwork.com`
3. Add **Redirect URLs**:
   - `https://www.inspectionpronetwork.com/dashboard`
   - `https://www.inspectionpronetwork.com/**` (wildcard)

### 6. Test Email Delivery

1. Try signing up with a test email
2. Check spam/junk folder
3. Check Supabase logs: **Logs** → **Postgres Logs** or **API Logs**
4. Check email provider dashboard for delivery status

## Troubleshooting

### Emails Not Sending

1. **Check rate limits**: Built-in SMTP has 4 emails/hour limit
2. **Check spam folder**: Emails may be filtered
3. **Check Supabase logs**: Look for email-related errors
4. **Verify SMTP credentials**: If using custom SMTP, test credentials
5. **Check email provider status**: Service may be down

### "Email not confirmed" Error

- If email confirmation is enabled, users must click the confirmation link
- Check that the confirmation email was sent
- Check that the confirmation link is not expired
- User can request a new confirmation email

### Production Recommendations

For production, you should:
1. ✅ Use custom SMTP (not built-in)
2. ✅ Verify your domain
3. ✅ Set up SPF/DKIM records
4. ✅ Use a professional sender email (noreply@yourdomain.com)
5. ✅ Monitor email delivery rates
6. ✅ Set up email delivery monitoring/alerts

## Quick Fix for Testing

If you just need emails to work for testing:

1. Disable email confirmation temporarily:
   - **Authentication** → **Settings** → **Email Auth**
   - Uncheck **"Enable email confirmations"**
   - Users can now log in immediately after signup

2. Or use built-in SMTP (limited to 4/hour):
   - Just ensure Site URL is set correctly
   - Emails will come from `noreply@mail.app.supabase.io`


