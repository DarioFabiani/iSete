// Shown when GPS is denied/unsupported. Gives a clear message + how to
// re-enable, and lets the user continue browsing the map manually
// (falls back to a default city center).
export default function PermissionGate({ status, error, onRetry, onBrowse }) {
  const denied = status === 'denied'
  const unsupported = status === 'unsupported'

  return (
    <div className="gate">
      <div className="gate__card">
        <div className="gate__icon">📍</div>
        <h2 className="gate__title">
          {unsupported
            ? 'Geolocalizzazione non disponibile'
            : 'Serve la tua posizione'}
        </h2>
        <p className="gate__text">
          {error ||
            'iSete usa la tua posizione per mostrarti le fontanelle più vicine.'}
        </p>

        {denied && (
          <p className="gate__hint">
            Hai negato il permesso. Per abilitarlo: tocca l'icona del lucchetto
            (o le info del sito) nella barra del browser → <em>Posizione</em> →{' '}
            <em>Consenti</em>, poi ricarica.
          </p>
        )}

        <div className="gate__actions">
          {!unsupported && (
            <button type="button" className="btn btn--primary" onClick={onRetry}>
              Riprova
            </button>
          )}
          <button type="button" className="btn" onClick={onBrowse}>
            Esplora la mappa
          </button>
        </div>
      </div>
    </div>
  )
}
