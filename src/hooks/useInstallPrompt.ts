import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface InstallPromptState {
  promptEvent: BeforeInstallPromptEvent | null
  isInstalled: boolean
  isInstallable: boolean
  promptInstall: () => Promise<void>
}

/**
 * Hook to manage PWA installation prompt
 * @returns Object with install prompt state and trigger function
 */
export function useInstallPrompt(): InstallPromptState {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setPromptEvent(e as BeforeInstallPromptEvent)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setPromptEvent(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const promptInstall = async () => {
    if (!promptEvent) {
      return
    }

    try {
      await promptEvent.prompt()
      const { outcome } = await promptEvent.userChoice

      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }

      setPromptEvent(null)
    } catch (error) {
      console.error('Error showing install prompt:', error)
    }
  }

  return {
    promptEvent,
    isInstalled,
    isInstallable: !!promptEvent && !isInstalled,
    promptInstall,
  }
}
