'use client'

import { Search, Filter, X } from 'lucide-react'

interface TerritoryFiltersProps {
  states: string[]
  selectedState: string
  setSelectedState: (state: string) => void
  metroSearch: string
  setMetroSearch: (search: string) => void
  zipSearch: string
  setZipSearch: (search: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
}

export function TerritoryFilters({
  states,
  selectedState,
  setSelectedState,
  metroSearch,
  setMetroSearch,
  zipSearch,
  setZipSearch,
  statusFilter,
  setStatusFilter
}: TerritoryFiltersProps) {
  const hasFilters = selectedState || metroSearch || zipSearch || statusFilter

  const clearFilters = () => {
    setSelectedState('')
    setMetroSearch('')
    setZipSearch('')
    setStatusFilter('')
  }

  return (
    <div className="card p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <span className="font-semibold text-slate-900">Filter Territories</span>
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* State Filter */}
        <div>
          <label className="label">State</label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="input"
          >
            <option value="">All States</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* Metro Search */}
        <div>
          <label className="label">Metro Area</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={metroSearch}
              onChange={(e) => setMetroSearch(e.target.value)}
              placeholder="Search metro..."
              className="input pl-10"
            />
          </div>
        </div>

        {/* ZIP Search */}
        <div>
          <label className="label">ZIP Code</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={zipSearch}
              onChange={(e) => setZipSearch(e.target.value)}
              placeholder="Search ZIP..."
              className="input pl-10"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="label">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input"
          >
            <option value="">All Statuses</option>
            <option value="available">Available</option>
            <option value="held">Held</option>
            <option value="taken">Taken</option>
          </select>
        </div>
      </div>
    </div>
  )
}

