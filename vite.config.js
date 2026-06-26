import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// The repo is served from https://dariofabiani.github.io/isete/, so the app
// lives under the "/isete/" base path. start_url/scope below must match.
const BASE = '/isete/'

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'iSete — Mappa di fontanelle',
        short_name: 'iSete',
        description: 'Trova la fontanella pubblica più vicina a te.',
        lang: 'it',
        start_url: BASE,
        scope: BASE,
        display: 'standalone',
        background_color: '#e3f2fd',
        theme_color: '#0288d1',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Cache the app shell + assets so the PWA loads offline.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        runtimeCaching: [
          {
            // OpenStreetMap raster tiles — cache-first so the map renders offline.
            urlPattern: /^https:\/\/[a-c]\.tile\.openstreetmap\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'osm-tiles',
              expiration: {
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Overpass API responses — network-first, fall back to last result offline.
            urlPattern: /^https:\/\/overpass-api\.de\/api\/interpreter.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'overpass-api',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
})
