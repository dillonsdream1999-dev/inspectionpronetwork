'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, MapPin, Loader2, Plus, Search, Trash2 } from 'lucide-react'

interface Territory {
  id: string
  name: string
  state: string
  status: string
}

interface Ownership {
  id: string
  territory_id: string
  status: string
  price_type: string
  stripe_subscription_id: string
  territories?: { name: string }
}

export function AssignTerritoryButton({ 
  companyId,
  companyName,
  currentOwnerships,
  availableTerritories 
}: { 
  companyId: string
  companyName: string
  currentOwnerships: Ownership[]
  availableTerritories: Territory[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null)
  const [priceType, setPriceType] = useState<'base' | 'adjacent'>('base')
  const router = useRouter()

  const filteredTerritories = availableTerritories.filter(t => 
    t.status === 'available' &&
    (t.name.toLowerCase().includes(search.toLowerCase()) ||
     t.state.toLowerCase().includes(search.toLowerCase()))
  )

  const handleAssign = async () => {
    if (!selectedTerritory) return
    
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/providers/${companyId}/territories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          territoryId: selectedTerritory.id,
          priceType,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to assign territory')
      }

      setIsOpen(false)
      setSelectedTerritory(null)
      setSearch('')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = async (territoryId: string, subscriptionId: string) => {
    if (!subscriptionId.startsWith('manual')) {
      setError('Cannot remove Stripe-subscribed territories. Cancel in Stripe Dashboard.')
      return
    }

    if (!confirm('Are you sure you want to remove this territory?')) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/admin/providers/${companyId}/territories?territoryId=${territoryId}`,
        { method: 'DELETE' }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove territory')
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const activeOwnerships = currentOwnerships.filter(o => o.status === 'active')

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Territory
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <div>
                <h2 className="text-lg font-bold text-white">Manage Territories</h2>
                <p className="text-sm text-slate-400">{companyName}</p>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false)
                  setSelectedTerritory(null)
                  setSearch('')
                  setError(null)
                }}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              {/* Current Territories */}
              {activeOwnerships.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-slate-300 mb-3">Current Territories</h3>
                  <div className="space-y-2">
                    {activeOwnerships.map((ownership) => (
                      <div
                        key={ownership.id}
                        className="flex items-center justify-between bg-slate-900 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-brand-400" />
                          <span className="text-sm text-white">
                            {ownership.territories?.name || 'Unknown'}
                          </span>
                          <span className="text-xs text-slate-500">
                            ${ownership.price_type === 'adjacent' ? '150' : '250'}/mo
                          </span>
                          {ownership.stripe_subscription_id.startsWith('manual') && (
                            <span className="text-xs bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded">
                              Manual
                            </span>
                          )}
                        </div>
                        {ownership.stripe_subscription_id.startsWith('manual') && (
                          <button
                            onClick={() => handleRemove(
                              ownership.territory_id,
                              ownership.stripe_subscription_id
                            )}
                            disabled={isLoading}
                            className="p-1.5 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50"
                            title="Remove territory"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Territory */}
              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-3">Add Territory</h3>
                
                {/* Search */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setSelectedTerritory(null)
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="Search territories..."
                  />
                </div>

                {/* Territory List */}
                {search && !selectedTerritory && (
                  <div className="bg-slate-900 border border-slate-700 rounded-lg max-h-48 overflow-y-auto mb-3">
                    {filteredTerritories.length > 0 ? (
                      filteredTerritories.slice(0, 10).map((territory) => (
                        <button
                          key={territory.id}
                          onClick={() => {
                            setSelectedTerritory(territory)
                            setSearch(territory.name)
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2"
                        >
                          <MapPin className="w-4 h-4 text-slate-500" />
                          {territory.name}, {territory.state}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-slate-500">
                        No available territories found
                      </div>
                    )}
                  </div>
                )}

                {/* Selected Territory */}
                {selectedTerritory && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 bg-brand-600/20 border border-brand-500/30 rounded-lg p-3">
                      <MapPin className="w-4 h-4 text-brand-400" />
                      <span className="text-sm text-white font-medium">
                        {selectedTerritory.name}, {selectedTerritory.state}
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Price Type</label>
                      <select
                        value={priceType}
                        onChange={(e) => setPriceType(e.target.value as 'base' | 'adjacent')}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        <option value="base">Base ($250/mo)</option>
                        <option value="adjacent">Adjacent ($150/mo)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-700 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setIsOpen(false)
                  setSelectedTerritory(null)
                  setSearch('')
                  setError(null)
                }}
                className="px-4 py-2 text-slate-400 hover:text-white font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={!selectedTerritory || isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Assign Territory
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

