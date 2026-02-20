import { Button } from '../ui/Button'

interface TimerControlsProps {
  isRunning: boolean
  isPaused: boolean
  mode: 'focus' | 'break' | 'idle'
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onStartBreak: () => void
}

/**
 * Timer control buttons (start, pause, reset, start break)
 */
export function TimerControls({
  isRunning,
  isPaused,
  mode,
  onStart,
  onPause,
  onReset,
  onStartBreak,
}: TimerControlsProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center items-center">
      {/* Start/Resume button - shown when idle or paused */}
      {(!isRunning || isPaused) && (
        <Button
          onClick={onStart}
          variant="primary"
          size="lg"
          className="min-w-32"
        >
          {isPaused ? 'Resume' : 'Start Focus'}
        </Button>
      )}

      {/* Pause button - shown when running */}
      {isRunning && !isPaused && (
        <Button
          onClick={onPause}
          variant="secondary"
          size="lg"
          className="min-w-32"
        >
          Pause
        </Button>
      )}

      {/* Reset button - shown when not idle */}
      {mode !== 'idle' && (
        <Button
          onClick={onReset}
          variant="outline"
          size="lg"
        >
          Reset
        </Button>
      )}

      {/* Start Break button - shown when idle (after completing focus) */}
      {mode === 'idle' && !isRunning && (
        <Button
          onClick={onStartBreak}
          variant="secondary"
          size="lg"
          className="min-w-32"
        >
          Start Break
        </Button>
      )}
    </div>
  )
}
