import { Button } from '@/components/ui/button'
import { useStartSprint } from '@/hooks/sprints/useStartSprint'
import { SprintCreateModal } from './SprintCreateModal'
import type { Database } from '@/types/database.types'
import { SprintCloseModal } from './SprintCloseModal'
import { useSprints } from '@/hooks/sprints/useSprints'
import { SegmentedProgress } from '@/components/ui/segmented-progress'

type Sprint = Database['public']['Tables']['sprints']['Row']
type Task = Database['public']['Tables']['tasks']['Row']

function formatShortDate(date: string | null): string {
  if (!date) return '?'
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}

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
      <div className="flex flex-col gap-1 rounded-md border border-border bg-(--bg-card) p-4">
        <div className="flex items-center justify-between">
          <span className="font-heading text-2xl text-(--text-primary)">
            {activeSprint.name}
            {(activeSprint.start_date || activeSprint.end_date) && (
              <span className="font-body ml-2 text-xs text-(--text-muted)">
                ({formatShortDate(activeSprint.start_date)} →{' '}
                {formatShortDate(activeSprint.end_date)})
              </span>
            )}
          </span>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-(--text-muted)">
              {progress}% concluído ({done}/{total})
            </span>
            <SegmentedProgress value={progress} label="Progresso da sprint" />
          </div>
          <SprintCloseModal sprint={activeSprint} tasks={tasks} />
        </div>
        {activeSprint.goal && (
          <span className="text-sm text-[--text-muted]">
            {activeSprint.goal}
          </span>
        )}
      </div>
    )
  }

  if (plannedSprint) {
    return (
      <div className="flex items-center justify-between rounded-md border border-border bg-(--bg-card) p-4">
        <span className="text-sm text-[--text-primary]">
          {plannedSprint.name} — pronta pra começar
        </span>
        <Button
          onClick={() => startSprint(plannedSprint.id)}
          disabled={isPending}
        >
          {isPending ? 'Iniciando...' : 'Iniciar Sprint'}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between rounded-md border border-(--bg-surface) bg-(--bg-page) p-4">
      <span className="text-sm text-(--text-muted)">
        — Nenhuma Sprint neste projeto —
      </span>
      <SprintCreateModal />
    </div>
  )
}
