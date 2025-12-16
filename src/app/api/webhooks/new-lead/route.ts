import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendLeadNotificationEmail } from '@/lib/email'

// This webhook is called when a new lead is created
// Can be triggered by Supabase Database Webhooks or manually
export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret (optional but recommended)
    const webhookSecret = request.headers.get('x-webhook-secret')
    if (process.env.WEBHOOK_SECRET && webhookSecret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Invalid webhook secret' }, { status: 401 })
    }

    const body = await request.json()
    
    // Handle Supabase webhook format
    const lead = body.record || body
    
    if (!lead || !lead.id) {
      return NextResponse.json({ error: 'Invalid lead data' }, { status: 400 })
    }

    const supabase = await createServiceClient()

    // Get the company and owner details
    const { data: company } = await supabase
      .from('companies')
      .select(`
        *,
        profiles (email)
      `)
      .eq('id', lead.company_id)
      .single()

    if (!company) {
      console.error('Company not found for lead:', lead.id)
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    // Get the territory name
    const { data: territory } = await supabase
      .from('territories')
      .select('name')
      .eq('id', lead.territory_id)
      .single()

    // Determine the email to send to
    const operatorEmail = company.billing_email || (company.profiles as { email: string } | null)?.email

    if (!operatorEmail) {
      console.error('No email found for company:', company.id)
      return NextResponse.json({ error: 'No operator email found' }, { status: 400 })
    }

    // Send the email notification
    await sendLeadNotificationEmail({
      operatorEmail,
      operatorName: company.name,
      companyName: company.name,
      leadName: lead.contact_name || 'New Lead',
      leadPhone: lead.contact_phone,
      leadEmail: lead.contact_email,
      leadZip: lead.zip,
      leadRoomType: lead.room_type,
      leadContactPref: lead.contact_pref || 'phone',
      territoryName: territory?.name || 'Your Territory',
      leadId: lead.id,
    })

    console.log(`Lead notification email sent to ${operatorEmail} for lead ${lead.id}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('New lead webhook error:', error)
    return NextResponse.json(
      { error: 'Failed to process lead notification' },
      { status: 500 }
    )
  }
}

