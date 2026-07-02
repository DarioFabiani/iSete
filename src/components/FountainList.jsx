import { fountainName } from '../lib/overpass'
import { formatDistance } from '../lib/distance'

// Distance-sorted list, kept in sync with the map pins. Tapping a row asks the
// parent to center the map on that fountain (P0 acceptance criterion).
export default function FountainList({ fountains, onSelect, selectedId }) {
  if (!fountains.length) return null

  return (
    <ul className="list" role="list">
      {fountains.map((f) => (
        <li key={f.id}>
          <button
            type="button"
            className={`list__item${selectedId === f.id ? ' list__item--active' : ''}`}
            onClick={() => onSelect(f)}
          >
            <span className="list__name">{fountainName(f)}</span>
            {f.distance != null && (
              <span className="list__distance">{formatDistance(f.distance)}</span>
            )}
          </button>
        </li>
      ))}
    </ul>
  )
}
