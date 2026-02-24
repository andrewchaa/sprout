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
    <div className="space-y-6">
      {/* Header */}
      <div className="relative text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Sprout Pomodoro</h1>
        <p className="text-slate-600">Grow your focus, one session at a time</p>

        {/* Settings Toggle Button */}
        <button
          onClick={toggleSettings}
          className="absolute top-0 right-0 text-2xl hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-lg p-2"
          aria-label={showSettings ? 'Hide settings' : 'Show settings'}
          title={showSettings ? 'Hide settings' : 'Show settings'}
        >
          ⚙️
        </button>
      </div>

      {/* Timer Settings - Collapsible */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          showSettings ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <TimerSettings
          settings={settings}
          onUpdate={updateSettings}
          disabled={isSettingsDisabled}
        />
      </div>

      {/* Timer Display */}
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

      {/* Timer Controls */}
      <TimerControls
        isRunning={session.isRunning}
        isPaused={session.isPaused}
        mode={session.mode}
        onStart={start}
        onPause={pause}
        onReset={reset}
        onStartBreak={startBreak}
      />

      {/* Sprout Garden */}
      <SproutGarden sprouts={sprouts} animated={sproutJustAdded.current} />

      {/* Notification Permission Hint */}
      {permission === 'denied' && (
        <div className="text-center text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
          Notifications are blocked. Enable them in your browser settings for completion alerts.
        </div>
      )}
    </div>
  )
}
