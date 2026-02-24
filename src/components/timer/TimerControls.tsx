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
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap gap-3 justify-center items-center w-full">
        {/* Start/Resume */}
        {(!isRunning || isPaused) && (
          <Button
            onClick={onStart}
            variant="primary"
            size="lg"
            className="flex-1 max-w-xs"
          >
            {isPaused ? '▶ Resume' : '▶ Focus'}
          </Button>
        )}

        {/* Pause */}
        {isRunning && !isPaused && (
          <Button
            onClick={onPause}
            variant="outline"
            size="lg"
            className="flex-1 max-w-xs"
          >
            ⏸ Pause
          </Button>
        )}

        {/* Start Break */}
        {mode === 'idle' && !isRunning && (
          <Button
            onClick={onStartBreak}
            variant="secondary"
            size="lg"
            className="flex-1 max-w-xs"
          >
            ☕ Break
          </Button>
        )}
      </div>

      {/* Reset as subtle text link */}
      {mode !== 'idle' && (
        <button
          onClick={onReset}
          className="text-sm text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors"
        >
          Reset
        </button>
      )}
    </div>
  )
}
