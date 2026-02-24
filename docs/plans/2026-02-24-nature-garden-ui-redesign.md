# Nature / Garden UI Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign Sprout Pomodoro with a nature/garden aesthetic — warm cream palette, SVG circular progress ring, and organic styling throughout.

**Architecture:** Pure styling changes across 7 existing files. No new logic, hooks, or data structures. The SVG ring is computed inline in TimerDisplay using stroke-dashoffset math.

**Tech Stack:** React, Tailwind CSS (utility classes), inline SVG

---

### Task 1: Warm cream background + index.css

**Files:**
- Modify: `src/styles/index.css`

**Step 1: Update body background**

Replace the cold gray-50 with warm cream:

```css
@layer base {
  body {
    @apply text-gray-900;
    background-color: #faf7f2;
  }
}
```

**Step 2: Verify**

Run the dev server (`npm run dev`) and check the page background is warm cream, not gray.

**Step 3: Commit**

```bash
git add src/styles/index.css
git commit -m "style: warm cream background"
```

---

### Task 2: Header and footer

**Files:**
- Modify: `src/components/Layout.tsx`

**Step 1: Update header and remove footer**

Replace entire file content:

```tsx
import { FC, ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-emerald-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center gap-2">
          <span className="text-xl">🌿</span>
          <h1 className="text-xl font-bold tracking-tight">Sprout</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
```

**Step 2: Verify**

Dev server: header shows "🌿 Sprout" in deeper emerald, footer is gone.

**Step 3: Commit**

```bash
git add src/components/Layout.tsx
git commit -m "style: streamline header, remove generic footer"
```

---

### Task 3: Button variants

**Files:**
- Modify: `src/components/ui/Button.tsx`

**Step 1: Update secondary to sky-blue**

```tsx
import { ButtonHTMLAttributes, FC } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export const Button: FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variantStyles = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500 shadow-sm',
    secondary: 'bg-sky-500 hover:bg-sky-600 text-white focus:ring-sky-400 shadow-sm',
    outline: 'border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-50 focus:ring-emerald-500',
  }

  const sizeStyles = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-5 py-2 text-base',
    lg: 'px-8 py-3 text-lg',
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
```

Key changes: `rounded-full` (pill shape), `font-semibold`, secondary is now sky-blue, disabled state added.

**Step 2: Verify**

Check that all buttons across the app now have pill shape.

**Step 3: Commit**

```bash
git add src/components/ui/Button.tsx
git commit -m "style: pill buttons, sky-blue secondary, disabled state"
```

---

### Task 4: Circular progress ring in TimerDisplay

**Files:**
- Modify: `src/components/timer/TimerDisplay.tsx`

**Step 1: Rewrite with SVG ring**

The ring uses SVG stroke-dashoffset math:
- radius = 110 (px)
- circumference = 2 * π * 110 ≈ 691.15
- dashoffset = circumference * (1 - progress) where progress = elapsed/total

```tsx
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
        {/* SVG ring */}
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
          {/* Progress */}
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
```

**Step 2: Verify**

- Idle: gray ring, 🌿, shows "00:00"
- Start focus: ring animates green as time counts down
- Start break: ring turns sky-blue

**Step 3: Commit**

```bash
git add src/components/timer/TimerDisplay.tsx
git commit -m "feat: SVG circular progress ring in timer display"
```

---

### Task 5: TimerSettings card refresh

**Files:**
- Modify: `src/components/timer/TimerSettings.tsx`

**Step 1: Warmer card, lock icon instead of text**

```tsx
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
        {disabled && <span className="text-slate-400 text-sm" title="Settings locked while timer is active">🔒</span>}
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
```

**Step 2: Verify**

Card shows amber tint when unlocked, green tint when locked, 🔒 icon appears instead of text.

**Step 3: Commit**

```bash
git add src/components/timer/TimerSettings.tsx
git commit -m "style: warmer settings card, lock icon, emoji labels"
```

---

### Task 6: TimerControls layout

**Files:**
- Modify: `src/components/timer/TimerControls.tsx`

**Step 1: Full-width primary button on mobile, sky-blue break**

```tsx
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
            {isPaused ? '▶ Resume' : '▶ Start Focus'}
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
            ☕ Start Break
          </Button>
        )}
      </div>

      {/* Reset link-style */}
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
```

Key change: Reset demoted to a subtle text link so it doesn't compete with the primary action.

**Step 2: Verify**

- Idle: large pill "▶ Start Focus" + "☕ Start Break" side by side
- Running: large pill "⏸ Pause" + subtle "Reset" link below
- Paused: large pill "▶ Resume" + subtle "Reset" link below

**Step 3: Commit**

```bash
git add src/components/timer/TimerControls.tsx
git commit -m "style: flex-width controls, reset as text link, icons on buttons"
```

---

### Task 7: Sprout Garden amber styling

**Files:**
- Modify: `src/components/timer/SproutGarden.tsx`

**Step 1: Amber garden bed**

```tsx
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
```

**Step 2: Verify**

Garden card has warm amber background. Garden bed (when sprouts present) is a slightly deeper amber. Motivation text is amber-colored.

**Step 3: Commit**

```bash
git add src/components/timer/SproutGarden.tsx
git commit -m "style: amber garden bed, warmer card tones"
```

---

### Task 8: Card component check

**Files:**
- Read: `src/components/ui/Card.tsx`

**Step 1: Verify Card supports className and style pass-through**

The TimerSettings and SproutGarden tasks pass `style` props to Card. Check that Card forwards them. If it doesn't, add support.

If Card looks like this (no style prop):
```tsx
export const Card: FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
    {children}
  </div>
)
```

Update to:
```tsx
import { FC, HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const Card: FC<CardProps> = ({ children, className = '', ...props }) => (
  <div
    className={`rounded-xl shadow-sm border border-gray-100 ${className}`}
    {...props}
  >
    {children}
  </div>
)
```

Note: remove `bg-white` default so the `style` background overrides work.

**Step 2: Verify**

Cards now show amber/green tinted backgrounds from Task 5 and 7.

**Step 3: Commit**

```bash
git add src/components/ui/Card.tsx
git commit -m "style: Card forwards HTML props, remove hardcoded bg-white"
```

---

### Final Verification

After all tasks, do a full visual review:

1. Background: warm cream page
2. Header: compact "🌿 Sprout" on deeper emerald
3. Settings card: amber tint, pill buttons, emoji labels, 🔒 when locked
4. Timer: SVG ring animates green/blue/gray by mode
5. Controls: pill buttons, reset is subtle text
6. Garden: amber tones, sprouts displayed in warm bed
