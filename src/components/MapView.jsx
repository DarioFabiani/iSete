import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import FountainMarker from './FountainMarker'
import { userIcon } from '../lib/mapIcons'

// Imperatively recenters the map when the target coordinate changes (used both
// for the initial GPS center and when a list item is selected).
function Recenter({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.flyTo([center.lat, center.lon], zoom ?? map.getZoom(), { duration: 0.6 })
    }
  }, [center, zoom, map])
  return null
}

// Reports the map center after the user pans/zooms so we can re-query Overpass.
function MoveWatcher({ onMoveEnd }) {
  useMapEvents({
    moveend: (e) => {
      const c = e.target.getCenter()
      onMoveEnd({ lat: c.lat, lon: c.lng })
    },
  })
  return null
}

export default function MapView({
  initialCenter,
  flyTarget,
  userPosition,
  fountains,
  onMoveEnd,
}) {
  return (
    <MapContainer
      center={[initialCenter.lat, initialCenter.lon]}
      zoom={16}
      className="map"
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />

      {userPosition && (
        <Marker position={[userPosition.lat, userPosition.lon]} icon={userIcon} />
      )}

      {fountains.map((f) => (
        <FountainMarker key={f.id} fountain={f} />
      ))}

      <MoveWatcher onMoveEnd={onMoveEnd} />
      <Recenter center={flyTarget} zoom={flyTarget?.zoom} />
    </MapContainer>
  )
}
