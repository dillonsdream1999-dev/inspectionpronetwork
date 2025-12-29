import { createClient } from '@/lib/supabase/server'
import { Building2, MapPin, CreditCard, AlertCircle } from 'lucide-react'
import { AddProviderForm } from '@/components/admin/AddProviderForm'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function AdminProvidersPage() {
  const supabase = await createClient()

  const [companiesResult, territoriesResult] = await Promise.all([
    supabase
      .from('companies')
      .select(`
        *,
        profiles (email),
        territory_ownership (
          id,
          status,
          price_type,
          stripe_subscription_id,
          territories (name, is_dma)
        )
      `)
      .order('created_at', { ascending: false }),
    supabase
      .from('territories')
      .select('id, name, state, status')
      .eq('status', 'available')
      .order('state')
      .order('name')
  ])

  const companies = companiesResult.data
  const availableTerritories = territoriesResult.data || []

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Providers</h1>
          <p className="text-slate-400 mt-1">Manage registered pest control companies</p>
        </div>
      </div>

      <AddProviderForm availableTerritories={availableTerritories} />

      {!companies || companies.length === 0 ? (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
          <Building2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-lg text-slate-400">No providers registered</p>
        </div>
      ) : (
        <div className="space-y-6">
          {companies.map((company: { id: string; name: string; phone?: string; website?: string; billing_email?: string; created_at: string; profiles?: { email: string } | { email: string }[]; territory_ownership?: { id: string; status: string; price_type: string; territories?: { name: string; is_dma?: boolean } | { name: string; is_dma?: boolean }[] }[] }) => {
            // Handle profiles as potentially array or object
            const profile = Array.isArray(company.profiles) ? company.profiles[0] : company.profiles
            const ownerships = company.territory_ownership || []

            const activeSubscriptions = ownerships.filter((o: { status: string }) => o.status === 'active')
            const monthlySpend = activeSubscriptions.reduce((acc: number, sub: { price_type: string; territories?: { name: string; is_dma?: boolean } | { name: string; is_dma?: boolean }[] }) => {
              // Handle territories as potentially array or object
              let territory: { is_dma?: boolean } | null = null
              if (Array.isArray(sub.territories)) {
                territory = sub.territories[0] || null
              } else {
                territory = sub.territories || null
              }
              if (territory?.is_dma) return acc + 3000
              return acc + (sub.price_type === 'adjacent' ? 150 : 250)
            }, 0)

            return (
              <div key={company.id} className="bg-slate-800 rounded-xl border border-slate-700">
                <div className="p-6 border-b border-slate-700">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-brand-600/20 rounded-xl flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-brand-400" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">{company.name}</h2>
                        <p className="text-sm text-slate-400">{profile?.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">${monthlySpend}</p>
                      <p className="text-sm text-slate-400">Monthly spend</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid sm:grid-cols-3 gap-4 mb-6">
                    {company.phone && (
                      <div>
                        <p className="text-xs text-slate-500">Phone</p>
                        <p className="text-sm text-slate-300">{company.phone}</p>
                      </div>
                    )}
                    {company.website && (
                      <div>
                        <p className="text-xs text-slate-500">Website</p>
                        <a 
                          href={company.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-brand-400 hover:underline"
                        >
                          {company.website}
                        </a>
                      </div>
                    )}
                    {company.billing_email && (
                      <div>
                        <p className="text-xs text-slate-500">Billing Email</p>
                        <p className="text-sm text-slate-300">{company.billing_email}</p>
                      </div>
                    )}
                  </div>

                  <h3 className="text-sm font-semibold text-white mb-3">Subscriptions</h3>

                  {ownerships?.length === 0 ? (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <AlertCircle className="w-4 h-4" />
                      No subscriptions
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {ownerships.map((ownership) => (
                        <div
                          key={ownership.id}
                          className="flex items-center justify-between bg-slate-900 rounded-lg p-3"
                        >
                          <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-300">
                              {ownership.territories?.name}
                            </span>
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                              ownership.status === 'active' 
                                ? 'bg-emerald-500/20 text-emerald-400' 
                                : 'bg-slate-600/20 text-slate-400'
                            }`}>
                              {ownership.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-sm text-slate-400">
                              <CreditCard className="w-4 h-4" />
                              ${(ownership.territories as { is_dma?: boolean } | null)?.is_dma 
                                ? 3000 
                                : (ownership.price_type === 'adjacent' ? 150 : 250)}/mo
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-700">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Registered: {new Date(company.created_at).toLocaleDateString()}</span>
                    <span>ID: {company.id.slice(0, 8)}...</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

