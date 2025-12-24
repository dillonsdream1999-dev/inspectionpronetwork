import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TerritoryManageCard } from '@/components/dashboard/TerritoryManageCard'
import { MapPin, Plus } from 'lucide-react'

export default async function MyTerritoriesPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get company
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('owner_user_id', user.id)
    .single()

  if (!company) {
    redirect('/dashboard/settings?setup=true')
  }

  // Get all territories for this company
  const { data: ownerships } = await supabase
    .from('territory_ownership')
    .select(`
      *,
      territories (*)
    `)
    .eq('company_id', company.id)
    .order('started_at', { ascending: false })

  const activeOwnerships = ownerships?.filter(o => o.status === 'active') || []
  const pastOwnerships = ownerships?.filter(o => o.status === 'canceled') || []

  const monthlyTotal = activeOwnerships.reduce((acc, o) => {
    const territory = o.territories as { is_dma?: boolean } | null
    if (territory?.is_dma) return acc + 3000
    return acc + (o.price_type === 'adjacent' ? 150 : 250)
  }, 0)

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Territories</h1>
            <p className="text-slate-600 mt-1">Manage your territory subscriptions</p>
          </div>
          <Link href="/territories" className="btn-primary">
            <Plus className="w-4 h-4" />
            Add Territory
          </Link>
        </div>

        {/* Summary Card */}
        <div className="card p-6 mb-8">
          <div className="grid sm:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-slate-500">Active Territories</p>
              <p className="text-3xl font-bold text-slate-900">{activeOwnerships.length}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Monthly Total</p>
              <p className="text-3xl font-bold text-slate-900">${monthlyTotal}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Billing</p>
              <p className="text-lg font-medium text-slate-900">Monthly subscription</p>
              <p className="text-sm text-slate-500">Cancel anytime</p>
            </div>
          </div>
        </div>

        {/* Active Territories */}
        <div className="mb-12">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Active Territories</h2>
          
          {activeOwnerships.length === 0 ? (
            <div className="card p-12 text-center">
              <MapPin className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-lg text-slate-600">No active territories</p>
              <p className="text-sm text-slate-500 mt-1 mb-6">
                Claim a territory to start receiving leads in that area
              </p>
              <Link href="/territories" className="btn-primary">
                Browse Territories
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeOwnerships.map((ownership) => (
                <TerritoryManageCard
                  key={ownership.id}
                  ownership={ownership}
                />
              ))}
            </div>
          )}
        </div>

        {/* Past Territories */}
        {pastOwnerships.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Past Territories</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastOwnerships.map((ownership) => (
                <TerritoryManageCard
                  key={ownership.id}
                  ownership={ownership}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

