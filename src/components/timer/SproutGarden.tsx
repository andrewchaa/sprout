import { Card } from '../ui/Card'

interface SproutGardenProps {
  sprouts: number
  animated?: boolean
}

export function SproutGarden({ sprouts, animated = false }: SproutGardenProps) {
  const sproutElements = Array.from({ length: sprouts }, (_, index) => (
    <span
      key={index}
      className={`text-3xl ${animated && index === sprouts - 1 ? 'sprout-fade-in' : ''}`}
      role="img"
      aria-label="sprout"
    >
      🌱
    </span>
  ))

  const motivationText =
    sprouts === 0 ? null
    : sprouts === 1 ? 'Great start! Keep growing.'
    : sprouts < 5 ? 'Your garden is taking shape!'
    : sprouts < 10 ? 'Looking lush! Keep it up.'
    : sprouts < 20 ? "Impressive growth! You're on fire."
    : 'Amazing dedication! Your garden is thriving.'

  return (
    <Card className="p-5" style={{ backgroundColor: '#fffbeb' }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-slate-800">🌾 Your Garden</h2>
        <div className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
          🌱 × {sprouts}
        </div>
      </div>

      {sprouts === 0 ? (
        <div className="text-center py-10 text-slate-400">
          <div className="text-5xl mb-3">🌾</div>
          <div className="text-sm">Complete a focus session to grow your first sprout!</div>
        </div>
      ) : (
        <div
          className="flex flex-wrap gap-1.5 p-4 rounded-xl min-h-20"
          style={{ backgroundColor: '#fef3c7' }}
        >
          {sproutElements}
        </div>
      )}

      {motivationText && (
        <div className="mt-3 text-xs text-amber-700 text-center font-medium">
          {motivationText}
        </div>
      )}
    </Card>
  )
}
