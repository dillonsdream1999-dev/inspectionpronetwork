'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Building2, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import type { Tables } from '@/types/database'

function SettingsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isSetup = searchParams.get('setup') === 'true'

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [company, setCompany] = useState<Tables<'companies'> | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    website: '',
    billing_email: '',
    description: ''
  })

  const supabase = createClient()

  useEffect(() => {
    const loadCompany = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      const { data: existingCompany } = await supabase
        .from('companies')
        .select('*')
        .eq('owner_user_id', user.id)
        .single()

      if (existingCompany) {
        setCompany(existingCompany)
        setFormData({
          name: existingCompany.name || '',
          phone: existingCompany.phone || '',
          website: existingCompany.website || '',
          billing_email: existingCompany.billing_email || user.email || '',
          description: existingCompany.description || ''
        })
      } else {
        setFormData(prev => ({
          ...prev,
          billing_email: user.email || ''
        }))
      }

      setIsLoading(false)
    }

    loadCompany()
  }, [supabase, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsSaving(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Not authenticated')
      }

      if (company) {
        // Update existing company
        const { error: updateError } = await supabase
          .from('companies')
          .update({
            name: formData.name,
            phone: formData.phone || null,
            website: formData.website || null,
            billing_email: formData.billing_email || null,
            description: formData.description || null
          })
          .eq('id', company.id)

        if (updateError) throw updateError
      } else {
        // Create new company
        const { data: newCompany, error: insertError } = await supabase
          .from('companies')
          .insert({
            owner_user_id: user.id,
            name: formData.name,
            phone: formData.phone || null,
            website: formData.website || null,
            billing_email: formData.billing_email || null,
            description: formData.description || null
          })
          .select()
          .single()

        if (insertError) throw insertError

        // After creating company, check for and link any pending purchases
        if (newCompany && user.email) {
          try {
            const linkResponse = await fetch('/api/pending-purchases/link', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: user.email,
                companyId: newCompany.id,
              }),
            })

            if (linkResponse.ok) {
              const linkData = await linkResponse.json()
              if (linkData.linked > 0) {
                console.log(`Linked ${linkData.linked} pending purchase(s) to new account`)
              }
            }
          } catch (linkError) {
            console.error('Error linking pending purchases:', linkError)
            // Don't fail the form submission if linking fails - purchases are already in pending table
          }
        }
      }

      setSuccess(true)
      
      if (isSetup) {
        // Redirect to territories page after completing setup
        setTimeout(() => {
          router.push('/territories?setup=complete')
        }, 1500) // Show success message briefly before redirect
      } else {
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save company')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            {isSetup ? 'Complete Your Profile' : 'Company Settings'}
          </h1>
          <p className="text-slate-600 mt-1">
            {isSetup 
              ? 'Please provide your company information to continue'
              : 'Manage your company profile and billing information'}
          </p>
        </div>

        <div className="card">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-brand-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Company Profile</h2>
                <p className="text-sm text-slate-500">This information is used for billing and lead routing</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-700 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 text-emerald-700 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">Settings saved successfully!</p>
              </div>
            )}

            <div>
              <label htmlFor="name" className="label">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                placeholder="Your Pest Control Company"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="label">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input"
                placeholder="(555) 123-4567"
              />
              <p className="text-xs text-slate-500 mt-1">
                Used for lead contact if they prefer phone calls
              </p>
            </div>

            <div>
              <label htmlFor="website" className="label">
                Website
              </label>
              <input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="input"
                placeholder="https://yourcompany.com"
              />
            </div>

            <div>
              <label htmlFor="description" className="label">
                Company Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input min-h-[120px] resize-y"
                placeholder="Tell us about your company, services, and expertise..."
                rows={5}
              />
              <p className="text-xs text-slate-500 mt-1">
                Provide a brief description of your company and services
              </p>
            </div>

            <div>
              <label htmlFor="billing_email" className="label">
                Billing Email
              </label>
              <input
                id="billing_email"
                type="email"
                value={formData.billing_email}
                onChange={(e) => setFormData({ ...formData, billing_email: e.target.value })}
                className="input"
                placeholder="billing@yourcompany.com"
              />
              <p className="text-xs text-slate-500 mt-1">
                Stripe invoices will be sent to this address
              </p>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSaving || !formData.name}
                className="btn-primary w-full justify-center"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  isSetup ? 'Complete Setup' : 'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    }>
      <SettingsContent />
    </Suspense>
  )
}

