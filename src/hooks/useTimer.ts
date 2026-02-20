import { useEffect, useRef, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { TimerSettings, TimerSession } from '../types'

const DEFAULT_SETTINGS: TimerSettings = {
  focusDuration: 20,
  breakDuration: 5,
}

const DEFAULT_SESSION: TimerSession = {
  mode: 'idle',
  timeRemaining: 0,
  isRunning: false,
  isPaused: false,
  startTime: null,
}

interface UseTimerReturn {
  session: TimerSession
  settings: TimerSettings
  sprouts: number
  start: () => void
  pause: () => void
  reset: () => void
  startBreak: () => void
  updateSettings: (settings: Partial<TimerSettings>) => void
  addSprout: () => void
}

/**
 * Core timer hook that manages the Pomodoro timer state and logic
 */
export function useTimer(
  onComplete?: (mode: 'focus' | 'break') => void
): UseTimerReturn {
  // Persistent state
  const [settings, setSettings] = useLocalStorage<TimerSettings>(
    'sprout-timer-settings',
    DEFAULT_SETTINGS
  )
  const [session, setSession] = useLocalStorage<TimerSession>(
    'sprout-timer-session',
    DEFAULT_SESSION
  )
  const [sprouts, setSprouts] = useLocalStorage<number>('sprout-timer-sprouts', 0)

  // Ref to store interval ID
  const intervalRef = useRef<number | null>(null)

  // Ref to store start timestamp for accuracy
  const startTimeRef = useRef<number | null>(null)
  const expectedTimeRef = useRef<number | null>(null)

  /**
   * Start the timer
   */
  const start = useCallback(() => {
    setSession((prev) => {
      const now = Date.now()

      // If idle, start a new focus session
      if (prev.mode === 'idle') {
        startTimeRef.current = now
        expectedTimeRef.current = settings.focusDuration * 60
        return {
          mode: 'focus',
          timeRemaining: settings.focusDuration * 60,
          isRunning: true,
          isPaused: false,
          startTime: now,
        }
      }

      // If paused, resume
      if (prev.isPaused) {
        startTimeRef.current = now
        expectedTimeRef.current = prev.timeRemaining
        return {
          ...prev,
          isRunning: true,
          isPaused: false,
          startTime: now,
        }
      }

      return prev
    })
  }, [settings.focusDuration])

  /**
   * Pause the timer
   */
  const pause = useCallback(() => {
    setSession((prev) => ({
      ...prev,
      isRunning: false,
      isPaused: true,
      startTime: null,
    }))
    startTimeRef.current = null
    expectedTimeRef.current = null
  }, [])

  /**
   * Reset the timer to idle state
   */
  const reset = useCallback(() => {
    setSession(DEFAULT_SESSION)
    startTimeRef.current = null
    expectedTimeRef.current = null
  }, [])

  /**
   * Start a break timer
   */
  const startBreak = useCallback(() => {
    const now = Date.now()
    startTimeRef.current = now
    expectedTimeRef.current = settings.breakDuration * 60
    setSession({
      mode: 'break',
      timeRemaining: settings.breakDuration * 60,
      isRunning: true,
      isPaused: false,
      startTime: now,
    })
  }, [settings.breakDuration])

  /**
   * Update timer settings
   */
  const updateSettings = useCallback(
    (newSettings: Partial<TimerSettings>) => {
      setSettings((prev) => ({
        ...prev,
        ...newSettings,
      }))
    },
    []
  )

  /**
   * Add a sprout (completed focus session)
   */
  const addSprout = useCallback(() => {
    setSprouts((prev) => prev + 1)
  }, [])

  /**
   * Timer countdown effect
   */
  useEffect(() => {
    if (!session.isRunning) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    // Use more accurate timing by tracking elapsed time
    intervalRef.current = window.setInterval(() => {
      if (startTimeRef.current === null || expectedTimeRef.current === null) {
        return
      }

      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      const remaining = Math.max(0, expectedTimeRef.current - elapsed)

      if (remaining <= 0) {
        // Timer completed
        const completedMode = session.mode

        setSession({
          mode: 'idle',
          timeRemaining: 0,
          isRunning: false,
          isPaused: false,
          startTime: null,
        })

        startTimeRef.current = null
        expectedTimeRef.current = null

        // Call completion callback
        if (onComplete && (completedMode === 'focus' || completedMode === 'break')) {
          onComplete(completedMode)
        }
      } else {
        // Update time remaining
        setSession((prev) => ({
          ...prev,
          timeRemaining: remaining,
        }))
      }
    }, 1000)

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [session.isRunning, session.mode, onComplete])

  /**
   * Initialize refs from persisted state on mount or after tab resume
   */
  useEffect(() => {
    if (session.isRunning && session.startTime && !startTimeRef.current) {
      // Timer is running but refs are not initialized (e.g., after page reload or tab resume)
      const now = Date.now()

      // Calculate original expected duration from settings based on mode
      const originalDuration = session.mode === 'focus'
        ? settings.focusDuration * 60
        : settings.breakDuration * 60

      const elapsed = Math.floor((now - session.startTime) / 1000)
      const remaining = Math.max(0, originalDuration - elapsed)

      if (remaining <= 0) {
        // Timer should have completed while tab was suspended
        const completedMode = session.mode

        setSession({
          mode: 'idle',
          timeRemaining: 0,
          isRunning: false,
          isPaused: false,
          startTime: null,
        })

        // Trigger completion callback
        if (onComplete && (completedMode === 'focus' || completedMode === 'break')) {
          onComplete(completedMode)
        }
      } else {
        // Timer still running, recalculate refs
        startTimeRef.current = session.startTime
        expectedTimeRef.current = originalDuration

        // Update display with correct remaining time
        setSession((prev) => ({
          ...prev,
          timeRemaining: remaining,
        }))
      }
    }
  }, [session.isRunning, session.startTime, session.mode, settings.focusDuration, settings.breakDuration, onComplete])

  /**
   * Handle tab visibility changes (laptop sleep, tab backgrounding)
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && session.isRunning && session.startTime) {
        // Tab became visible and timer is running
        const now = Date.now()
        const totalElapsed = Math.floor((now - session.startTime) / 1000)
        const remaining = Math.max(0, expectedTimeRef.current! - totalElapsed)

        if (remaining <= 0) {
          // Timer completed while tab was hidden
          const completedMode = session.mode

          setSession({
            mode: 'idle',
            timeRemaining: 0,
            isRunning: false,
            isPaused: false,
            startTime: null,
          })

          startTimeRef.current = null
          expectedTimeRef.current = null

          // Trigger completion callback
          if (onComplete && (completedMode === 'focus' || completedMode === 'break')) {
            onComplete(completedMode)
          }
        } else {
          // Update remaining time based on actual elapsed time
          setSession((prev) => ({
            ...prev,
            timeRemaining: remaining,
          }))
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [session.isRunning, session.startTime, session.mode, onComplete])

  return {
    session,
    settings,
    sprouts,
    start,
    pause,
    reset,
    startBreak,
    updateSettings,
    addSprout,
  }
}
