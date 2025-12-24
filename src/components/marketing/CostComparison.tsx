'use client'

import { DollarSign, TrendingDown, Calculator, Target, Zap, CheckCircle2 } from 'lucide-react'

export function CostComparison() {
  const monthlyPrice = 250
  const typicalJobValue = 1500 // Average heat treatment
  
  // Example calculation with 10 leads/month
  const leadsPerMonth = 10
  const costPerLead = monthlyPrice / leadsPerMonth
  const conversionRate = 0.40 // 40%
  const jobsPerMonth = leadsPerMonth * conversionRate
  const monthlyRevenue = jobsPerMonth * typicalJobValue
  const roi = (monthlyRevenue / monthlyPrice) * 100
  
  // Google Ads comparison
  const googleAdsCpl = 65 // Average of $40-80
  const googleAdsMonthly = leadsPerMonth * googleAdsCpl
  const savings = googleAdsMonthly - monthlyPrice
  const savingsPercent = ((savings / googleAdsMonthly) * 100).toFixed(0)
  
  return (
    <div className="card p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center">
          <Calculator className="w-6 h-6 text-accent-500" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Google Ads vs. Territory Access</h3>
          <p className="text-sm text-slate-500">Real cost benchmarks for bed bug removal</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Google Ads Benchmarks */}
        <div className="bg-red-50 rounded-xl p-5 border-2 border-red-200">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-red-600" />
            <h4 className="font-bold text-slate-900">Google Ads Cost Benchmarks</h4>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-slate-600">Cost Per Click</p>
              <p className="font-bold text-red-700">$9 - $41</p>
            </div>
            <div>
              <p className="text-slate-600">Cost Per Lead</p>
              <p className="font-bold text-red-700">$40 - $80</p>
            </div>
            <div>
              <p className="text-slate-600">Cost Per Sale</p>
              <p className="font-bold text-red-700">$80 - $100</p>
            </div>
            <div>
              <p className="text-slate-600">Conversion Rate</p>
              <p className="font-bold text-red-700">30-50%</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3 italic">
            Bed bug keywords are expensive due to emergency-level urgency, high treatment costs ($500-$2,000+), and desperate customers willing to pay premium prices.
          </p>
        </div>

        {/* The Math - Your Service */}
        <div className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-xl p-5 border-2 border-brand-300">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-brand-600" />
            <h4 className="font-bold text-slate-900">Territory Access Math</h4>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Monthly subscription:</span>
              <span className="font-bold text-brand-700">${monthlyPrice}/mo</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Example: {leadsPerMonth} leads/month:</span>
              <span className="font-bold text-brand-700">${costPerLead.toFixed(0)}/lead</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700">With {conversionRate * 100}% conversion:</span>
              <span className="font-bold text-brand-700">{jobsPerMonth.toFixed(0)} jobs/month</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Avg. job value (${typicalJobValue.toLocaleString()}):</span>
              <span className="font-bold text-brand-700">${monthlyRevenue.toLocaleString()}/mo revenue</span>
            </div>
            <div className="border-t border-brand-300 pt-3 mt-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">ROI:</span>
                <span className="text-2xl font-bold text-emerald-600">{roi.toFixed(0)}x</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">Return on subscription cost</p>
            </div>
          </div>
        </div>

        {/* Comparison */}
        <div className="bg-emerald-50 rounded-xl p-5 border-2 border-emerald-300">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-emerald-600" />
            <h4 className="font-bold text-slate-900">Cost Savings</h4>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Google Ads ({leadsPerMonth} leads):</span>
              <span className="font-bold text-red-700">${googleAdsMonthly.toLocaleString()}/mo</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Territory Access:</span>
              <span className="font-bold text-emerald-700">${monthlyPrice}/mo</span>
            </div>
            <div className="border-t border-emerald-300 pt-3 mt-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">You Save:</span>
                <span className="text-xl font-bold text-emerald-600">${savings.toLocaleString()}/mo ({savingsPercent}% less)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <h4 className="font-bold text-slate-900 mb-3 text-sm">Additional Benefits:</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-slate-700">Exclusive leads (not shared with competitors like HomeAdvisor)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-slate-700">Predictable monthly cost vs. volatile ad spending</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-slate-700">Higher-intent leads (users completed guided inspection)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-slate-700">No bidding wars or seasonal cost fluctuations</span>
            </li>
          </ul>
        </div>
        
        <p className="text-xs text-slate-500 italic text-center">
          * Calculations based on industry averages. Actual results may vary. Territory subscription provides exclusive access but does not guarantee a specific number of leads.
        </p>
      </div>
    </div>
  )
}
