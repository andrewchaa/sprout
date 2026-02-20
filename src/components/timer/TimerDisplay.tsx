interface TimerDisplayProps {
  timeRemaining: number  // seconds
  mode: 'focus' | 'break' | 'idle'
  totalTime?: number     // for progress calculation (optional)
}

/**
 * Format seconds as MM:SS
 */
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Large timer display showing the current time remaining
 */
export function TimerDisplay({ timeRemaining, mode }: TimerDisplayProps) {
  const modeConfig = {
    focus: {
      label: 'Focus Time',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    break: {
      label: 'Break Time',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    idle: {
      label: 'Ready',
      color: 'text-slate-600',
      bgColor: 'bg-slate-50',
    },
  }

  const config = modeConfig[mode]

  return (
    <div className={`flex flex-col items-center justify-center py-12 ${config.bgColor} rounded-lg transition-colors duration-300`}>
      <div className={`text-sm font-medium mb-4 ${config.color} uppercase tracking-wide`}>
        {config.label}
      </div>
      <div className={`text-8xl font-bold timer-display ${config.color} transition-colors duration-300`}>
        {formatTime(timeRemaining)}
      </div>
    </div>
  )
}
