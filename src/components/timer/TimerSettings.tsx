import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import type { TimerSettings as TimerSettingsType } from '../../types'

interface TimerSettingsProps {
  settings: TimerSettingsType
  onUpdate: (settings: Partial<TimerSettingsType>) => void
  disabled: boolean  // disable when timer is running
}

// Configuration limits
const FOCUS_MIN = 5
const FOCUS_MAX = 60
const BREAK_MIN = 5
const BREAK_MAX = 30
const INCREMENT = 5

/**
 * Timer settings component for adjusting focus and break durations
 */
export function TimerSettings({
  settings,
  onUpdate,
  disabled,
}: TimerSettingsProps) {
  const adjustFocus = (delta: number) => {
    const newDuration = Math.max(
      FOCUS_MIN,
      Math.min(FOCUS_MAX, settings.focusDuration + delta)
    )
    onUpdate({ focusDuration: newDuration })
  }

  const adjustBreak = (delta: number) => {
    const newDuration = Math.max(
      BREAK_MIN,
      Math.min(BREAK_MAX, settings.breakDuration + delta)
    )
    onUpdate({ breakDuration: newDuration })
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Timer Settings</h2>

      <div className="space-y-4">
        {/* Focus Duration Setting */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-sm font-medium text-slate-700">Focus Duration</div>
            <div className="text-xs text-slate-500">Time for focused work</div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => adjustFocus(-INCREMENT)}
              variant="outline"
              size="sm"
              disabled={disabled || settings.focusDuration <= FOCUS_MIN}
            >
              -
            </Button>
            <div className="w-20 text-center font-semibold text-slate-900">
              {settings.focusDuration} min
            </div>
            <Button
              onClick={() => adjustFocus(INCREMENT)}
              variant="outline"
              size="sm"
              disabled={disabled || settings.focusDuration >= FOCUS_MAX}
            >
              +
            </Button>
          </div>
        </div>

        {/* Break Duration Setting */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-sm font-medium text-slate-700">Break Duration</div>
            <div className="text-xs text-slate-500">Time to rest and recharge</div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => adjustBreak(-INCREMENT)}
              variant="outline"
              size="sm"
              disabled={disabled || settings.breakDuration <= BREAK_MIN}
            >
              -
            </Button>
            <div className="w-20 text-center font-semibold text-slate-900">
              {settings.breakDuration} min
            </div>
            <Button
              onClick={() => adjustBreak(INCREMENT)}
              variant="outline"
              size="sm"
              disabled={disabled || settings.breakDuration >= BREAK_MAX}
            >
              +
            </Button>
          </div>
        </div>
      </div>

      {disabled && (
        <div className="mt-4 text-xs text-slate-500 text-center">
          Settings locked while timer is active
        </div>
      )}
    </Card>
  )
}
