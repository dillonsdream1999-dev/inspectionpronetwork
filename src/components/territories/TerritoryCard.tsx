'use client'

import { useState } from 'react'
import { MapPin, Users, Hash, Lock, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import type { Tables } from '@/types/database'

interface TerritoryCardProps {
  territory: Tables<'territories'>
  isAdjacentEligible?: boolean
  onClaim?: () => void
  isLoggedIn?: boolean
}

export function TerritoryCard({ 
  territory, 
  isAdjacentEligible = false,
  onClaim,
  isLoggedIn = false
}: TerritoryCardProps) {
  const [showZips, setShowZips] = useState(false)
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
  const price = isAdjacentEligible ? adjacentPrice : basePrice

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
            ~{territory.population_est.toLocaleString()} pop.
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Hash className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600">
            {territory.zip_codes?.length || 0} ZIP codes
          </span>
        </div>
      </div>

      {/* ZIP Codes Expandable Section */}
      {territory.zip_codes && territory.zip_codes.length > 0 && (
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

      <div className="border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">${price}</span>
              <span className="text-slate-500">/mo</span>
            </div>
            {isAdjacentEligible && isLoggedIn && (
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
              Claim Territory
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

