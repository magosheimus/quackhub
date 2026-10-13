import { IconFlag } from '@/shared/lib/icons'
import { TASKS_TEXTS } from '@/features/tasks/constants/texts'
import { cn } from '@/shared/lib/utils'
import { InfoTip } from '@/components/ui/info-tip'

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
    <span className={cn('flex w-fit items-center gap-1.5', className)}>
      <button
        type="button"
        aria-pressed={flagged}
        onClick={onToggle}
        className="flex items-center gap-2 text-sm text-fg"
      >
        <IconFlag
          size={16}
          aria-hidden="true"
          className={flagged ? 'text-danger' : 'text-fg-muted'}
        />
        {TASKS_TEXTS.markUrgent}
      </button>
      <InfoTip text={TASKS_TEXTS.hintUrgent} />
    </span>
  )
}
