import { Marker, Popup } from 'react-leaflet'
import { fountainIcon } from '../lib/mapIcons'
import { fountainName, osmNodeUrl } from '../lib/overpass'
import { formatDistance } from '../lib/distance'

// A row in the popup's tag table, only rendered when the tag exists.
function TagRow({ label, value }) {
  if (!value) return null
  return (
    <div className="popup__row">
      <span className="popup__label">{label}</span>
      <span className="popup__value">{value}</span>
    </div>
  )
}

const FEE_LABELS = { no: 'Gratuita', yes: 'A pagamento' }
const ACCESS_LABELS = {
  yes: 'Pubblico',
  public: 'Pubblico',
  permissive: 'Consentito',
  customers: 'Solo clienti',
}

export default function FountainMarker({ fountain }) {
  const t = fountain.tags || {}
  return (
    <Marker position={[fountain.lat, fountain.lon]} icon={fountainIcon}>
      <Popup>
        <div className="popup">
          <h3 className="popup__title">{fountainName(fountain)}</h3>
          {fountain.distance != null && (
            <div className="popup__distance">
              A {formatDistance(fountain.distance)} da te
            </div>
          )}
          <div className="popup__tags">
            <TagRow label="Accesso" value={ACCESS_LABELS[t.access] || t.access} />
            <TagRow label="Costo" value={FEE_LABELS[t.fee] || t.fee} />
            <TagRow label="Descrizione" value={t.description} />
            <TagRow label="Nota" value={t.note} />
          </div>
          <a
            className="popup__link"
            href={osmNodeUrl(fountain)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Vedi su OpenStreetMap →
          </a>
        </div>
      </Popup>
    </Marker>
  )
}
