# iSete 💧

Mappa di fontanelle pubbliche — trova la fontanella più vicina a te.

iSete è una PWA (Progressive Web App) che mostra le fontanelle pubbliche
(`amenity=drinking_water` da OpenStreetMap) intorno alla tua posizione, su una
mappa interattiva e in una lista ordinata per distanza. Niente account, niente
App Store: si apre nel browser e si può installare nella home screen.

## Funzionalità

- 📍 **Geolocalizzazione automatica** all'apertura, con messaggio chiaro se il
  permesso è negato
- 🗺️ **Mappa interattiva** (Leaflet + tile OpenStreetMap) con pin delle
  fontanelle e pin distinto della tua posizione
- 📋 **Lista ordinata per distanza** — tap su una voce per centrare la mappa
- 🔎 **Raggio configurabile** (500 m / 1 km / 2 km / 5 km)
- 💧 **Dettaglio fontanella** con tag OSM (`access`, `fee`, `description`,
  `note`) e link diretto al nodo OSM
- 📴 **Funziona offline** (PWA): tile e ultimi risultati in cache, con
  indicatore "dati offline"
- 📲 **Installabile** nella home screen

## Stack

React + Vite · Leaflet (react-leaflet) · Overpass API · vite-plugin-pwa
(Workbox) · GitHub Pages.

## Sviluppo

```bash
npm install
npm run dev      # http://localhost:5173/isete/
```

Build e anteprima di produzione (necessaria per testare il service worker):

```bash
npm run build
npm run preview
```

## Deploy

Il push su `main` (o sul branch di sviluppo) attiva il workflow
`.github/workflows/deploy.yml` che builda e pubblica su GitHub Pages.

**Configurazione una tantum:** nelle impostazioni del repository → *Pages*,
imposta *Source* su **GitHub Actions**. L'app sarà raggiungibile su
`https://dariofabiani.github.io/isete/`.

> L'app è servita sotto il path `/isete/`: vedi `base` in `vite.config.js`.

## Dati

I dati provengono in tempo reale dalla [Overpass API](https://overpass-api.de/)
e da [OpenStreetMap](https://www.openstreetmap.org/) (© contributori OSM). Per
correggere o aggiungere una fontanella, usa il link "Vedi su OpenStreetMap" nel
dettaglio di ogni pin.
