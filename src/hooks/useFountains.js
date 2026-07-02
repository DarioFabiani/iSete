import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchFountains } from '../lib/overpass'
import { haversine } from '../lib/distance'
import { debounce } from '../lib/debounce'

const CACHE_KEY = 'isete:lastFountains'

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.fountains)) return null
    return parsed
  } catch {
    return null
  }
}

function saveCache(payload) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
  } catch {
    // Storage full or unavailable — non-fatal.
  }
}

// Sort fountains by distance from a center point, annotating each with `distance`.
function withDistances(fountains, center) {
  return fountains
    .map((f) => ({
      ...f,
      distance: center ? haversine(center.lat, center.lon, f.lat, f.lon) : null,
    }))
    .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
}

// Fetches fountains around a center, debounced so map panning doesn't hammer
// Overpass (PRD note: >=500ms debounce). Persists last good result to
// localStorage so offline sessions can still show something (`fromCache`).
export function useFountains() {
  const [fountains, setFountains] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fromCache, setFromCache] = useState(false)
  const [loaded, setLoaded] = useState(false) // at least one query completed
  const abortRef = useRef(null)

  const runQuery = useCallback(async (center, radius) => {
    if (!center) return
    // Cancel any in-flight request.
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)
    try {
      const result = await fetchFountains(center.lat, center.lon, radius, {
        signal: controller.signal,
      })
      const sorted = withDistances(result, center)
      setFountains(sorted)
      setFromCache(false)
      setLoaded(true)
      saveCache({ fountains: result, center, radius, ts: Date.now() })
    } catch (err) {
      if (err && err.name === 'AbortError') return // superseded, ignore
      // Network failed — fall back to cached fountains if we have them.
      const cached = loadCache()
      if (cached && cached.fountains.length) {
        setFountains(withDistances(cached.fountains, center))
        setFromCache(true)
        setLoaded(true)
      }
      setError(err.message || 'Errore nel caricamento delle fontanelle.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Stable debounced wrapper around runQuery.
  const debouncedRef = useRef(null)
  if (!debouncedRef.current) {
    debouncedRef.current = debounce((center, radius) => runQuery(center, radius), 600)
  }

  const queryAround = useCallback((center, radius, { immediate = false } = {}) => {
    if (immediate) {
      debouncedRef.current.cancel()
      runQuery(center, radius)
    } else {
      debouncedRef.current(center, radius)
    }
  }, [runQuery])

  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort()
      if (debouncedRef.current) debouncedRef.current.cancel()
    }
  }, [])

  return { fountains, loading, error, fromCache, loaded, queryAround }
}
