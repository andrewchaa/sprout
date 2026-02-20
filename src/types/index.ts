/**
 * Example data types
 */

export interface ExampleItem {
  id: number
  title: string
  description: string
  completed: boolean
  createdAt?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface ApiError {
  message: string
  code?: string
  details?: unknown
}

/**
 * Pomodoro Timer Types
 */

export interface TimerSettings {
  focusDuration: number    // in minutes
  breakDuration: number    // in minutes
}

export interface TimerSession {
  mode: 'focus' | 'break' | 'idle'
  timeRemaining: number    // in seconds
  isRunning: boolean
  isPaused: boolean
}

export interface TimerState {
  settings: TimerSettings
  session: TimerSession
  sprouts: number          // count of completed focus sessions
}
