import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'Quotes PWA',
        short_name: 'Quotes',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#0ea5e9',
        theme_color: '#0ea5e9',
        description: 'Prosta PWA z cytatami (DummyJSON) w Vue.',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{html,js,css,svg,png,ico}']
      }
    })
  ]
})
