const OPTIONS = [
  { value: 500, label: '500 m' },
  { value: 1000, label: '1 km' },
  { value: 2000, label: '2 km' },
  { value: 5000, label: '5 km' },
]

// Lets the user widen the search radius — useful in rural areas where
// fountains are sparse (P1). Default is 1 km.
export default function RadiusSelector({ radius, onChange }) {
  return (
    <label className="radius">
      <span className="radius__label">Raggio</span>
      <select
        className="radius__select"
        value={radius}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}
