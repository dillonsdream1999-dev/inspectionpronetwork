'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { TerritoryCard } from '@/components/territories/TerritoryCard'
import { TerritoryFilters } from '@/components/territories/TerritoryFilters'
import { createClient } from '@/lib/supabase/client'
import { MapPin, Loader2, AlertCircle, Send, CheckCircle2 } from 'lucide-react'
import type { Tables } from '@/types/database'

export default function TerritoriesPage() {
  const router = useRouter()
  const [territories, setTerritories] = useState<Tables<'territories'>[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [adjacentEligible, setAdjacentEligible] = useState<string[]>([])
  const [isClaimingTerritory, setIsClaimingTerritory] = useState<string | null>(null)

  // Filters
  const [selectedState, setSelectedState] = useState('')
  const [metroSearch, setMetroSearch] = useState('')
  const [zipSearch, setZipSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Territory Request Form
  const [requestForm, setRequestForm] = useState({
    name: '',
    email: '',
    company: '',
    city: '',
    state: '',
    zip: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const supabase = createClient()

  // Get unique states
  const states = [...new Set(territories.map((t) => t.state))].sort()

  // Filter territories
  const filteredTerritories = territories.filter((territory) => {
    if (selectedState && territory.state !== selectedState) return false
    if (metroSearch && !territory.metro_area?.toLowerCase().includes(metroSearch.toLowerCase())) return false
    if (zipSearch && !territory.zip_codes?.some(zip => zip.includes(zipSearch))) return false
    if (statusFilter && territory.status !== statusFilter) return false
    return true
  })

  const fetchTerritories = useCallback(async () => {
    try {
      const response = await fetch('/api/territories')
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setTerritories(data.territories || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load territories')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchAdjacentEligible = useCallback(async () => {
    try {
      const response = await fetch('/api/territories/adjacent-eligible')
      const data = await response.json()
      console.log('Adjacent eligible territories:', data.eligible)
      setAdjacentEligible(data.eligible || [])
    } catch (err) {
      console.error('Failed to fetch adjacent eligible:', err)
      // Ignore errors, just means no adjacent discounts
    }
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)
      if (user) {
        fetchAdjacentEligible()
      }
    }

    checkAuth()
    fetchTerritories()
  }, [supabase.auth, fetchTerritories, fetchAdjacentEligible])

  const handleClaimTerritory = async (territoryId: string) => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/territories&territory=${territoryId}`)
      return
    }

    setIsClaimingTerritory(territoryId)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ territoryId })
      })

      const data = await response.json()

      if (data.error) {
        alert(data.error)
        return
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error('Claim error:', err)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setIsClaimingTerritory(null)
    }
  }

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/territory-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestForm)
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setSubmitSuccess(true)
      setRequestForm({
        name: '',
        email: '',
        company: '',
        city: '',
        state: '',
        zip: '',
        message: ''
      })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit request')
    } finally {
      setIsSubmitting(false)
    }
  }

  const usStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
  ]

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 rounded-full px-4 py-2 mb-4">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Browse Available Territories</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Find Your Territory
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-6">
            Search for available territories in your area. Each territory provides 
            exclusive access to inspection-driven demand from Bed Bug Inspection Pro users.
          </p>
          <a 
            href="#request-territory" 
            className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium text-sm border border-brand-200 hover:border-brand-300 bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-full transition-colors"
          >
            <Send className="w-4 h-4" />
            Don't see your territory? Request it
          </a>
        </div>

        {/* Filters */}
        <TerritoryFilters
          states={states}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          metroSearch={metroSearch}
          setMetroSearch={setMetroSearch}
          zipSearch={zipSearch}
          setZipSearch={setZipSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
          </div>
        ) : error ? (
          <div className="text-center py-24">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-lg text-red-600">{error}</p>
            <button
              onClick={() => {
                setError(null)
                setIsLoading(true)
                fetchTerritories()
              }}
              className="btn-primary mt-4"
            >
              Try Again
            </button>
          </div>
        ) : filteredTerritories.length === 0 ? (
          <div className="text-center py-24">
            <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-lg text-slate-600">No territories found matching your criteria.</p>
            <p className="text-slate-500 mt-2">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-slate-500">
                Showing {filteredTerritories.length} of {territories.length} territories
              </p>
              {isLoggedIn && adjacentEligible.length > 0 && (
                <p className="text-sm text-emerald-600 font-medium">
                  {adjacentEligible.length} adjacent discount{adjacentEligible.length > 1 ? 's' : ''} available
                </p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTerritories.map((territory) => (
                <div key={territory.id} className="relative">
                  {isClaimingTerritory === territory.id && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                      <div className="flex items-center gap-2 text-brand-600">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Starting checkout...</span>
                      </div>
                    </div>
                  )}
                  <TerritoryCard
                    territory={territory}
                    isAdjacentEligible={adjacentEligible.includes(territory.id)}
                    isLoggedIn={isLoggedIn}
                    onClaim={() => handleClaimTerritory(territory.id)}
                  />
                  {/* Debug info - remove after testing */}
                  {isLoggedIn && territory.status === 'available' && (
                    <div className="text-xs text-slate-400 mt-1">
                      {adjacentEligible.includes(territory.id) ? '✓ Adjacent eligible' : 'Not adjacent'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Request a Territory Section */}
        <div id="request-territory" className="mt-24 border-t border-slate-200 pt-16 scroll-mt-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                Don't See Your Area?
              </h2>
              <p className="text-lg text-slate-600">
                We're expanding! Request a territory in your area and we'll notify you 
                when it becomes available.
              </p>
            </div>

            {submitSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-emerald-900 mb-2">Request Submitted!</h3>
                <p className="text-emerald-700">
                  Thanks for your interest! We'll reach out when a territory in your area becomes available.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="bg-slate-50 rounded-xl p-8 border border-slate-200">
                {submitError && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                    {submitError}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="req-name" className="block text-sm font-medium text-slate-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="req-name"
                      required
                      value={requestForm.name}
                      onChange={(e) => setRequestForm({ ...requestForm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label htmlFor="req-email" className="block text-sm font-medium text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="req-email"
                      required
                      value={requestForm.email}
                      onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="req-company" className="block text-sm font-medium text-slate-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="req-company"
                    value={requestForm.company}
                    onChange={(e) => setRequestForm({ ...requestForm, company: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    placeholder="ABC Pest Control"
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label htmlFor="req-city" className="block text-sm font-medium text-slate-700 mb-1">
                      City / Metro Area *
                    </label>
                    <input
                      type="text"
                      id="req-city"
                      required
                      value={requestForm.city}
                      onChange={(e) => setRequestForm({ ...requestForm, city: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      placeholder="Springfield"
                    />
                  </div>
                  <div>
                    <label htmlFor="req-state" className="block text-sm font-medium text-slate-700 mb-1">
                      State *
                    </label>
                    <select
                      id="req-state"
                      required
                      value={requestForm.state}
                      onChange={(e) => setRequestForm({ ...requestForm, state: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    >
                      <option value="">Select...</option>
                      {usStates.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="req-zip" className="block text-sm font-medium text-slate-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      id="req-zip"
                      value={requestForm.zip}
                      onChange={(e) => setRequestForm({ ...requestForm, zip: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      placeholder="12345"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="req-message" className="block text-sm font-medium text-slate-700 mb-1">
                    Additional Information
                  </label>
                  <textarea
                    id="req-message"
                    rows={3}
                    value={requestForm.message}
                    onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    placeholder="Tell us about your service area, business, or any specific ZIP codes you'd like covered..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Request This Territory
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

