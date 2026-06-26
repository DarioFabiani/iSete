// Compact status line under the controls: loading spinner, error message,
// offline ("dati offline") badge, or the empty-result message (PRD open
// question #2 — be explicit rather than show a silently empty map).
export default function StatusBar({ loading, error, fromCache, count, loaded }) {
  if (loading) {
    return (
      <div className="status status--loading">
        <span className="spinner" aria-hidden="true" />
        <span>Cerco fontanelle…</span>
      </div>
    )
  }

  if (error && !fromCache) {
    return <div className="status status--error">⚠️ {error}</div>
  }

  if (fromCache) {
    return (
      <div className="status status--offline">
        📴 Dati offline — mostro le ultime fontanelle salvate.
      </div>
    )
  }

  if (loaded && count === 0) {
    return (
      <div className="status status--empty">
        Nessuna fontanella trovata in questo raggio. Prova ad allargare la ricerca.
      </div>
    )
  }

  if (loaded && count > 0) {
    return (
      <div className="status status--ok">
        {count} {count === 1 ? 'fontanella' : 'fontanelle'} qui intorno.
      </div>
    )
  }

  return null
}
