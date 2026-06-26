import L from 'leaflet'

// Custom DivIcons avoid the well-known broken-marker-image problem with
// Leaflet under bundlers, and let us make the user vs fountain pins visually
// distinct (P0 requirement) with plain CSS/SVG.

export const fountainIcon = L.divIcon({
  className: 'isete-marker isete-marker--fountain',
  html: `<div class="isete-pin"><span class="isete-pin__drop">💧</span></div>`,
  iconSize: [32, 40],
  iconAnchor: [16, 38],
  popupAnchor: [0, -34],
})

export const userIcon = L.divIcon({
  className: 'isete-marker isete-marker--user',
  html: `<div class="isete-user-dot"></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
})
