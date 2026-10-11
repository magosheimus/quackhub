import { Button } from '@/components/ui/button'
import { useStartSprint } from '@/features/sprints/hooks/useStartSprint'
import { formatDayMonth } from '@/shared/lib/date'
import type { Sprint } from '@/shared/types/entities'
import { COMMON_TEXTS } from '@/shared/constants/texts'

type SprintPlanningHeaderProps = {
  sprint: Sprint
}

export function SprintPlanningHeader({ sprint }: SprintPlanningHeaderProps) {
  const { mutate: startSprint, isPending } = useStartSprint()

  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-border bg-(--bg-card) p-4">
      <div className="flex flex-col gap-1">
        <span className="font-heading text-2xl text-(--text-primary)">
          {sprint.name}
        </span>
        <span className="text-xs text-(--text-muted)">
          {formatDayMonth(sprint.start_date)} -{' '}
          {formatDayMonth(sprint.end_date)}
        </span>
        {sprint.goal && (
          <span className="text-sm text-(--text-muted)">{sprint.goal}</span>
        )}
      </div>
      <Button
        size="sm"
        onClick={() => startSprint(sprint.id)}
        disabled={isPending}
      >
        {isPending ? COMMON_TEXTS.startingSprint : COMMON_TEXTS.startSprint}
      </Button>
    </div>
  )
}
