import { useCallback, useEffect, useRef, useState } from 'react'
import MapView from './components/MapView'
import FountainList from './components/FountainList'
import RadiusSelector from './components/RadiusSelector'
import StatusBar from './components/StatusBar'
import PermissionGate from './components/PermissionGate'
import { useGeolocation } from './hooks/useGeolocation'
import { useFountains } from './hooks/useFountains'

// Fallback center when the user browses without GPS (Roma centro).
const DEFAULT_CENTER = { lat: 41.9028, lon: 12.4964 }

export default function App() {
  const { position, status, error: geoError, request } = useGeolocation()
  const { fountains, loading, error, fromCache, loaded, queryAround } =
    useFountains()

  const [radius, setRadius] = useState(1000)
  const [browseMode, setBrowseMode] = useState(false)
  const [flyTarget, setFlyTarget] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const mapCenterRef = useRef(null)
  const startedRef = useRef(false)
  const centeredRef = useRef(false)

  // The center used for the map's very first render.
  const initialCenter = position || (browseMode ? DEFAULT_CENTER : null)

  // First query, once we have any center to search around.
  useEffect(() => {
    if (!initialCenter || startedRef.current) return
    startedRef.current = true
    mapCenterRef.current = initialCenter
    queryAround(initialCenter, radius, { immediate: true })
  }, [initialCenter, radius, queryAround])

  // Center on the user exactly once (avoid yanking the map on GPS jitter).
  useEffect(() => {
    if (position && !centeredRef.current) {
      centeredRef.current = true
      setFlyTarget({ lat: position.lat, lon: position.lon, zoom: 16 })
    }
  }, [position])

  const handleMoveEnd = useCallback(
    (center) => {
      mapCenterRef.current = center
      queryAround(center, radius)
    },
    [queryAround, radius]
  )

  const handleRadiusChange = useCallback(
    (r) => {
      setRadius(r)
      const c = mapCenterRef.current
      if (c) queryAround(c, r, { immediate: true })
    },
    [queryAround]
  )

  const handleSelect = useCallback((f) => {
    setSelectedId(f.id)
    setFlyTarget({ lat: f.lat, lon: f.lon, zoom: 18 })
  }, [])

  const handleBrowse = useCallback(() => setBrowseMode(true), [])

  // --- Render states -------------------------------------------------------

  const blocked =
    !position &&
    !browseMode &&
    (status === 'denied' || status === 'unsupported' || status === 'error')

  if (blocked) {
    return (
      <div className="app">
        <Header radius={radius} onRadiusChange={handleRadiusChange} hideControls />
        <PermissionGate
          status={status}
          error={geoError}
          onRetry={request}
          onBrowse={handleBrowse}
        />
      </div>
    )
  }

  if (!initialCenter) {
    return (
      <div className="app">
        <Header radius={radius} onRadiusChange={handleRadiusChange} hideControls />
        <div className="splash">
          <span className="spinner spinner--lg" aria-hidden="true" />
          <p>Recupero la tua posizione…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <Header radius={radius} onRadiusChange={handleRadiusChange} />
      <StatusBar
        loading={loading}
        error={error}
        fromCache={fromCache}
        count={fountains.length}
        loaded={loaded}
      />
      <div className="content">
        <div className="map-wrap">
          <MapView
            initialCenter={initialCenter}
            flyTarget={flyTarget}
            userPosition={position}
            fountains={fountains}
            onMoveEnd={handleMoveEnd}
          />
        </div>
        <aside className="panel">
          <FountainList
            fountains={fountains}
            onSelect={handleSelect}
            selectedId={selectedId}
          />
        </aside>
      </div>
    </div>
  )
}

function Header({ radius, onRadiusChange, hideControls }) {
  return (
    <header className="header">
      <div className="brand">
        <span className="brand__drop">💧</span>
        <span className="brand__name">iSete</span>
      </div>
      {!hideControls && (
        <RadiusSelector radius={radius} onChange={onRadiusChange} />
      )}
    </header>
  )
}
