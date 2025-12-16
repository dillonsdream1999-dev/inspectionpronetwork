import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LeadActions } from '@/components/dashboard/LeadActions'
import { 
  ArrowLeft, 
  MapPin, 
  Mail, 
  Phone as PhoneIcon, 
  MessageSquare,
  Home,
  Calendar
} from 'lucide-react'

export default async function LeadDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
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

  // Get lead
  const { data: lead } = await supabase
    .from('leads')
    .select(`
      *,
      territories (name, state)
    `)
    .eq('id', id)
    .eq('company_id', company.id)
    .single()

  if (!lead) {
    notFound()
  }

  const territory = lead.territories as { name: string; state: string } | null

  const contactPreferenceLabel = {
    phone: 'Phone Call',
    email: 'Email',
    text: 'Text Message'
  }

  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link 
          href="/dashboard/leads"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Leads
        </Link>

        <div className="card">
          {/* Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {lead.contact_name || 'Anonymous Lead'}
                </h1>
                <div className="flex items-center gap-2 mt-2 text-slate-500">
                  <MapPin className="w-4 h-4" />
                  <span>{territory?.name}, {territory?.state}</span>
                  <span className="text-slate-300">•</span>
                  <span>ZIP: {lead.zip}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Received</p>
                <p className="font-medium text-slate-900">
                  {new Date(lead.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {lead.contact_email && (
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <a 
                      href={`mailto:${lead.contact_email}`}
                      className="text-brand-600 hover:underline font-medium"
                    >
                      {lead.contact_email}
                    </a>
                  </div>
                </div>
              )}
              
              {lead.contact_phone && (
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <PhoneIcon className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Phone</p>
                    <a 
                      href={`tel:${lead.contact_phone}`}
                      className="text-brand-600 hover:underline font-medium"
                    >
                      {lead.contact_phone}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <MessageSquare className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Preferred Contact</p>
                  <p className="font-medium text-slate-900">
                    {contactPreferenceLabel[lead.contact_pref as keyof typeof contactPreferenceLabel] || lead.contact_pref}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Inspection Details */}
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Inspection Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <Home className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Room Type</p>
                  <p className="font-medium text-slate-900">
                    {lead.room_type || 'Not specified'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <Calendar className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Submitted</p>
                  <p className="font-medium text-slate-900">
                    {new Date(lead.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {lead.notes && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Notes</p>
                <p className="text-slate-700">{lead.notes}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Update Status</h2>
            <LeadActions leadId={lead.id} currentStatus={lead.status} />
          </div>
        </div>
      </div>
    </div>
  )
}

