import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import type { TimerSettings as TimerSettingsType } from '../../types'

interface TimerSettingsProps {
  settings: TimerSettingsType
  onUpdate: (settings: Partial<TimerSettingsType>) => void
  disabled: boolean
}

const FOCUS_MIN = 5
const FOCUS_MAX = 60
const BREAK_MIN = 5
const BREAK_MAX = 30
const INCREMENT = 5

export function TimerSettings({ settings, onUpdate, disabled }: TimerSettingsProps) {
  const adjustFocus = (delta: number) => {
    const newDuration = Math.max(FOCUS_MIN, Math.min(FOCUS_MAX, settings.focusDuration + delta))
    onUpdate({ focusDuration: newDuration })
  }

  const adjustBreak = (delta: number) => {
    const newDuration = Math.max(BREAK_MIN, Math.min(BREAK_MAX, settings.breakDuration + delta))
    onUpdate({ breakDuration: newDuration })
  }

  return (
    <Card className="p-5" style={{ backgroundColor: disabled ? '#f0fdf4' : '#fffbeb' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-800">Timer Settings</h2>
        {disabled && (
          <span className="text-slate-400 text-sm" title="Settings locked while timer is active">
            🔒
          </span>
        )}
      </div>

      <div className="space-y-3">
        {/* Focus Duration */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-slate-700">🌱 Focus</div>
            <div className="text-xs text-slate-500">Deep work session</div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => adjustFocus(-INCREMENT)}
              variant="outline"
              size="sm"
              disabled={disabled || settings.focusDuration <= FOCUS_MIN}
              aria-label="Decrease focus duration"
            >
              −
            </Button>
            <span className="w-16 text-center font-bold text-slate-900 text-sm">
              {settings.focusDuration} min
            </span>
            <Button
              onClick={() => adjustFocus(INCREMENT)}
              variant="outline"
              size="sm"
              disabled={disabled || settings.focusDuration >= FOCUS_MAX}
              aria-label="Increase focus duration"
            >
              +
            </Button>
          </div>
        </div>

        {/* Break Duration */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-slate-700">☕ Break</div>
            <div className="text-xs text-slate-500">Rest and recharge</div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => adjustBreak(-INCREMENT)}
              variant="outline"
              size="sm"
              disabled={disabled || settings.breakDuration <= BREAK_MIN}
              aria-label="Decrease break duration"
            >
              −
            </Button>
            <span className="w-16 text-center font-bold text-slate-900 text-sm">
              {settings.breakDuration} min
            </span>
            <Button
              onClick={() => adjustBreak(INCREMENT)}
              variant="outline"
              size="sm"
              disabled={disabled || settings.breakDuration >= BREAK_MAX}
              aria-label="Increase break duration"
            >
              +
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
