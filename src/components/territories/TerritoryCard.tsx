'use client'

import { useState, useEffect } from 'react'
import { MapPin, Users, Hash, Lock, Clock, ChevronDown, ChevronUp, Phone, Megaphone, CheckCircle2, Loader2 } from 'lucide-react'
import type { Tables } from '@/types/database'

interface TerritoryCardProps {
  territory: Tables<'territories'>
  isAdjacentEligible?: boolean
  onClaim?: () => void
  isLoggedIn?: boolean
}

interface TerritoryInDMA {
  id: string
  name: string
  state: string
  metro_area: string | null
  population_est: number
  zip_codes: string[] | null
  status: Tables<'territories'>['status']
}

export function TerritoryCard({ 
  territory, 
  isAdjacentEligible = false,
  onClaim,
  isLoggedIn = false
}: TerritoryCardProps) {
  // Type assertion for is_dma which may not be in the database types yet
  const territoryWithDma = territory as Tables<'territories'> & { is_dma?: boolean }
  const [showZips, setShowZips] = useState(false)
  const [showTerritories, setShowTerritories] = useState(false)
  const [dmaTerritories, setDmaTerritories] = useState<TerritoryInDMA[]>([])
  const [isLoadingTerritories, setIsLoadingTerritories] = useState(false)
  const statusConfig = {
    available: {
      label: 'Available',
      class: 'badge-success',
      icon: null
    },
    held: {
      label: 'Held',
      class: 'badge-warning',
      icon: Clock
    },
    taken: {
      label: 'Taken',
      class: 'badge-danger',
      icon: Lock
    }
  }

  const status = statusConfig[territory.status]
  const StatusIcon = status.icon

  const basePrice = 250
  const adjacentPrice = 150
  const dmaPrice = 3000
  const price = territoryWithDma.is_dma ? dmaPrice : (isAdjacentEligible ? adjacentPrice : basePrice)

  // Calculate accurate DMA population from individual territories
  const dmaPopulation = territoryWithDma.is_dma && dmaTerritories.length > 0
    ? dmaTerritories.reduce((sum, terr) => sum + terr.population_est, 0)
    : territory.population_est

  // Fetch territories for DMA when dropdown is opened or when component mounts (to get accurate population)
  useEffect(() => {
    if (territoryWithDma.is_dma && dmaTerritories.length === 0) {
      setIsLoadingTerritories(true)
      fetch(`/api/territories/by-dma?dmaId=${territory.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.territories) {
            setDmaTerritories(data.territories)
          }
          setIsLoadingTerritories(false)
        })
        .catch(err => {
          console.error('Error fetching DMA territories:', err)
          setIsLoadingTerritories(false)
        })
    }
  }, [territoryWithDma.is_dma, territory.id, dmaTerritories.length])

  return (
    <div className="card p-6 hover:shadow-lg transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
            {territory.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
            <MapPin className="w-4 h-4" />
            <span>{territory.metro_area || territory.state}</span>
            <span className="text-slate-300">•</span>
            <span className="capitalize">{territory.type}</span>
          </div>
        </div>
        
        <div className={status.class}>
          {StatusIcon && <StatusIcon className="w-3 h-3 mr-1" />}
          {status.label}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600">
            ~{dmaPopulation.toLocaleString()} pop.
            {territoryWithDma.is_dma && dmaTerritories.length > 0 && (
              <span className="text-xs text-slate-500 ml-1">(calculated)</span>
            )}
          </span>
        </div>
        {!territoryWithDma.is_dma && (
          <div className="flex items-center gap-2 text-sm">
            <Hash className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">
              {territory.zip_codes?.length || 0} ZIP codes
            </span>
          </div>
        )}
        {territoryWithDma.is_dma && (
          <div className="flex items-center gap-2 text-sm">
            <Hash className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">
              {dmaTerritories.length > 0 ? `${dmaTerritories.length} territories` : 'Full DMA Coverage'}
            </span>
          </div>
        )}
      </div>

      {/* ZIP Codes Expandable Section - Only show for non-DMA territories */}
      {!territoryWithDma.is_dma && territory.zip_codes && territory.zip_codes.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => setShowZips(!showZips)}
            className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors"
          >
            {showZips ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Hide ZIP codes
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                View ZIP codes
              </>
            )}
          </button>
          
          {showZips && (
            <div className="mt-3 p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 mb-2 font-medium">Included ZIP codes:</p>
              <div className="flex flex-wrap gap-1.5">
                {territory.zip_codes.map((zip) => (
                  <span 
                    key={zip} 
                    className="inline-block px-2 py-0.5 bg-white border border-slate-200 rounded text-xs text-slate-700 font-mono"
                  >
                    {zip}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Territories Expandable Section - Only show for DMA territories */}
      {territoryWithDma.is_dma && (
        <div className="mb-4">
          <button
            onClick={() => setShowTerritories(!showTerritories)}
            className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
          >
            {showTerritories ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Hide territories
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                View territories
              </>
            )}
          </button>
          
          {showTerritories && (
            <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
              {isLoadingTerritories ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
                  <span className="ml-2 text-sm text-amber-700">Loading territories...</span>
                </div>
              ) : dmaTerritories.length > 0 ? (
                <>
                  <p className="text-xs text-amber-700 mb-3 font-medium">
                    Included territories ({dmaTerritories.length}):
                  </p>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {dmaTerritories.map((terr) => (
                      <div 
                        key={terr.id} 
                        className="p-2 bg-white border border-amber-200 rounded text-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900">{terr.name}</div>
                            <div className="text-slate-600 mt-0.5">
                              {terr.metro_area || terr.state} • ~{terr.population_est.toLocaleString()} pop.
                            </div>
                            {terr.zip_codes && terr.zip_codes.length > 0 && (
                              <div className="text-slate-500 mt-1">
                                {terr.zip_codes.length} ZIP code{terr.zip_codes.length > 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                          <div className={`px-2 py-0.5 rounded text-xs font-medium ${
                            terr.status === 'available' ? 'bg-emerald-100 text-emerald-700' :
                            terr.status === 'taken' ? 'bg-slate-100 text-slate-600' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {terr.status === 'available' ? 'Available' :
                             terr.status === 'taken' ? 'Taken' : 'Held'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-amber-700">No individual territories found for this DMA.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* DMA Exclusive Benefits */}
      {territoryWithDma.is_dma && territory.status === 'available' && (
        <div className="mb-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Megaphone className="w-5 h-5 text-amber-600" />
            <h4 className="font-bold text-slate-900 text-sm">DMA Exclusive Benefits</h4>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <span><strong className="text-slate-900">Direct Phone Support</strong> - Priority access to our team</span>
            </li>
            <li className="flex items-start gap-2">
              <Megaphone className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <span>
                <strong className="text-slate-900">Marketing Spend Included</strong> - We drive users to the inspection app in your DMA via Facebook, Instagram, TikTok, and more
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <span><strong className="text-slate-900">More Leads</strong> - Increased app usage = more inspection requests routed to you</span>
            </li>
          </ul>
        </div>
      )}

      <div className="border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">${price}</span>
              <span className="text-slate-500">/mo</span>
            </div>
            {isAdjacentEligible && isLoggedIn && !territoryWithDma.is_dma && (
              <span className="text-xs text-emerald-600 font-medium">
                Adjacent discount applied (-$100)
              </span>
            )}
          </div>

          {territory.status === 'available' && (
            <button
              onClick={onClaim}
              className="btn-primary text-sm"
            >
              {territoryWithDma.is_dma ? 'Claim DMA' : 'Claim Territory'}
            </button>
          )}
          
          {territory.status === 'held' && (
            <span className="text-sm text-amber-600 font-medium">
              Currently being claimed
            </span>
          )}
          
          {territory.status === 'taken' && (
            <span className="text-sm text-slate-500">
              Not available
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
