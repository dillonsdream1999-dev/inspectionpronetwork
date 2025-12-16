import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { 
  Users2, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Filter,
  ArrowRight,
  Mail,
  Bell
} from 'lucide-react'

export default async function LeadsPage() {
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

  // Get all leads
  const { data: leads } = await supabase
    .from('leads')
    .select(`
      *,
      territories (name)
    `)
    .eq('company_id', company.id)
    .order('created_at', { ascending: false })

  const statusConfig = {
    new: { label: 'New', icon: AlertCircle, class: 'badge-warning', color: 'text-amber-500' },
    contacted: { label: 'Contacted', icon: Clock, class: 'badge-info', color: 'text-blue-500' },
    booked: { label: 'Booked', icon: CheckCircle2, class: 'badge-success', color: 'text-emerald-500' },
    not_a_fit: { label: 'Not a Fit', icon: XCircle, class: 'badge-neutral', color: 'text-slate-400' }
  }

  // Count by status
  const statusCounts = {
    new: leads?.filter(l => l.status === 'new').length || 0,
    contacted: leads?.filter(l => l.status === 'contacted').length || 0,
    booked: leads?.filter(l => l.status === 'booked').length || 0,
    not_a_fit: leads?.filter(l => l.status === 'not_a_fit').length || 0,
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
          <p className="text-slate-600 mt-1">Manage leads from your territories</p>
        </div>

        {/* Email Notification Notice */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Email & SMS Notifications
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              New leads are automatically emailed to your company's billing email ({company.billing_email || company.name}).
              For fastest results, respond within 5-15 minutes of receiving a lead notification.
            </p>
          </div>
        </div>

        {/* Status Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {Object.entries(statusConfig).map(([status, config]) => {
            const Icon = config.icon
            const count = statusCounts[status as keyof typeof statusCounts]
            
            return (
              <div key={status} className="card p-4">
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${config.color}`} />
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{count}</p>
                    <p className="text-sm text-slate-500">{config.label}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Leads Table */}
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">All Leads</h2>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Filter className="w-4 h-4" />
                {leads?.length || 0} total
              </div>
            </div>
          </div>

          {!leads || leads.length === 0 ? (
            <div className="p-12 text-center">
              <Users2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-lg text-slate-600">No leads yet</p>
              <p className="text-sm text-slate-500 mt-1">
                When homeowners in your territory request help, their leads will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Territory
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map((lead) => {
                    const status = statusConfig[lead.status as keyof typeof statusConfig] || statusConfig.new
                    const StatusIcon = status.icon
                    const territory = lead.territories as { name: string } | null

                    return (
                      <tr key={lead.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-900">
                            {lead.contact_name || 'Anonymous'}
                          </p>
                          <p className="text-sm text-slate-500">
                            {lead.contact_email || lead.contact_phone || 'No contact info'}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-900">{territory?.name}</p>
                          <p className="text-sm text-slate-500">ZIP: {lead.zip}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-900">
                            {lead.room_type || 'Not specified'}
                          </p>
                          <p className="text-sm text-slate-500 capitalize">
                            Prefers: {lead.contact_pref}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={status.class}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/dashboard/leads/${lead.id}`}
                            className="text-brand-600 hover:text-brand-700"
                          >
                            <ArrowRight className="w-5 h-5" />
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

