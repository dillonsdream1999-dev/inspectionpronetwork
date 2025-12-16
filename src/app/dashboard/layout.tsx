import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardNav } from '@/components/dashboard/DashboardNav'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get or create company
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('owner_user_id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNav user={user} company={company} />
      <main className="pt-16">
        {children}
      </main>
    </div>
  )
}

