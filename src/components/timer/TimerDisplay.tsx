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

export function TimerDisplay({ timeRemaining, mode }: TimerDisplayProps) {
  const modeConfig = {
    focus: { label: 'FOCUS', plant: '🌱' },
    break: { label: 'BREAK', plant: '☕' },
    idle:  { label: 'READY', plant: '🌿' },
  }

  const config = modeConfig[mode]

  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: 170,
        height: 170,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 38% 36%, #5c2f0e, #2a1005)',
        border: '12px solid #c1692e',
        boxShadow: '0 0 0 4px #d4855a, 0 12px 32px rgba(0,0,0,0.35), inset 0 2px 8px rgba(0,0,0,0.4)',
        flexShrink: 0,
      }}
    >
      <div className="flex flex-col items-center">
        <div
          className="text-4xl font-bold text-white timer-display"
          style={{ lineHeight: 1, textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
        >
          {formatTime(timeRemaining)}
        </div>
        <div className="text-xs font-bold uppercase tracking-widest text-white/70 mt-1">
          {config.label}
        </div>
        <div className="text-2xl mt-2">{config.plant}</div>
      </div>
    </div>
  )
}
