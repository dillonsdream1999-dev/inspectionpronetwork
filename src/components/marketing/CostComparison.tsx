'use client'

import { useState } from 'react'
import { DollarSign, TrendingDown, Calculator } from 'lucide-react'

export function CostComparison() {
  const [costPerJob, setCostPerJob] = useState(125)
  const monthlyPrice = 250
  
  const equivalentJobs = monthlyPrice / costPerJob
  
  return (
    <div className="card p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center">
          <Calculator className="w-6 h-6 text-accent-500" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Cost Comparison</h3>
          <p className="text-sm text-slate-500">Compare to Google Ads spend</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="label">Your cost per booked job via Google Ads</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="number"
              value={costPerJob}
              onChange={(e) => setCostPerJob(Number(e.target.value) || 0)}
              className="input pl-10"
              min={1}
            />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-xl p-6 border border-brand-200">
          <div className="flex items-start gap-3">
            <TrendingDown className="w-6 h-6 text-brand-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-brand-900 font-medium">
                ${monthlyPrice}/month ≈ about <span className="text-2xl font-bold">{equivalentJobs.toFixed(1)}</span> booked jobs worth of ad spend
              </p>
              <p className="text-sm text-brand-700 mt-2">
                Territory access provides predictable monthly pricing vs. volatile bidding wars
              </p>
            </div>
          </div>
        </div>
        
        <p className="text-xs text-slate-500 italic">
          * Example comparison only. Territory subscription does not guarantee any specific number of leads or bookings.
        </p>
      </div>
    </div>
  )
}

