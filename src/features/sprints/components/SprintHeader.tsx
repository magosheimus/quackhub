import { Button } from '@/components/ui/button'
import { useStartSprint } from '@/features/sprints/hooks/useStartSprint'
import { SprintCreateModal } from './SprintCreateModal'
import { SprintCloseModal } from './SprintCloseModal'
import { useSprints } from '@/features/sprints/hooks/useSprints'
import { SegmentedProgress } from '@/components/brand/segmented-progress'
import { formatFullDate } from '@/shared/lib/date'
import type { Sprint } from '@/shared/types/entities'
import type { Task } from '@/features/tasks/model/task'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { SPRINTS_TEXTS } from '@/features/sprints/constants/texts'
import { EmptyMessage } from '@/components/feedback/empty-message'
import { Panel } from '@/components/layout/panel'
import { useDatePreferences } from '@/features/settings/hooks/useDatePreferences'

type SprintHeaderProps = {
  activeSprint: Sprint | null
  tasks: Task[]
}

export function SprintHeader({ activeSprint, tasks }: SprintHeaderProps) {
  const { dateFormat } = useDatePreferences()
  const { data: sprints } = useSprints()
  const { mutate: startSprint, isPending } = useStartSprint()
  const plannedSprint = sprints?.find((s) => s.status === 'planned')

  if (activeSprint) {
    const total = tasks.length
    const done = tasks.filter((t) => t.status === 'done').length
    const progress = total === 0 ? 0 : Math.round((done / total) * 100)

    return (
      <Panel className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <span className="flex flex-wrap items-baseline gap-x-2 font-heading text-heading-3 text-fg">
            {activeSprint.name}
            {(activeSprint.start_date || activeSprint.end_date) && (
              <span className="font-body text-body-strong">
                ({formatFullDate(activeSprint.start_date, dateFormat)} →{' '}
                {formatFullDate(activeSprint.end_date, dateFormat)})
              </span>
            )}
          </span>
          {activeSprint.goal && (
            <span className="text-body text-fg-muted">{activeSprint.goal}</span>
          )}
        </div>
        <div className="flex flex-col gap-1 md:items-center">
          <span className="text-caption">
            {SPRINTS_TEXTS.progress(progress, done, total)}
          </span>
          <SegmentedProgress
            value={progress}
            label={SPRINTS_TEXTS.progressLabel}
          />
        </div>
        <SprintCloseModal sprint={activeSprint} tasks={tasks} />
      </Panel>
    )
  }

  if (plannedSprint) {
    return (
      <Panel className="flex flex-wrap items-center justify-between gap-4">
        <span className="text-sm text-fg">
          {SPRINTS_TEXTS.readyToStart(plannedSprint.name)}
        </span>
        <Button
          onClick={() => startSprint(plannedSprint.id)}
          disabled={isPending}
        >
          {isPending ? COMMON_TEXTS.startingSprint : COMMON_TEXTS.startSprint}
        </Button>
      </Panel>
    )
  }

  return (
    <div className="flex items-center justify-between rounded-md border border-surface bg-page p-4">
      <EmptyMessage>{SPRINTS_TEXTS.noSprints}</EmptyMessage>
      <SprintCreateModal />
    </div>
  )
}
