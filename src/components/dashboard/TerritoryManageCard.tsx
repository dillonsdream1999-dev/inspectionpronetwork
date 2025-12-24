'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Calendar, CreditCard, Loader2 } from 'lucide-react'
import type { Tables } from '@/types/database'

interface TerritoryManageCardProps {
  ownership: Tables<'territory_ownership'> & {
    territories: Tables<'territories'> | null
  }
}

export function TerritoryManageCard({ ownership }: TerritoryManageCardProps) {
  const router = useRouter()
  const [isCanceling, setIsCanceling] = useState(false)
  const territory = ownership.territories

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this territory subscription? This action cannot be undone.')) {
      return
    }

    setIsCanceling(true)

    try {
      const response = await fetch('/api/stripe/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: ownership.stripe_subscription_id })
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      router.refresh()
    } catch (err) {
      console.error('Cancel error:', err)
      alert('Failed to cancel subscription. Please contact support.')
    } finally {
      setIsCanceling(false)
    }
  }

  const isActive = ownership.status === 'active'
  const territory = ownership.territories as { is_dma?: boolean } | null
  const price = territory?.is_dma ? 3000 : (ownership.price_type === 'adjacent' ? 150 : 250)

  return (
    <div className={`card p-6 ${!isActive ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{territory?.name}</h3>
          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
            <MapPin className="w-4 h-4" />
            <span>{territory?.metro_area || territory?.state}</span>
          </div>
        </div>
        
        <span className={isActive ? 'badge-success' : 'badge-neutral'}>
          {isActive ? 'Active' : 'Canceled'}
        </span>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600">
            Started {new Date(ownership.started_at).toLocaleDateString()}
          </span>
        </div>
        
        {ownership.ended_at && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">
              Ended {new Date(ownership.ended_at).toLocaleDateString()}
            </span>
          </div>
        )}
        
        <div className="flex items-center gap-2 text-sm">
          <CreditCard className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600">${price}/month</span>
          {ownership.price_type === 'adjacent' && (
            <span className="text-xs text-emerald-600">(Adjacent discount)</span>
          )}
        </div>
      </div>

      {isActive && (
        <button
          onClick={handleCancel}
          disabled={isCanceling}
          className="w-full btn-secondary text-sm text-red-600 hover:bg-red-50 hover:border-red-200"
        >
          {isCanceling ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Canceling...
            </>
          ) : (
            'Cancel Subscription'
          )}
        </button>
      )}
    </div>
  )
}

