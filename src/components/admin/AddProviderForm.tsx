'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, Loader2, MapPin, Check } from 'lucide-react'

interface Territory {
  id: string
  name: string
  state: string
  status: string
  metro_area: string | null
}

interface SelectedTerritory {
  territoryId: string
  priceType: 'base' | 'adjacent'
}

export function AddProviderForm({ 
  availableTerritories 
}: { 
  availableTerritories: Territory[]
}) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [selectedTerritories, setSelectedTerritories] = useState<SelectedTerritory[]>([])
  const [territorySearch, setTerritorySearch] = useState('')

  const filteredTerritories = availableTerritories.filter(t => 
    t.status === 'available' &&
    !selectedTerritories.some(st => st.territoryId === t.id) &&
    (t.name.toLowerCase().includes(territorySearch.toLowerCase()) ||
     t.state.toLowerCase().includes(territorySearch.toLowerCase()) ||
     (t.metro_area && t.metro_area.toLowerCase().includes(territorySearch.toLowerCase())))
  )

  const addTerritory = (territory: Territory) => {
    setSelectedTerritories([...selectedTerritories, {
      territoryId: territory.id,
      priceType: 'base'
    }])
    setTerritorySearch('')
  }

  const removeTerritory = (territoryId: string) => {
    setSelectedTerritories(selectedTerritories.filter(t => t.territoryId !== territoryId))
  }

  const updatePriceType = (territoryId: string, priceType: 'base' | 'adjacent') => {
    setSelectedTerritories(selectedTerritories.map(t => 
      t.territoryId === territoryId ? { ...t, priceType } : t
    ))
  }

  const getTerritoryName = (territoryId: string) => {
    return availableTerritories.find(t => t.id === territoryId)?.name || 'Unknown'
  }

  const resetForm = () => {
    setEmail('')
    setCompanyName('')
    setPhone('')
    setWebsite('')
    setSelectedTerritories([])
    setTerritorySearch('')
    setError(null)
    setSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/admin/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          companyName,
          phone: phone || undefined,
          website: website || undefined,
          territories: selectedTerritories.length > 0 ? selectedTerritories : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create provider')
      }

      setSuccess(true)
      setTimeout(() => {
        resetForm()
        setIsOpen(false)
        router.refresh()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Provider
      </button>
    )
  }

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">Add New Provider</h2>
        <button
          onClick={() => {
            resetForm()
            setIsOpen(false)
          }}
          className="p-2 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="provider@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Company Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="Acme Pest Control"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="(555) 123-4567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Website
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Assign Territories (Optional)
          </label>
          <p className="text-xs text-slate-500 mb-3">
            Assign territories without requiring a Stripe subscription
          </p>

          {/* Selected territories */}
          {selectedTerritories.length > 0 && (
            <div className="space-y-2 mb-4">
              {selectedTerritories.map((st) => (
                <div
                  key={st.territoryId}
                  className="flex items-center justify-between bg-slate-900 rounded-lg p-3"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-brand-400" />
                    <span className="text-sm text-white">{getTerritoryName(st.territoryId)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={st.priceType}
                      onChange={(e) => updatePriceType(st.territoryId, e.target.value as 'base' | 'adjacent')}
                      className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    >
                      <option value="base">Base ($250/mo)</option>
                      <option value="adjacent">Adjacent ($150/mo)</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeTerritory(st.territoryId)}
                      className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Territory search */}
          <div className="relative">
            <input
              type="text"
              value={territorySearch}
              onChange={(e) => setTerritorySearch(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="Search by territory name or state..."
            />
            {territorySearch && filteredTerritories.length > 0 && (
              <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                {filteredTerritories.map((territory) => (
                  <button
                    key={territory.id}
                    type="button"
                    onClick={() => addTerritory(territory)}
                    className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2 border-b border-slate-700 last:border-b-0"
                  >
                    <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>
                      {territory.name}, {territory.state}
                      {territory.metro_area && ` • ${territory.metro_area}`}
                    </span>
                  </button>
                ))}
                <div className="px-4 py-2 text-xs text-slate-500 bg-slate-900 border-t border-slate-700">
                  Showing {filteredTerritories.length} of {availableTerritories.length} available territories
                </div>
              </div>
            )}
            {territorySearch && filteredTerritories.length === 0 && (
              <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-4">
                <p className="text-sm text-slate-400">No territories found matching "{territorySearch}"</p>
              </div>
            )}
            {!territorySearch && (
              <p className="mt-2 text-xs text-slate-500">
                {availableTerritories.length} available territories. Type to search by name or state.
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <p className="text-sm text-emerald-400">Provider created successfully!</p>
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isLoading || success}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Create Provider
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              resetForm()
              setIsOpen(false)
            }}
            className="px-6 py-2.5 text-slate-400 hover:text-white font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

