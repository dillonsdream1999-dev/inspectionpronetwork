'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { TerritoryCard } from '@/components/territories/TerritoryCard'
import { TerritoryFilters } from '@/components/territories/TerritoryFilters'
import { SocialProofPopup } from '@/components/marketing/SocialProofPopup'
import { createClient } from '@/lib/supabase/client'
import { MapPin, Loader2, AlertCircle, Send, CheckCircle2, PhoneCall, MessageSquare, X } from 'lucide-react'
import type { Tables } from '@/types/database'

export default function TerritoriesPage() {
  const router = useRouter()
  const [territories, setTerritories] = useState<Tables<'territories'>[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [adjacentEligible, setAdjacentEligible] = useState<string[]>([])
  const [isClaimingTerritory, setIsClaimingTerritory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'individual' | 'dma'>('individual') // Default to individual territories

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
  const [showSetupComplete, setShowSetupComplete] = useState(false)

  // Check for setup complete query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('setup') === 'complete') {
      setShowSetupComplete(true)
      // Remove query param from URL
      const url = new URL(window.location.href)
      url.searchParams.delete('setup')
      window.history.replaceState({}, '', url.toString())
      // Auto-hide after 6 seconds
      setTimeout(() => setShowSetupComplete(false), 6000)
    }
  }, [])

  // Get unique states
  const states = [...new Set(territories.map((t) => t.state))].sort()

  // Filter territories - separate DMAs from regular territories
  // Handle case where is_dma might not exist yet (migration not run)
  const filteredTerritories = territories.filter((territory) => {
    if (selectedState && territory.state !== selectedState) return false
    if (metroSearch && !territory.metro_area?.toLowerCase().includes(metroSearch.toLowerCase())) return false
    if (zipSearch && !territory.zip_codes?.some(zip => zip.includes(zipSearch))) return false
    if (statusFilter && territory.status !== statusFilter) return false
    // Exclude DMAs from regular territory list (is_dma might be undefined if migration not run)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return !(territory as any).is_dma // Exclude DMAs from regular territory list
  })
  
  const filteredDMAs = territories.filter((territory) => {
    if (selectedState && territory.state !== selectedState) return false
    if (metroSearch && !territory.metro_area?.toLowerCase().includes(metroSearch.toLowerCase())) return false
    if (statusFilter && territory.status !== statusFilter) return false
    // Only show DMAs (is_dma might be undefined if migration not run)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return !!(territory as any).is_dma // Only show DMAs
  })

  const fetchTerritories = useCallback(async () => {
    try {
      const response = await fetch('/api/territories')
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      const territoriesData = data.territories || []
      setTerritories(territoriesData)
      
      // Debug: Log DMA count
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dmaCount = territoriesData.filter((t: any) => t.is_dma).length
      console.log('Total territories:', territoriesData.length, 'DMAs:', dmaCount)
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
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        setIsLoggedIn(!!user)
        if (user) {
          fetchAdjacentEligible()
        }
      } catch (error) {
        console.error('Failed to check auth:', error)
        // Continue without auth - user can still browse territories
      }
    }

    checkAuth()
    fetchTerritories()
  }, [fetchTerritories, fetchAdjacentEligible])

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
            {/* Setup Complete Banner */}
            {showSetupComplete && (
              <div className="mb-8 bg-gradient-to-r from-brand-50 to-accent-50 border-2 border-brand-200 rounded-xl p-4 shadow-lg animate-in slide-in-from-top duration-500">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-brand-900 mb-1">
                      Profile Complete! 🎉
                    </h3>
                    <p className="text-brand-800">
                      Your profile is set up. Browse available territories below and start receiving leads!
                    </p>
                  </div>
                  <button
                    onClick={() => setShowSetupComplete(false)}
                    className="flex-shrink-0 text-brand-600 hover:text-brand-800 transition-colors"
                    aria-label="Dismiss"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 rounded-full px-4 py-2 mb-4">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Browse Available Territories</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Find Your Territory
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-4">
            Exclusive access to inspection-driven demand from Bed Bug Inspection Pro users.
          </p>
          
          {/* Pricing Highlight */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-sm">
            <div className="bg-white border-2 border-brand-200 rounded-lg px-4 py-2">
              <span className="text-slate-600">Individual Territory:</span>
              <span className="ml-2 text-2xl font-bold text-brand-600">$250</span>
              <span className="text-slate-500">/mo</span>
            </div>
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg px-4 py-2">
              <span className="text-slate-700">Adjacent Territory:</span>
              <span className="ml-2 text-2xl font-bold text-emerald-600">$150</span>
              <span className="text-slate-500">/mo</span>
              <span className="ml-2 text-xs text-emerald-700 font-medium">($100 savings)</span>
            </div>
          </div>
          <a 
            href="#request-territory" 
            className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium text-sm border border-brand-200 hover:border-brand-300 bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-full transition-colors"
          >
            <Send className="w-4 h-4" />
            Don't see your territory? Request it
          </a>
        </div>

        {/* View Mode Toggle - Always Visible */}
        {(() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const hasDMAs = territories.some((t: any) => t.is_dma)
          return hasDMAs ? (
            <div className="mb-8 flex items-center justify-center">
              <div className="bg-gradient-to-r from-brand-50 to-accent-50 border-2 border-brand-200 rounded-xl p-3 shadow-lg max-w-xl w-full">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-slate-700">View Options:</span>
                </div>
                <div className="flex rounded-lg border-2 border-brand-300 bg-white p-1 shadow-inner">
                  <button
                    onClick={() => setViewMode('individual')}
                    className={`flex-1 px-6 py-3 rounded-md text-sm font-bold transition-all ${
                      viewMode === 'individual'
                        ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-md scale-[1.02]'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span>Individual Territories</span>
                      <span className={`text-xs font-normal ${viewMode === 'individual' ? 'text-brand-100' : 'text-slate-500'}`}>
                        $250/mo • $150/mo adjacent
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() => setViewMode('dma')}
                    className={`flex-1 px-6 py-3 rounded-md text-sm font-bold transition-all ${
                      viewMode === 'dma'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md scale-[1.02]'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span>🏆 Full DMAs</span>
                      <span className={`text-xs font-normal ${viewMode === 'dma' ? 'text-amber-100' : 'text-slate-500'}`}>
                        $3,000/mo • Entire Market
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ) : null
        })()}

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
        ) : (viewMode === 'individual' && filteredTerritories.length === 0) || (viewMode === 'dma' && filteredDMAs.length === 0) ? (
          <div className="text-center py-24">
            <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-lg text-slate-600">No {viewMode === 'individual' ? 'territories' : 'DMAs'} found matching your criteria.</p>
            <p className="text-slate-500 mt-2">Try adjusting your filters or {viewMode === 'individual' ? 'check Full DMAs' : 'check Individual Territories'}.</p>
            {filteredDMAs.length > 0 && viewMode === 'individual' && (
              <button
                onClick={() => setViewMode('dma')}
                className="mt-4 text-brand-600 hover:text-brand-700 font-medium"
              >
                View Full DMAs instead →
              </button>
            )}
            {filteredTerritories.length > 0 && viewMode === 'dma' && (
              <button
                onClick={() => setViewMode('individual')}
                className="mt-4 text-brand-600 hover:text-brand-700 font-medium"
              >
                View Individual Territories instead →
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Individual Territories Section (Default View) */}
            {viewMode === 'individual' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                      Individual Territories
                    </h2>
                    <p className="text-sm text-slate-500">
                      Showing {filteredTerritories.length} of {territories.filter(t => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        return !(t as any).is_dma
                      }).length} territories
                    </p>
                  </div>
                  {isLoggedIn && adjacentEligible.length > 0 && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2">
                      <p className="text-sm text-emerald-700 font-medium">
                        {adjacentEligible.length} adjacent discount{adjacentEligible.length > 1 ? 's' : ''} available
                      </p>
                      <p className="text-xs text-emerald-600 mt-1">Save $100/month on each</p>
                    </div>
                  )}
                </div>

                {filteredTerritories.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
                    <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-lg text-slate-600 mb-2">No individual territories found</p>
                    <p className="text-slate-500 text-sm">Try adjusting your filters or check Full DMAs</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTerritories.map((territory) => (
                      <div key={territory.id} id={`territory-${territory.id}`} className="relative">
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* DMA Section (Toggle View) */}
            {viewMode === 'dma' && filteredDMAs.length > 0 && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    🏆 Full DMA Ownership
                  </h2>
                  <p className="text-slate-600 mb-2">
                    Exclusive control of entire Designated Market Areas
                  </p>
                  <div className="bg-brand-50 border border-brand-200 rounded-lg px-4 py-3 inline-block">
                    <span className="text-sm text-slate-700">Pricing:</span>
                    <span className="ml-2 text-xl font-bold text-brand-600">$3,000</span>
                    <span className="text-slate-500">/month</span>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDMAs.map((territory) => (
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
                        isAdjacentEligible={false}
                        isLoggedIn={isLoggedIn}
                        onClaim={() => handleClaimTerritory(territory.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No DMAs message */}
            {viewMode === 'dma' && filteredDMAs.length === 0 && (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
                <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-lg text-slate-600 mb-2">No DMAs found</p>
                <p className="text-slate-500 text-sm">Try adjusting your filters or check Individual Territories</p>
              </div>
            )}
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

            {/* Contact Section */}
            <div id="contact" className="mt-16 pt-16 border-t border-slate-200 scroll-mt-20">
              <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-xl p-8 text-white text-center">
                <PhoneCall className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <h3 className="text-2xl font-bold mb-3">Questions About Territories?</h3>
                <p className="text-brand-100 mb-6 max-w-xl mx-auto">
                  We're here to help! Call or text us to discuss territory availability, pricing, or any questions about the platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a 
                    href="tel:8169262111" 
                    className="inline-flex items-center justify-center gap-2 bg-white text-brand-600 hover:bg-brand-50 text-base px-6 py-2.5 rounded-lg font-semibold transition-colors"
                  >
                    <PhoneCall className="w-5 h-5" />
                    Call (816) 926-2111
                  </a>
                  <a 
                    href="sms:8169262111" 
                    className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-white text-base px-6 py-2.5 rounded-lg font-semibold transition-colors border border-white/20"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Text Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Popup */}
      <SocialProofPopup />
    </div>
  )
}

