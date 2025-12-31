import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type') // 'recovery' for password reset
  const next = searchParams.get('next')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // If it's a password reset flow, redirect to reset password page
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/reset-password`)
      }
      
      // Get the user to check if they have a company
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Check if user has a company - if not, redirect to settings setup
        const { data: company } = await supabase
          .from('companies')
          .select('id')
          .eq('owner_user_id', user.id)
          .single()
        
        // If no company, redirect to settings setup (user needs to complete profile)
        const redirectTo = next ?? (company ? '/dashboard' : '/dashboard/settings?setup=true')
        return NextResponse.redirect(`${origin}${redirectTo}`)
      }
      
      // Fallback to next URL or dashboard
      const redirectTo = next ?? '/dashboard'
      return NextResponse.redirect(`${origin}${redirectTo}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}

