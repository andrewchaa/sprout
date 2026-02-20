import { useState, useEffect } from 'react'

/**
 * Custom hook for managing browser notifications
 */
export function useNotification() {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  )

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
   * Show a notification with the given title and options
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
      const notification = new Notification(title, {
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        ...options,
      })

      // Auto-close notification after 5 seconds
      setTimeout(() => notification.close(), 5000)
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
