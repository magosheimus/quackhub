import { Button } from '@/components/ui/button'
import { useStartSprint } from '@/features/sprints/hooks/useStartSprint'
import { SprintCreateModal } from './SprintCreateModal'
import { SprintCloseModal } from './SprintCloseModal'
import { useSprints } from '@/features/sprints/hooks/useSprints'
import { SegmentedProgress } from '@/components/ui/segmented-progress'
import { formatFullDate } from '@/shared/lib/date'
import type { Sprint, Task } from '@/shared/types/entities'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { SPRINTS_TEXTS } from '@/features/sprints/constants/texts'

type SprintHeaderProps = {
  activeSprint: Sprint | null
  tasks: Task[]
}

export function SprintHeader({ activeSprint, tasks }: SprintHeaderProps) {
  const { data: sprints } = useSprints()
  const { mutate: startSprint, isPending } = useStartSprint()
  const plannedSprint = sprints?.find((s) => s.status === 'planned')

  if (activeSprint) {
    const total = tasks.length
    const done = tasks.filter((t) => t.status === 'done').length
    const progress = total === 0 ? 0 : Math.round((done / total) * 100)

    return (
      <div className="flex items-center justify-between gap-4 rounded-md border border-border bg-card p-4">
        <div className="flex flex-col gap-1">
          <span className="font-heading text-2xl text-fg">
            {activeSprint.name}
            {(activeSprint.start_date || activeSprint.end_date) && (
              <span className="font-body ml-2 text-xs text-fg-muted">
                ({formatFullDate(activeSprint.start_date)} →{' '}
                {formatFullDate(activeSprint.end_date)})
              </span>
            )}
          </span>
          {activeSprint.goal && (
            <span className="text-sm text-fg-muted">{activeSprint.goal}</span>
          )}
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-fg-muted">
            {SPRINTS_TEXTS.progress(progress, done, total)}
          </span>
          <SegmentedProgress
            value={progress}
            label={SPRINTS_TEXTS.progressLabel}
          />
        </div>
        <SprintCloseModal sprint={activeSprint} tasks={tasks} />
      </div>
    )
  }

  if (plannedSprint) {
    return (
      <div className="flex items-center justify-between rounded-md border border-border bg-card p-4">
        <span className="text-sm text-fg">
          {SPRINTS_TEXTS.readyToStart(plannedSprint.name)}
        </span>
        <Button
          onClick={() => startSprint(plannedSprint.id)}
          disabled={isPending}
        >
          {isPending ? COMMON_TEXTS.startingSprint : COMMON_TEXTS.startSprint}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between rounded-md border border-surface bg-page p-4">
      <span className="text-sm text-fg-muted">{SPRINTS_TEXTS.noSprints}</span>
      <SprintCreateModal />
    </div>
  )
}
