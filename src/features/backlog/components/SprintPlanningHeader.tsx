import { Button } from '@/components/ui/button'
import { useStartSprint } from '@/features/sprints/hooks/useStartSprint'
import { formatDayMonth } from '@/shared/lib/date'
import type { Sprint } from '@/shared/types/entities'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { Panel } from '@/components/layout/panel'
import { useDatePreferences } from '@/features/settings/hooks/useDatePreferences'

type SprintPlanningHeaderProps = {
  sprint: Sprint
}

export function SprintPlanningHeader({ sprint }: SprintPlanningHeaderProps) {
  const { dateFormat } = useDatePreferences()
  const { mutate: startSprint, isPending } = useStartSprint()

  return (
    <Panel className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-col gap-1">
        <span className="font-heading text-heading-3 text-fg">
          {sprint.name}
        </span>
        <span className="text-caption">
          {formatDayMonth(sprint.start_date, dateFormat)} -{' '}
          {formatDayMonth(sprint.end_date, dateFormat)}
        </span>
        {sprint.goal && (
          <span className="text-body text-fg-muted">{sprint.goal}</span>
        )}
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
