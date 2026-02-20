import { FC, useState } from 'react'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import { Button } from './ui/Button'

export const InstallPrompt: FC = () => {
  const { isInstallable, isInstalled, promptInstall } = useInstallPrompt()
  const [isDismissed, setIsDismissed] = useState(false)

  if (isInstalled || isDismissed || !isInstallable) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 left-4 md:left-auto md:w-96 bg-white rounded-lg shadow-2xl p-4 border-2 border-emerald-500 z-40 animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
          <svg
            className="w-6 h-6 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">Install App</h3>
          <p className="text-sm text-gray-600 mb-3">
            Install this app on your device for quick and easy access.
          </p>
          <div className="flex gap-2">
            <Button onClick={promptInstall} size="sm">
              Install
            </Button>
            <Button
              onClick={() => setIsDismissed(true)}
              variant="outline"
              size="sm"
            >
              Not now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
