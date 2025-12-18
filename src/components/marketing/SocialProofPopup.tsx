'use client'

import { useState, useEffect } from 'react'
import { X, Users, TrendingUp, MapPin, Clock } from 'lucide-react'

interface RecentSignup {
  id: string
  started_at: string
  territories: {
    name: string
    state: string
  } | null
  companies: {
    name: string
  } | null
}

interface SocialProofData {
  recentSignups: RecentSignup[]
  totalCount: number
  todayCount: number
}

export function SocialProofPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [data, setData] = useState<SocialProofData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user has dismissed the popup (stored in localStorage)
    const dismissed = localStorage.getItem('social-proof-dismissed')
    if (dismissed) {
      setIsDismissed(true)
      return
    }

    // Fetch social proof data
    const fetchData = async () => {
      try {
        const response = await fetch('/api/social-proof')
        const result = await response.json()
        if (result.error) {
          console.error('Failed to fetch social proof:', result.error)
          return
        }
        setData(result)
        
        // Show popup after 3 seconds delay if we have at least 20 active territories
        if (result.totalCount >= 20) {
          setTimeout(() => {
            setIsVisible(true)
          }, 3000)
        }
      } catch (error) {
        console.error('Error fetching social proof:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem('social-proof-dismissed', 'true')
  }

  if (isDismissed || isLoading || !data || data.totalCount < 20) {
    return null
  }

  if (!isVisible) {
    return null
  }

  // Get the most recent signup
  const latestSignup = data.recentSignups[0]

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up max-w-sm">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Join {data.totalCount}+ Companies</p>
              {data.todayCount > 0 && (
                <p className="text-white/80 text-xs">
                  {data.todayCount} signed up today!
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {latestSignup && (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-brand-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">
                  {latestSignup.companies?.name || 'A company'} just claimed
                </p>
                <p className="text-sm text-slate-600">
                  {latestSignup.territories?.name}, {latestSignup.territories?.state}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-500">
                    {getTimeAgo(latestSignup.started_at)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-600" />
                <span className="text-slate-700 font-medium">
                  {data.totalCount} Active Territories
                </span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-2">
            <p className="text-xs text-slate-600 text-center">
              Don't miss out on exclusive leads in your area
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  }
}

