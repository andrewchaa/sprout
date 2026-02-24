import { useState, useEffect } from 'react'

/**
 * Custom hook for managing Service Worker notifications
 * Uses Service Worker API for better reliability when device is locked (Android)
 */
export function useNotification() {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  )
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  // Get Service Worker registration
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg)
      }).catch((error) => {
        console.warn('Service Worker not ready:', error)
      })
    }
  }, [])

  // Update permission state when it changes
  useEffect(() => {
    if (typeof Notification === 'undefined') {
      return
    }

    setPermission(Notification.permission)
  }, [])

  /**
   * Request permission to show notifications
   */
  const requestPermission = async (): Promise<void> => {
    if (typeof Notification === 'undefined') {
      console.warn('Notifications are not supported in this browser')
      return
    }

    if (Notification.permission === 'granted') {
      return
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
    } catch (error) {
      console.warn('Failed to request notification permission:', error)
    }
  }

  /**
   * Show a notification using Service Worker API for better reliability
   * Falls back to basic notifications if Service Worker is unavailable
   */
  const showNotification = (title: string, options?: NotificationOptions): void => {
    if (typeof Notification === 'undefined') {
      console.warn('Notifications are not supported in this browser')
      return
    }

    if (Notification.permission !== 'granted') {
      console.warn('Notification permission not granted')
      return
    }

    try {
      // Use Service Worker notification (better for background/locked devices)
      if (registration) {
        registration.showNotification(title, {
          icon: '/sprout/icons/icon-192x192.png',
          badge: '/sprout/icons/icon-192x192.png',
          vibrate: [200, 100, 200] as VibratePattern, // Vibration pattern for mobile
          requireInteraction: false, // Auto-dismiss after some time
          ...options,
        } as NotificationOptions)
      } else {
        // Fallback to basic notification if Service Worker not available
        const notification = new Notification(title, {
          icon: '/sprout/icons/icon-192x192.png',
          badge: '/sprout/icons/icon-192x192.png',
          ...options,
        })

        // Auto-close notification after 5 seconds
        setTimeout(() => notification.close(), 5000)
      }
    } catch (error) {
      console.warn('Failed to show notification:', error)
    }
  }

  return {
    permission,
    requestPermission,
    showNotification,
  }
}
