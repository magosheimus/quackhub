import { IconStarFilled } from '@/shared/lib/icons'
import type { Importance } from '@/features/tasks/lib/importance'
import { TASKS_TEXTS } from '@/features/tasks/constants/texts'

export function ImportanceBadge({ value }: { value: Importance | null }) {
  if (!value) {
    return null
  }
  const label = TASKS_TEXTS.importanceStars(value)
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className="flex w-fit items-center text-warning"
    >
      {Array.from({ length: value }, (_, index) => (
        <IconStarFilled key={index} size={16} aria-hidden="true" />
      ))}
    </span>
  )
}
