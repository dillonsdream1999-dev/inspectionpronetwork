import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, company, city, state, zip, message } = body

    // Validate required fields
    if (!name || !email || !city || !state) {
      return NextResponse.json(
        { error: 'Name, email, city, and state are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    const supabase = await createServiceClient()

    // Insert the territory request
    const { error: insertError } = await supabase
      .from('territory_requests')
      .insert({
        name,
        email,
        company: company || null,
        city,
        state,
        zip: zip || null,
        message: message || null,
        status: 'pending'
      })

    if (insertError) {
      console.error('Error inserting territory request:', insertError)
      return NextResponse.json(
        { error: 'Failed to submit request. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Territory request API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const supabase = await createServiceClient()

    const { data: requests, error } = await supabase
      .from('territory_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ requests })
  } catch (error) {
    console.error('Territory requests fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

