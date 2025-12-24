'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { MapPin, Lock, Clock } from 'lucide-react'
import type { Tables } from '@/types/database'
import L from 'leaflet' // Import Leaflet directly for icon fix

// Fix for default Leaflet icons with Webpack/Next.js
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })

// Import useMap directly (it's a hook, not a component)
import { useMap } from 'react-leaflet'

// Import Leaflet CSS
if (typeof window !== 'undefined') {
  require('leaflet/dist/leaflet.css')
}

interface TerritoryMapProps {
  territories: Tables<'territories'>[]
  selectedState?: string
  onTerritoryClick?: (territory: Tables<'territories'>) => void
}

// Component to center map on selected state
function MapController({ selectedState, territories }: { selectedState?: string; territories: Tables<'territories'>[] }) {
  const map = useMap()

  useEffect(() => {
    if (selectedState) {
      const stateTerritories = territories.filter(t => t.state === selectedState && !(t as any).is_dma)
      if (stateTerritories.length > 0) {
        // Calculate center from available territory coordinates
        const coords = stateTerritories
          .map(t => getTerritoryApproxCenter(t))
          .filter(c => c !== null) as { lat: number; lng: number }[]
        
        if (coords.length > 0) {
          const avgLat = coords.reduce((sum, c) => sum + c.lat, 0) / coords.length
          const avgLng = coords.reduce((sum, c) => sum + c.lng, 0) / coords.length
          map.setView([avgLat, avgLng], 7)
        } else {
          // Fallback to state center if no territory coords
          const stateCenter = getStateCenter(selectedState)
          map.setView([stateCenter.lat, stateCenter.lng], 6)
        }
      } else {
        // If no territories in state, just center on state
        const stateCenter = getStateCenter(selectedState)
        map.setView([stateCenter.lat, stateCenter.lng], 6)
      }
    } else {
      // Center on US
      map.setView([39.8283, -98.5795], 4)
    }
  }, [selectedState, territories, map])

  return null
}

// Get approximate center of territory (using first ZIP code or state center)
function getTerritoryApproxCenter(territory: Tables<'territories'>): { lat: number; lng: number } | null {
  // For now, we'll use a simplified approach. In a real app, you'd have pre-geocoded data
  // or use a robust geocoding service.
  // The territory generator script already calculates a centerLat/centerLng, but it's not stored in DB.
  // For this map, we'll rely on a hardcoded state center for simplicity.
  // If we had zip code data with lat/lng, we could use territory.zip_codes[0] to get a more precise center.
  
  // Fallback to state center
  return getStateCenter(territory.state)
}

// Hardcoded state center coordinates (simplified for demonstration)
function getStateCenter(state: string): { lat: number; lng: number } {
  const stateCenters: Record<string, { lat: number; lng: number }> = {
    'AL': { lat: 32.806671, lng: -86.791130 },
    'AK': { lat: 61.370716, lng: -152.404419 },
    'AZ': { lat: 33.729759, lng: -111.431221 },
    'AR': { lat: 34.969704, lng: -92.373123 },
    'CA': { lat: 36.116203, lng: -119.681564 },
    'CO': { lat: 39.059811, lng: -105.311104 },
    'CT': { lat: 41.597782, lng: -72.755371 },
    'DE': { lat: 39.318523, lng: -75.507141 },
    'FL': { lat: 27.766279, lng: -81.686783 },
    'GA': { lat: 33.040619, lng: -83.643074 },
    'HI': { lat: 21.094318, lng: -157.498337 },
    'ID': { lat: 44.240459, lng: -114.478828 },
    'IL': { lat: 40.349457, lng: -88.986137 },
    'IN': { lat: 39.849426, lng: -86.258278 },
    'IA': { lat: 41.878003, lng: -93.097702 },
    'KS': { lat: 38.526600, lng: -96.726486 },
    'KY': { lat: 37.839333, lng: -84.270019 },
    'LA': { lat: 30.984303, lng: -91.962339 },
    'ME': { lat: 45.253783, lng: -69.445469 },
    'MD': { lat: 39.045753, lng: -76.641273 },
    'MA': { lat: 42.230171, lng: -71.530100 },
    'MI': { lat: 43.326618, lng: -84.536090 },
    'MN': { lat: 46.392410, lng: -94.636230 },
    'MS': { lat: 32.741646, lng: -89.678691 },
    'MO': { lat: 38.462305, lng: -92.302005 },
    'MT': { lat: 46.921925, lng: -112.454357 },
    'NE': { lat: 41.125370, lng: -98.268083 },
    'NV': { lat: 38.313515, lng: -117.055373 },
    'NH': { lat: 43.452492, lng: -71.563895 },
    'NJ': { lat: 40.298904, lng: -74.521010 },
    'NM': { lat: 34.840515, lng: -106.248485 },
    'NY': { lat: 42.165726, lng: -74.948051 },
    'NC': { lat: 35.759573, lng: -79.019300 },
    'ND': { lat: 47.551493, lng: -101.002012 },
    'OH': { lat: 40.388783, lng: -82.764914 },
    'OK': { lat: 35.565346, lng: -96.928910 },
    'OR': { lat: 44.572021, lng: -122.070935 },
    'PA': { lat: 40.590752, lng: -77.209750 },
    'RI': { lat: 41.680893, lng: -71.511787 },
    'SC': { lat: 33.856892, lng: -80.945000 },
    'SD': { lat: 44.299798, lng: -99.438828 },
    'TN': { lat: 35.747841, lng: -86.692345 },
    'TX': { lat: 31.054487, lng: -97.563461 },
    'UT': { lat: 40.150032, lng: -111.862434 },
    'VT': { lat: 44.045876, lng: -72.710680 },
    'VA': { lat: 37.769337, lng: -78.169968 },
    'WA': { lat: 47.400902, lng: -121.490494 },
    'WV': { lat: 38.491220, lng: -80.954458 },
    'WI': { lat: 43.784147, lng: -88.787868 },
    'WY': { lat: 42.755966, lng: -107.302490 },
    'DC': { lat: 38.9072, lng: -77.0369 } // Washington D.C.
  };
  return stateCenters[state] || { lat: 39.8283, lng: -98.5795 }; // Default to US center
}

export function TerritoryMap({ territories, selectedState, onTerritoryClick }: TerritoryMapProps) {
  const initialCenter = useMemo(() => {
    if (selectedState) {
      const stateCenter = getStateCenter(selectedState)
      return [stateCenter.lat, stateCenter.lng] as [number, number]
    }
    return [39.8283, -98.5795] as [number, number] // Center of US
  }, [selectedState])

  const initialZoom = selectedState ? 6 : 4

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-100 rounded-lg">
        <div className="text-slate-500">Loading map...</div>
      </div>
    )
  }

  return (
    <MapContainer 
      center={initialCenter} 
      zoom={initialZoom} 
      scrollWheelZoom={true} 
      className="h-full w-full"
      style={{ height: '100%', width: '100%', zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController selectedState={selectedState} territories={territories} />
      {territories.filter(t => !(t as any).is_dma).map(territory => {
        const center = getTerritoryApproxCenter(territory)
        if (!center) return null

        let markerColor = ''
        let iconHtml = ''
        if (territory.status === 'available') {
          markerColor = 'bg-emerald-500'
          iconHtml = `<div class="w-4 h-4 rounded-full ${markerColor} border-2 border-white shadow-md"></div>`
        } else if (territory.status === 'taken') {
          markerColor = 'bg-red-500'
          iconHtml = `<div class="w-4 h-4 rounded-full ${markerColor} border-2 border-white shadow-md flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>`
        } else { // held
          markerColor = 'bg-amber-500'
          iconHtml = `<div class="w-4 h-4 rounded-full ${markerColor} border-2 border-white shadow-md flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>`
        }

        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: iconHtml,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
          popupAnchor: [0, -12]
        });

        return (
          <Marker 
            key={territory.id} 
            position={[center.lat, center.lng]} 
            icon={customIcon}
            eventHandlers={{
              click: () => onTerritoryClick && onTerritoryClick(territory),
            }}
          >
            <Popup>
              <div className="font-semibold text-slate-900">{territory.name}</div>
              <div className="text-sm text-slate-600">
                {territory.metro_area || territory.state} • ~{territory.population_est.toLocaleString()} pop.
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {(territory as any).is_dma ? 'Full DMA Coverage' : `${territory.zip_codes?.length || 0} ZIP codes`}
              </div>
              <div className={`mt-2 px-2 py-0.5 rounded text-xs font-medium inline-flex items-center ${
                territory.status === 'available' ? 'bg-emerald-100 text-emerald-700' :
                territory.status === 'taken' ? 'bg-red-100 text-red-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                {territory.status === 'available' ? 'Available' :
                 territory.status === 'taken' ? 'Taken' : 'Held'}
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}

