import { useEffect, useCallback, useRef } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useTimer } from '../../hooks/useTimer'
import { useNotification } from '../../hooks/useNotification'
import { playDingSound, preloadSound } from '../../utils/sound'
import { TimerDisplay } from './TimerDisplay'
import { TimerControls } from './TimerControls'
import { TimerSettings } from './TimerSettings'
import { SproutGarden } from './SproutGarden'

/**
 * Main Pomodoro timer component
 * Orchestrates all timer functionality including sound, notifications, and state management
 */
export default function Timer() {
  const { permission, requestPermission, showNotification } = useNotification()
  const lastSproutCount = useRef<number>(0)
  const sproutJustAdded = useRef(false)
  const addSproutRef = useRef<(() => void) | null>(null)

  // Settings visibility state (persisted to localStorage)
  const [showSettings, setShowSettings] = useLocalStorage<boolean>(
    'sprout-timer-settings-visible',
    false  // Hidden by default
  )

  // Toggle function
  const toggleSettings = () => {
    setShowSettings(prev => !prev)
  }

  // Handle timer completion - will be passed to useTimer
  const handleComplete = useCallback(
    (mode: 'focus' | 'break') => {
      if (mode === 'focus') {
        // Add sprout for completed focus session
        if (addSproutRef.current) {
          addSproutRef.current()
        }

        // Play sound
        playDingSound().catch((error) => {
          console.warn('Failed to play completion sound:', error)
        })

        // Show notification
        showNotification('Focus Session Complete!', {
          body: 'Great work! You earned a sprout 🌱. Take a break?',
          tag: 'pomodoro-complete',
        })
      } else if (mode === 'break') {
        // Break completed
        // Play sound
        playDingSound().catch((error) => {
          console.warn('Failed to play completion sound:', error)
        })

        showNotification('Break Complete!', {
          body: 'Feeling refreshed? Start another focus session!',
          tag: 'break-complete',
        })
      }
    },
    [showNotification]
  )

  const {
    session,
    settings,
    sprouts,
    start,
    pause,
    reset,
    startBreak,
    updateSettings,
    addSprout,
  } = useTimer(handleComplete)

  // Store addSprout in ref so handleComplete can access it
  addSproutRef.current = addSprout

  // Preload sound on mount
  useEffect(() => {
    preloadSound()
  }, [])

  // Request notification permission on first timer start
  useEffect(() => {
    if (session.isRunning && permission === 'default') {
      requestPermission()
    }
  }, [session.isRunning, permission, requestPermission])

  // Track sprout count changes for animation
  useEffect(() => {
    if (sprouts > lastSproutCount.current) {
      sproutJustAdded.current = true
      lastSproutCount.current = sprouts
      setTimeout(() => {
        sproutJustAdded.current = false
      }, 500)
    }
  }, [sprouts])

  const isSettingsDisabled = session.isRunning || session.isPaused

  return (
    <div
      className="flex-1 relative overflow-hidden flex flex-col"
      style={{ background: 'linear-gradient(160deg, #f8e8c4 0%, #edda9e 55%, #e4cc88 100%)' }}
    >
      {/* Background scattered garden plants */}
      <SproutGarden sprouts={sprouts} animated={sproutJustAdded.current} />

      {/* Garden count badge — top right */}
      <div className="absolute top-3 right-3 z-10 bg-white/90 rounded-full px-3 py-1 shadow flex items-center gap-1.5 text-sm font-semibold text-slate-700 select-none">
        Your Garden: {sprouts} Sprouts 🌿
      </div>

      {/* Settings gear — top left */}
      <button
        onClick={toggleSettings}
        className="absolute top-2 left-3 z-20 text-xl opacity-50 hover:opacity-90 transition-opacity focus:outline-none rounded-lg p-1"
        aria-label={showSettings ? 'Hide settings' : 'Show settings'}
        title={showSettings ? 'Hide settings' : 'Show settings'}
      >
        ⚙️
      </button>

      {/* Settings panel overlay */}
      <div
        className={`absolute top-11 left-3 right-3 z-30 transition-all duration-300 ease-in-out ${
          showSettings ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <TimerSettings
          settings={settings}
          onUpdate={updateSettings}
          disabled={isSettingsDisabled}
        />
      </div>

      {/* Timer pot — vertically centered in remaining space */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <TimerDisplay
          timeRemaining={session.timeRemaining}
          mode={session.mode}
          totalTime={
            session.mode === 'focus'
              ? settings.focusDuration * 60
              : session.mode === 'break'
              ? settings.breakDuration * 60
              : 0
          }
        />
      </div>

      {/* Controls — pinned to bottom */}
      <div className="relative z-10 px-4 pb-4">
        <TimerControls
          isRunning={session.isRunning}
          isPaused={session.isPaused}
          mode={session.mode}
          onStart={start}
          onPause={pause}
          onReset={reset}
          onStartBreak={startBreak}
        />
      </div>

      {/* Notification hint */}
      {permission === 'denied' && (
        <div className="absolute bottom-20 left-4 right-4 z-10 text-center text-xs text-amber-700 bg-amber-50/90 p-2 rounded-lg">
          Notifications are blocked. Enable them in your browser settings.
        </div>
      )}
    </div>
  )
}
