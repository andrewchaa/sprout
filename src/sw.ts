/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'

declare let self: ServiceWorkerGlobalScope

// Take control of all pages immediately
self.skipWaiting()
clientsClaim()

// Clean up old caches
cleanupOutdatedCaches()

// Precache all assets
precacheAndRoute(self.__WB_MANIFEST)

// Handle notification clicks - open or focus the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  // Open or focus the Sprout app when notification is clicked
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If app is already open in a tab, focus it
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus().then(() => {})
        }
      }
      // Otherwise, open a new window/tab
      if (self.clients.openWindow) {
        return self.clients.openWindow('/sprout/').then(() => {})
      }
      return Promise.resolve()
    })
  )
})
