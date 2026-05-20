// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

// updatefor app

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // ফাইল সাইজ লিমিট বাড়িয়ে ৫ এমবি (৫ * ১০২৪ * ১০২৪) করে দেওয়া হলো
        maximumFileSizeToCacheInBytes: 5242880, 
      },
      manifest: {
        name: 'TrainKoi - Bangladesh Train Tracker',
        short_name: 'TrainKoi',
        description: 'Real-time train tracking and schedule for Bangladesh Railway',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'logo192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'logo512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  build: {
    // বড় ফাইলগুলোকে ছোট করার জন্য নিচের সেটিংসটি যোগ করুন
    chunkSizeWarningLimit: 2000,
  }
})