interface SproutGardenProps {
  sprouts: number
  animated?: boolean
}

interface PlantSlot {
  top: string
  emoji: string
  left?: string
  right?: string
}

// Fixed plant slots scattered around the perimeter, avoiding the center pot area
// and the bottom button strip. Positions are percentages of the parent container.
const PLANT_SLOTS: PlantSlot[] = [
  // Top strip
  { top: '4%',  left: '7%',   emoji: '🌸' },
  { top: '13%', left: '26%',  emoji: '🌱' },
  { top: '4%',  left: '50%',  emoji: '🌱' },
  { top: '12%', left: '66%',  emoji: '🌼' },
  // Left column
  { top: '24%', left: '3%',   emoji: '🌱' },
  { top: '40%', left: '2%',   emoji: '🌺' },
  { top: '57%', left: '4%',   emoji: '🌱' },
  { top: '71%', left: '3%',   emoji: '🌸' },
  // Right column
  { top: '24%', right: '3%',  emoji: '🌱' },
  { top: '40%', right: '2%',  emoji: '🌼' },
  { top: '57%', right: '4%',  emoji: '🌱' },
  { top: '71%', right: '3%',  emoji: '🌺' },
  // Bottom corners (above button strip)
  { top: '82%', left: '11%',  emoji: '🌱' },
  { top: '80%', left: '38%',  emoji: '🌸' },
  { top: '82%', right: '11%', emoji: '🌱' },
  // Extra fill
  { top: '18%', left: '14%',  emoji: '🌼' },
]

export function SproutGarden({ sprouts, animated = false }: SproutGardenProps) {
  const visibleCount = Math.min(sprouts, PLANT_SLOTS.length)

  return (
    <>
      {PLANT_SLOTS.slice(0, visibleCount).map((slot, index) => (
        <span
          key={index}
          className={`absolute text-2xl select-none pointer-events-none ${
            animated && index === visibleCount - 1 ? 'sprout-fade-in' : ''
          }`}
          style={{ top: slot.top, left: slot.left, right: slot.right }}
          role="img"
          aria-label="garden plant"
        >
          {slot.emoji}
        </span>
      ))}
    </>
  )
}
