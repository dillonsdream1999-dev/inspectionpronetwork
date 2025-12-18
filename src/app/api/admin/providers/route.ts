import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    // Verify the requester is an admin
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Parse request body
    const body = await request.json()
    const { email, companyName, phone, website, territories } = body as {
      email: string
      companyName: string
      phone?: string
      website?: string
      territories?: { territoryId: string; priceType: 'base' | 'adjacent' }[]
    }

    if (!email || !companyName) {
      return NextResponse.json(
        { error: 'Email and company name are required' },
        { status: 400 }
      )
    }

    // Use service client for admin operations
    const serviceClient = await createServiceClient()

    // Check if user already exists
    const { data: existingProfile } = await serviceClient
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()

    let userId: string

    if (existingProfile) {
      // User already exists, use their ID
      userId = existingProfile.id

      // Check if they already have a company
      const { data: existingCompany } = await serviceClient
        .from('companies')
        .select('id')
        .eq('owner_user_id', userId)
        .single()

      if (existingCompany) {
        return NextResponse.json(
          { error: 'This user already has a company' },
          { status: 400 }
        )
      }
    } else {
      // Create new user via Supabase Admin API
      // Generate a random password - user will reset via email
      const tempPassword = crypto.randomUUID()
      
      const { data: authData, error: authError } = await serviceClient.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true, // Auto-confirm email since admin is creating
      })

      if (authError) {
        console.error('Failed to create auth user:', authError)
        return NextResponse.json(
          { error: `Failed to create user: ${authError.message}` },
          { status: 500 }
        )
      }

      userId = authData.user.id

      // The profile is created automatically via trigger, but let's ensure it exists
      // Wait a moment for the trigger to execute
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    // Create company
    const { data: company, error: companyError } = await serviceClient
      .from('companies')
      .insert({
        owner_user_id: userId,
        name: companyName,
        phone: phone || null,
        website: website || null,
        billing_email: email,
      })
      .select()
      .single()

    if (companyError) {
      console.error('Failed to create company:', companyError)
      return NextResponse.json(
        { error: `Failed to create company: ${companyError.message}` },
        { status: 500 }
      )
    }

    // Assign territories if provided
    if (territories && territories.length > 0) {
      for (const t of territories) {
        // Check territory is available
        const { data: territory } = await serviceClient
          .from('territories')
          .select('status')
          .eq('id', t.territoryId)
          .single()

        if (!territory || territory.status !== 'available') {
          continue // Skip unavailable territories
        }

        // Create ownership with 'manual' as Stripe IDs
        await serviceClient
          .from('territory_ownership')
          .insert({
            territory_id: t.territoryId,
            company_id: company.id,
            stripe_customer_id: 'manual',
            stripe_subscription_id: `manual_${company.id}_${t.territoryId}`,
            price_type: t.priceType,
            status: 'active',
          })

        // Update territory status
        await serviceClient
          .from('territories')
          .update({ status: 'taken' })
          .eq('id', t.territoryId)
      }
    }

    // Send password reset email so user can set their password
    const { error: resetError } = await serviceClient.auth.admin.generateLink({
      type: 'recovery',
      email,
    })

    if (resetError) {
      console.warn('Failed to send password reset email:', resetError)
      // Don't fail the request, just log the warning
    }

    return NextResponse.json({
      success: true,
      provider: {
        userId,
        companyId: company.id,
        email,
        companyName,
      },
    })
  } catch (error) {
    console.error('Error creating provider:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

