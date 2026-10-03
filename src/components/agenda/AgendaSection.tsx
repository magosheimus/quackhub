import { Button } from '@/components/ui/button'
import type { Database } from '@/types/database.types'
import { Link } from 'react-router-dom'

type Task = Database['public']['Tables']['tasks']['Row']
type Project = Database['public']['Tables']['projects']['Row']

const SRS_ELIGIBLE_STATUSES = ['studying', 'to_review', 'scheduled']

type AgendaSectionProps = {
  title: string
  tasks: Task[]
  projects: Project[]
  onComplete: (id: string) => void
  onRegisterPerformance: (task: Task) => void
}

export function AgendaSection({
  title,
  tasks,
  projects,
  onComplete,
  onRegisterPerformance,
}: AgendaSectionProps) {
  if (tasks.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      <span className="font-heading text-lg text-[--text-primary]">
        {title}
      </span>
      {tasks.map((task) => {
        const project = projects.find((p) => p.id === task.project_id)
        const isSrsEligible =
          project?.type === 'study' &&
          SRS_ELIGIBLE_STATUSES.includes(task.status)

        return (
          <div
            key={task.id}
            className="flex items-center gap-2 rounded-(--radius-md) border border-(--border) bg-(--bg-card) p-3 text-sm"
          >
            <Link
              to={`/cards/${task.id}`}
              className="flex-1 text-[--text-primary] hover:text-[--accent] hover:underline"
            >
              {task.title}
            </Link>
            {!isSrsEligible && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onComplete(task.id)}
              >
                ✓ Concluir
              </Button>
            )}
            {isSrsEligible && (
              <Button
                type="button"
                size="sm"
                onClick={() => onRegisterPerformance(task)}
              >
                Registrar Desempenho
              </Button>
            )}
          </div>
        )
      })}
    </div>
  )
}
