import { Button } from '@/components/ui/button'
import { useStartSprint } from '@/hooks/sprints/useStartSprint'
import { SprintCreateModal } from './SprintCreateModal'
import type { Database } from '@/types/database.types'
import { SprintCloseModal } from './SprintCloseModal'
import { useSprints } from '@/hooks/sprints/useSprints'

type Sprint = Database['public']['Tables']['sprints']['Row']
type Task = Database['public']['Tables']['tasks']['Row']

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
      <div className="flex flex-col gap-1 rounded-[--radius-md] border border-[--border] bg-[var(--bg-card)] p-4">
        <div className="flex items-center justify-between">
          <span className="font-heading text-xl text-[--text-primary]">
            {activeSprint.name}
          </span>
          <span className="text-xs text-[--text-muted]">
            {progress}% concluído ({done}/{total})
          </span>
          <SprintCloseModal sprint={activeSprint} tasks={tasks} />
        </div>
        {(activeSprint.start_date || activeSprint.end_date) && (
          <span className="text-xs text-[--text-muted]">
            {activeSprint.start_date ?? '?'} → {activeSprint.end_date ?? '?'}
          </span>
        )}
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
      <div className="flex items-center justify-between rounded-[--radius-md] border border-[--border] bg-[var(--bg-card)] p-4">
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
    <div className="flex items-center justify-between rounded-[--radius-md] border border-dashed border-[--border] p-4">
      <span className="text-sm text-[--text-muted]">
        — Nenhuma Sprint neste projeto —
      </span>
      <SprintCreateModal />
    </div>
  )
}
