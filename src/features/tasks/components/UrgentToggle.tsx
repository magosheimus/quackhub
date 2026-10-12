import { IconFlag } from '@/shared/lib/icons'
import { TASKS_TEXTS } from '@/features/tasks/constants/texts'
import { cn } from '@/shared/lib/utils'

type UrgentToggleProps = {
  flagged: boolean
  onToggle: () => void
  className?: string
}

export function UrgentToggle({
  flagged,
  onToggle,
  className,
}: UrgentToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={flagged}
      onClick={onToggle}
      className={cn('flex w-fit items-center gap-2 text-sm text-fg', className)}
    >
      <IconFlag
        size={16}
        aria-hidden="true"
        className={flagged ? 'text-danger' : 'text-fg-muted'}
      />
      {TASKS_TEXTS.markUrgent}
    </button>
  )
}
