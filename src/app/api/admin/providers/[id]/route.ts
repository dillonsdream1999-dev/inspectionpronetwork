import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

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

    // Get existing company
    const { data: existingCompany, error: companyError } = await serviceClient
      .from('companies')
      .select('id, owner_user_id')
      .eq('id', id)
      .single()

    if (companyError || !existingCompany) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    // Update company information
    const { error: updateError } = await serviceClient
      .from('companies')
      .update({
        name: companyName,
        phone: phone || null,
        website: website || null,
        billing_email: email,
      })
      .eq('id', id)

    if (updateError) {
      console.error('Failed to update company:', updateError)
      return NextResponse.json(
        { error: `Failed to update company: ${updateError.message}` },
        { status: 500 }
      )
    }

    // Update user email if needed
    const { data: userProfile } = await serviceClient
      .from('profiles')
      .select('email, id')
      .eq('id', existingCompany.owner_user_id)
      .single()

    if (userProfile && userProfile.email !== email) {
      // Update auth user email
      const { error: emailError } = await serviceClient.auth.admin.updateUserById(
        existingCompany.owner_user_id,
        { email }
      )

      if (emailError) {
        console.warn('Failed to update user email:', emailError)
        // Don't fail the request, just log the warning
      }

      // Update profile email
      await serviceClient
        .from('profiles')
        .update({ email })
        .eq('id', existingCompany.owner_user_id)
    }

    // Handle territory updates
    if (territories !== undefined) {
      // Get current active ownerships
      const { data: currentOwnerships } = await serviceClient
        .from('territory_ownership')
        .select('id, territory_id')
        .eq('company_id', id)
        .eq('status', 'active')

      const currentTerritoryIds = new Set(
        (currentOwnerships || []).map(o => o.territory_id)
      )
      const newTerritoryIds = new Set(
        territories.map(t => t.territoryId)
      )

      // Remove territories that are no longer in the list
      for (const ownership of currentOwnerships || []) {
        if (!newTerritoryIds.has(ownership.territory_id)) {
          // Deactivate this ownership
          await serviceClient
            .from('territory_ownership')
            .update({ status: 'cancelled' })
            .eq('id', ownership.id)

          // Check if territory should be marked as available
          const { data: otherOwnership } = await serviceClient
            .from('territory_ownership')
            .select('id')
            .eq('territory_id', ownership.territory_id)
            .eq('status', 'active')
            .maybeSingle()

          if (!otherOwnership) {
            await serviceClient
              .from('territories')
              .update({ status: 'available' })
              .eq('id', ownership.territory_id)
          }
        }
      }

      // Add or update territories
      for (const t of territories) {
        // Check if territory exists
        const { data: territory } = await serviceClient
          .from('territories')
          .select('status, id')
          .eq('id', t.territoryId)
          .single()

        if (!territory) {
          continue // Skip non-existent territories
        }

        // Check if this company already owns this territory
        const { data: existingOwnership } = await serviceClient
          .from('territory_ownership')
          .select('id')
          .eq('territory_id', t.territoryId)
          .eq('company_id', id)
          .maybeSingle()

        if (existingOwnership) {
          // Update existing ownership
          await serviceClient
            .from('territory_ownership')
            .update({
              price_type: t.priceType,
              status: 'active',
            })
            .eq('id', existingOwnership.id)
        } else {
          // If territory is taken by another company, remove their ownership first
          if (territory.status === 'taken') {
            const { data: otherOwnership } = await serviceClient
              .from('territory_ownership')
              .select('id')
              .eq('territory_id', t.territoryId)
              .eq('status', 'active')
              .neq('company_id', id)
              .maybeSingle()

            if (otherOwnership) {
              // Deactivate other company's ownership
              await serviceClient
                .from('territory_ownership')
                .update({ status: 'cancelled' })
                .eq('id', otherOwnership.id)

              // Check if that territory should be marked as available
              const { data: remainingOwnership } = await serviceClient
                .from('territory_ownership')
                .select('id')
                .eq('territory_id', t.territoryId)
                .eq('status', 'active')
                .maybeSingle()

              if (!remainingOwnership) {
                await serviceClient
                  .from('territories')
                  .update({ status: 'available' })
                  .eq('id', t.territoryId)
              }
            }
          }

          // Create new ownership
          await serviceClient
            .from('territory_ownership')
            .insert({
              territory_id: t.territoryId,
              company_id: id,
              stripe_customer_id: 'manual',
              stripe_subscription_id: `manual_${id}_${t.territoryId}`,
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
    }

    return NextResponse.json({
      success: true,
      provider: {
        companyId: id,
        email,
        companyName,
      },
    })
  } catch (error) {
    console.error('Error updating provider:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

