'use client'

import { useState, useEffect } from 'react'
import { X, MapPin, TrendingUp } from 'lucide-react'

interface SocialProofData {
  totalCount: number
  recentSignups: Array<{
    id: string
    territoryName: string
    state: string
    createdAt: string
  }>
  signups24h: number
}

export function SocialProofPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [data, setData] = useState<SocialProofData | null>(null)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if already dismissed in this session
    const dismissed = sessionStorage.getItem('socialProofDismissed')
    if (dismissed === 'true') {
      setIsDismissed(true)
      return
    }

    // Fetch social proof data
    const fetchData = async () => {
      try {
        const response = await fetch('/api/social-proof')
        const result = await response.json()
        setData(result)

        // Only show if there are at least 20 active territories
        if (result.totalCount >= 20) {
          // Show after a delay
          setTimeout(() => {
            setIsVisible(true)
          }, 3000) // 3 second delay
        }
      } catch (error) {
        console.error('Failed to fetch social proof:', error)
      }
    }

    fetchData()
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    sessionStorage.setItem('socialProofDismissed', 'true')
  }

  if (isDismissed || !isVisible || !data || data.totalCount < 20) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up max-w-sm">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-brand-200 p-6 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 text-sm mb-1">
              {data.signups24h > 0 
                ? `${data.signups24h} territory${data.signups24h > 1 ? 'ies' : ''} claimed in the last 24 hours!`
                : 'Territories are being claimed!'
              }
            </h3>
            <p className="text-xs text-slate-600">
              Join {data.totalCount}+ operators who have secured their markets
            </p>
          </div>
        </div>

        {data.recentSignups.length > 0 && (
          <div className="border-t border-slate-200 pt-3 mt-3">
            <p className="text-xs font-semibold text-slate-700 mb-2">Recent signups:</p>
            <div className="space-y-1.5">
              {data.recentSignups.slice(0, 3).map((signup) => (
                <div key={signup.id} className="flex items-center gap-2 text-xs text-slate-600">
                  <MapPin className="w-3 h-3 text-brand-500" />
                  <span className="truncate">
                    {signup.territoryName}, {signup.state}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}



