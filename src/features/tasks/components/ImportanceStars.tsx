import { useState } from 'react'
import { IconStarFilled, IconStarOutline } from '@/shared/lib/icons'
import {
  IMPORTANCE_LEVELS,
  nextImportance,
  type Importance,
} from '@/features/tasks/lib/importance'
import { TASKS_TEXTS } from '@/features/tasks/constants/texts'
import { cn } from '@/shared/lib/utils'

type ImportanceStarsProps = {
  value: Importance | null
  onChange: (value: Importance | null) => void
}

export function ImportanceStars({ value, onChange }: ImportanceStarsProps) {
  const [hovered, setHovered] = useState<Importance | null>(null)
  const shown = hovered ?? value ?? 0

  return (
    <div
      role="group"
      aria-label={TASKS_TEXTS.importance}
      className="flex items-center"
      onMouseLeave={() => setHovered(null)}
    >
      {IMPORTANCE_LEVELS.map((level) => {
        const Icon = level <= shown ? IconStarFilled : IconStarOutline
        return (
          <button
            key={level}
            type="button"
            aria-label={TASKS_TEXTS.importanceStars(level)}
            aria-pressed={value === level}
            onMouseEnter={() => setHovered(level)}
            onClick={() => onChange(nextImportance(value, level))}
            className={cn(
              'flex p-0.5',
              level <= shown ? 'text-warning' : 'text-fg-muted',
            )}
          >
            <Icon size={16} aria-hidden="true" />
          </button>
        )
      })}
    </div>
  )
}
