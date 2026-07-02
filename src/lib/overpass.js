// Data layer for public drinking fountains (OSM `amenity=drinking_water`)
// via the public Overpass API. No API key required.

const OVERPASS_ENDPOINT = 'https://overpass-api.de/api/interpreter'

// Build an Overpass QL query for drinking-water nodes within `radius` meters
// of (lat, lon). We exclude `access=private` to keep only public fountains
// (PRD implementation note).
export function buildQuery(lat, lon, radius) {
  return `[out:json][timeout:25];
node["amenity"="drinking_water"]["access"!="private"](around:${radius},${lat},${lon});
out body;`
}

// Normalize an Overpass element into the shape the UI expects.
function toFountain(el) {
  return {
    id: el.id,
    lat: el.lat,
    lon: el.lon,
    tags: el.tags || {},
  }
}

// Fetch fountains around a point. Throws an Error with a readable, Italian
// message on any failure so the UI can show it instead of crashing silently
// (P0 acceptance criterion).
export async function fetchFountains(lat, lon, radius, { signal } = {}) {
  const body = buildQuery(lat, lon, radius)

  let res
  try {
    res = await fetch(OVERPASS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body,
      signal,
    })
  } catch (err) {
    if (err && err.name === 'AbortError') throw err
    throw new Error(
      'Impossibile contattare il servizio dati. Controlla la connessione e riprova.'
    )
  }

  if (res.status === 429 || res.status === 504) {
    throw new Error(
      'Il servizio dati è momentaneamente sovraccarico. Riprova tra qualche istante.'
    )
  }
  if (!res.ok) {
    throw new Error('Errore nel caricamento delle fontanelle. Riprova più tardi.')
  }

  let data
  try {
    data = await res.json()
  } catch {
    throw new Error('Risposta dati non valida. Riprova più tardi.')
  }

  const elements = Array.isArray(data.elements) ? data.elements : []
  return elements
    .filter((el) => el.type === 'node' && el.lat != null && el.lon != null)
    .map(toFountain)
}

// Best-effort display name for a fountain from its OSM tags.
export function fountainName(fountain) {
  const t = fountain.tags || {}
  return (
    t.name ||
    t.description ||
    t['addr:street'] ||
    'Fontanella pubblica'
  )
}

// Direct link to the OSM node so contributors can edit the data.
export function osmNodeUrl(fountain) {
  return `https://www.openstreetmap.org/node/${fountain.id}`
}
