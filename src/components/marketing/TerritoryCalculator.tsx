'use client'

import { useState } from 'react'
import { Users, Home, Bug, Target, Calculator } from 'lucide-react'

export function TerritoryCalculator() {
  const [population, setPopulation] = useState(100000)
  const [householdSize, setHouseholdSize] = useState(2.5)
  const [incidenceMin, setIncidenceMin] = useState(0.5)
  const [incidenceMax, setIncidenceMax] = useState(2)
  const [captureMin, setCaptureMin] = useState(0.5)
  const [captureMax, setCaptureMax] = useState(2)

  const households = population / householdSize
  
  // Calculate range
  const monthlyOpportunitiesMin = (households * (incidenceMin / 100) * (captureMin / 100)) / 12
  const monthlyOpportunitiesMax = (households * (incidenceMax / 100) * (captureMax / 100)) / 12

  return (
    <div className="card p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
          <Calculator className="w-6 h-6 text-emerald-500" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Territory Math Calculator</h3>
          <p className="text-sm text-slate-500">Estimate potential opportunities</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Population */}
        <div>
          <label className="label flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-400" />
            Territory Population
          </label>
          <input
            type="number"
            value={population}
            onChange={(e) => setPopulation(Number(e.target.value) || 0)}
            className="input"
            min={0}
            step={1000}
          />
        </div>

        {/* Household Size */}
        <div>
          <label className="label flex items-center gap-2">
            <Home className="w-4 h-4 text-slate-400" />
            Avg Household Size
          </label>
          <input
            type="number"
            value={householdSize}
            onChange={(e) => setHouseholdSize(Number(e.target.value) || 1)}
            className="input"
            min={1}
            step={0.1}
          />
        </div>

        {/* Incidence Rate Range */}
        <div>
          <label className="label flex items-center gap-2">
            <Bug className="w-4 h-4 text-slate-400" />
            Annual Incidence Rate (%)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={incidenceMin}
              onChange={(e) => setIncidenceMin(Number(e.target.value) || 0)}
              className="input"
              min={0}
              max={100}
              step={0.1}
              placeholder="Min"
            />
            <span className="text-slate-400">to</span>
            <input
              type="number"
              value={incidenceMax}
              onChange={(e) => setIncidenceMax(Number(e.target.value) || 0)}
              className="input"
              min={0}
              max={100}
              step={0.1}
              placeholder="Max"
            />
          </div>
        </div>

        {/* Capture Rate Range */}
        <div>
          <label className="label flex items-center gap-2">
            <Target className="w-4 h-4 text-slate-400" />
            Capture Rate (%)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={captureMin}
              onChange={(e) => setCaptureMin(Number(e.target.value) || 0)}
              className="input"
              min={0}
              max={100}
              step={0.1}
              placeholder="Min"
            />
            <span className="text-slate-400">to</span>
            <input
              type="number"
              value={captureMax}
              onChange={(e) => setCaptureMax(Number(e.target.value) || 0)}
              className="input"
              min={0}
              max={100}
              step={0.1}
              placeholder="Max"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-8 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
        <div className="text-center">
          <p className="text-sm text-emerald-700 mb-2">Estimated Monthly Opportunities</p>
          <p className="text-4xl font-bold text-emerald-900">
            {monthlyOpportunitiesMin.toFixed(1)} – {monthlyOpportunitiesMax.toFixed(1)}
          </p>
          <p className="text-sm text-emerald-600 mt-2">
            Based on ~{Math.round(households).toLocaleString()} households
          </p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <p className="text-xs text-amber-800">
          <strong>Disclaimer:</strong> These are rough estimates only, based on industry averages and your inputs. 
          Actual results will vary significantly based on local market conditions, seasonality, competition, 
          and many other factors. <strong>No specific number of leads or opportunities is guaranteed.</strong>
        </p>
      </div>
    </div>
  )
}

