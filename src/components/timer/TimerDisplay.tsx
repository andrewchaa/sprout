interface TimerDisplayProps {
  timeRemaining: number  // seconds
  mode: 'focus' | 'break' | 'idle'
  totalTime?: number
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const RADIUS = 110
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function TimerDisplay({ timeRemaining, mode, totalTime = 0 }: TimerDisplayProps) {
  const modeConfig = {
    focus: {
      label: 'Focus',
      icon: '🌱',
      ringColor: '#059669',   // emerald-600
      trackColor: '#d1fae5',  // emerald-100
    },
    break: {
      label: 'Break',
      icon: '☕',
      ringColor: '#0ea5e9',   // sky-500
      trackColor: '#e0f2fe',  // sky-100
    },
    idle: {
      label: 'Ready',
      icon: '🌿',
      ringColor: '#94a3b8',   // slate-400
      trackColor: '#f1f5f9',  // slate-100
    },
  }

  const config = modeConfig[mode]
  const elapsed = totalTime > 0 ? totalTime - timeRemaining : 0
  const progress = totalTime > 0 ? elapsed / totalTime : 0
  const dashOffset = CIRCUMFERENCE * (1 - progress)

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="relative flex items-center justify-center">
        {/* SVG progress ring */}
        <svg
          width={260}
          height={260}
          style={{ transform: 'rotate(-90deg)' }}
          aria-hidden="true"
        >
          {/* Track */}
          <circle
            cx={130}
            cy={130}
            r={RADIUS}
            fill="none"
            stroke={config.trackColor}
            strokeWidth={12}
          />
          {/* Progress arc */}
          <circle
            cx={130}
            cy={130}
            r={RADIUS}
            fill="none"
            stroke={config.ringColor}
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute flex flex-col items-center gap-1">
          <div className="text-2xl">{config.icon}</div>
          <div
            className="text-7xl font-bold timer-display"
            style={{ color: config.ringColor, lineHeight: 1 }}
          >
            {formatTime(timeRemaining)}
          </div>
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mt-1">
            {config.label}
          </div>
        </div>
      </div>
    </div>
  )
}
