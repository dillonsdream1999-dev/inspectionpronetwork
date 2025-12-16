import { Resend } from 'resend'

let resend: Resend | null = null

export function getResendClient() {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set')
    }
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

interface LeadNotificationData {
  operatorEmail: string
  operatorName: string
  companyName: string
  leadName: string
  leadPhone?: string
  leadEmail?: string
  leadZip: string
  leadRoomType?: string
  leadContactPref: string
  territoryName: string
  leadId: string
}

export async function sendLeadNotificationEmail(data: LeadNotificationData) {
  const resendClient = getResendClient()

  const contactInfo = []
  if (data.leadPhone) contactInfo.push(`📞 Phone: ${data.leadPhone}`)
  if (data.leadEmail) contactInfo.push(`📧 Email: ${data.leadEmail}`)

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">🔔 New Lead Alert!</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Inspection Pro Network</p>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none;">
        <p style="margin: 0 0 20px 0; font-size: 16px;">
          Hi ${data.operatorName},
        </p>
        
        <p style="margin: 0 0 20px 0;">
          A homeowner in your <strong>${data.territoryName}</strong> territory just requested professional bed bug inspection help!
        </p>
        
        <div style="background: white; border: 2px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h2 style="margin: 0 0 15px 0; color: #10b981; font-size: 18px;">📋 Lead Details</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; width: 120px;">Name:</td>
              <td style="padding: 8px 0; font-weight: 600;">${data.leadName || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;">ZIP Code:</td>
              <td style="padding: 8px 0; font-weight: 600;">${data.leadZip}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Room/Area:</td>
              <td style="padding: 8px 0; font-weight: 600;">${data.leadRoomType || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Prefers:</td>
              <td style="padding: 8px 0; font-weight: 600; text-transform: capitalize;">${data.leadContactPref}</td>
            </tr>
            ${data.leadPhone ? `
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Phone:</td>
              <td style="padding: 8px 0; font-weight: 600;">
                <a href="tel:${data.leadPhone}" style="color: #2563eb; text-decoration: none;">${data.leadPhone}</a>
              </td>
            </tr>
            ` : ''}
            ${data.leadEmail ? `
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Email:</td>
              <td style="padding: 8px 0; font-weight: 600;">
                <a href="mailto:${data.leadEmail}" style="color: #2563eb; text-decoration: none;">${data.leadEmail}</a>
              </td>
            </tr>
            ` : ''}
          </table>
        </div>
        
        <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e; font-size: 14px;">
            <strong>⚡ Speed Matters!</strong> Contact this lead within 5-15 minutes for the best chance of booking the job.
          </p>
        </div>
        
        <div style="text-align: center; margin: 25px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/leads/${data.leadId}" 
             style="display: inline-block; background: #2563eb; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
            View Lead in Dashboard →
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;">
        
        <p style="margin: 0; font-size: 14px; color: #64748b;">
          <strong>Suggested Script:</strong><br>
          "Hi, this is [Your Name] with ${data.companyName}. You requested a bed bug inspection follow-up after using the Inspection Pro app. I'm local in your area. When can we schedule a professional inspection to confirm what you found?"
        </p>
      </div>
      
      <div style="background: #1e293b; color: #94a3b8; padding: 20px; border-radius: 0 0 12px 12px; text-align: center; font-size: 12px;">
        <p style="margin: 0;">
          Inspection Pro Network<br>
          Powered by Bed Bug Inspection Pro
        </p>
        <p style="margin: 10px 0 0 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" style="color: #60a5fa; text-decoration: none;">Dashboard</a> · 
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/settings" style="color: #60a5fa; text-decoration: none;">Settings</a>
        </p>
      </div>
    </body>
    </html>
  `

  const { data: emailData, error } = await resendClient.emails.send({
    from: 'Inspection Pro Network <leads@inspectionpronetwork.com>',
    to: data.operatorEmail,
    subject: `🔔 New Lead in ${data.territoryName} - ${data.leadName || 'New Request'}`,
    html,
  })

  if (error) {
    console.error('Failed to send lead notification email:', error)
    throw error
  }

  return emailData
}

