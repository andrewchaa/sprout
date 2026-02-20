import { Card } from '../ui/Card'

interface SproutGardenProps {
  sprouts: number
  animated?: boolean
}

/**
 * Display the sprout garden - a visual representation of completed focus sessions
 */
export function SproutGarden({ sprouts, animated = false }: SproutGardenProps) {
  // Create array of sprout elements
  const sproutElements = Array.from({ length: sprouts }, (_, index) => (
    <span
      key={index}
      className={`text-4xl ${animated && index === sprouts - 1 ? 'sprout-fade-in' : ''}`}
      role="img"
      aria-label="sprout"
    >
      🌱
    </span>
  ))

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Your Sprout Garden</h2>
        <div className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
          🌱 × {sprouts}
        </div>
      </div>

      {sprouts === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <div className="text-4xl mb-2">🌾</div>
          <div className="text-sm">Complete a focus session to grow your first sprout!</div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-lg min-h-24">
          {sproutElements}
        </div>
      )}

      {sprouts > 0 && (
        <div className="mt-4 text-xs text-slate-500 text-center">
          {sprouts === 1
            ? 'Great start! Keep growing your garden.'
            : sprouts < 5
            ? 'Your garden is taking shape!'
            : sprouts < 10
            ? 'Looking lush! Keep it up.'
            : sprouts < 20
            ? 'Impressive growth! You\'re on fire.'
            : 'Amazing dedication! Your garden is thriving.'}
        </div>
      )}
    </Card>
  )
}
