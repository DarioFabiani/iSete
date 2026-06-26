import { useCallback, useEffect, useRef, useState } from 'react'

// Wraps the browser Geolocation API. Requests the user's position on mount
// and exposes a clear status so the UI can react (P0: ask on open, clear
// message if denied).
//
// status: 'unsupported' | 'prompt' | 'granted' | 'denied' | 'error'
export function useGeolocation() {
  const [position, setPosition] = useState(null) // { lat, lon, accuracy }
  const [status, setStatus] = useState('prompt')
  const [error, setError] = useState(null)
  const watchId = useRef(null)

  const handleSuccess = useCallback((pos) => {
    setPosition({
      lat: pos.coords.latitude,
      lon: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
    })
    setStatus('granted')
    setError(null)
  }, [])

  const handleError = useCallback((err) => {
    if (err.code === err.PERMISSION_DENIED) {
      setStatus('denied')
      setError('Permesso di geolocalizzazione negato.')
    } else if (err.code === err.POSITION_UNAVAILABLE) {
      setStatus('error')
      setError('Posizione non disponibile. Controlla il GPS o la connessione.')
    } else if (err.code === err.TIMEOUT) {
      setStatus('error')
      setError('Tempo scaduto nel recupero della posizione. Riprova.')
    } else {
      setStatus('error')
      setError('Errore nel recupero della posizione.')
    }
  }, [])

  const request = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('unsupported')
      setError('Il tuo browser non supporta la geolocalizzazione.')
      return
    }
    setStatus('prompt')
    // One quick fix to center fast, then keep watching for updates.
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000,
    })
    if (watchId.current == null) {
      watchId.current = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 30000 }
      )
    }
  }, [handleSuccess, handleError])

  useEffect(() => {
    request()
    return () => {
      if (watchId.current != null) {
        navigator.geolocation.clearWatch(watchId.current)
        watchId.current = null
      }
    }
  }, [request])

  return { position, status, error, request }
}
