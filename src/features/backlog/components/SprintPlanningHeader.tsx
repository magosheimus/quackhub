import { Button } from '@/components/ui/button'
import { useStartSprint } from '@/features/sprints/hooks/useStartSprint'
import { formatDayMonth } from '@/shared/lib/date'
import type { Sprint } from '@/shared/types/entities'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { Panel } from '@/components/ui/panel'

type SprintPlanningHeaderProps = {
  sprint: Sprint
}

export function SprintPlanningHeader({ sprint }: SprintPlanningHeaderProps) {
  const { mutate: startSprint, isPending } = useStartSprint()

  return (
    <Panel className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-col gap-1">
        <span className="font-heading text-2xl text-fg">{sprint.name}</span>
        <span className="text-caption">
          {formatDayMonth(sprint.start_date)} -{' '}
          {formatDayMonth(sprint.end_date)}
        </span>
        {sprint.goal && <span className="text-subtle">{sprint.goal}</span>}
      </div>
      <Button
        size="sm"
        onClick={() => startSprint(sprint.id)}
        disabled={isPending}
      >
        {isPending ? COMMON_TEXTS.startingSprint : COMMON_TEXTS.startSprint}
      </Button>
    </Panel>
  )
}
