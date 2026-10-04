import { Button } from '@/components/ui/button'
import { useStartSprint } from '@/hooks/sprints/useStartSprint'
import type { Database } from '@/types/database.types'

type Sprint = Database['public']['Tables']['sprints']['Row']

type SprintPlanningHeaderProps = {
  sprint: Sprint
}

function formatShortDate(date: string | null): string {
  if (!date) return '?'
  const [, month, day] = date.split('-')
  return `${day}/${month}`
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
          {formatShortDate(sprint.start_date)} -{' '}
          {formatShortDate(sprint.end_date)}
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
        {isPending ? 'Iniciando...' : 'Iniciar sprint'}
      </Button>
    </div>
  )
}
