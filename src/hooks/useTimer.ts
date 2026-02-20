import { useState, useEffect, useRef, useCallback } from 'react'
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
      // If idle, start a new focus session
      if (prev.mode === 'idle') {
        startTimeRef.current = Date.now()
        expectedTimeRef.current = settings.focusDuration * 60
        return {
          mode: 'focus',
          timeRemaining: settings.focusDuration * 60,
          isRunning: true,
          isPaused: false,
        }
      }

      // If paused, resume
      if (prev.isPaused) {
        startTimeRef.current = Date.now()
        expectedTimeRef.current = prev.timeRemaining
        return {
          ...prev,
          isRunning: true,
          isPaused: false,
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
    startTimeRef.current = Date.now()
    expectedTimeRef.current = settings.breakDuration * 60
    setSession({
      mode: 'break',
      timeRemaining: settings.breakDuration * 60,
      isRunning: true,
      isPaused: false,
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
