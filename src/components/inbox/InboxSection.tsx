import { IconBookOpen } from '@/lib/icons'
import { Button } from '@/components/ui/button'
import { StaticBoardCard } from '@/components/board/BoardCard'
import { todayLocal } from '@/lib/srs'
import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']
type Project = Database['public']['Tables']['projects']['Row']

const SRS_ELIGIBLE_STATUSES = ['studying', 'to_review', 'scheduled']

function describeReview(nextReview: string | null, today: string): string {
  if (!nextReview) return 'revisão sem data'
  const days = Math.round(
    (Date.parse(today) - Date.parse(nextReview)) / 86_400_000,
  )
  if (days === 0) return 'revisar hoje'
  if (days > 0)
    return `revisão vencida há ${days} ${days === 1 ? 'dia' : 'dias'}`
  const ahead = -days
  return `revisar em ${ahead} ${ahead === 1 ? 'dia' : 'dias'}`
}

type InboxSectionProps = {
  title: string
  tasks: Task[]
  projects: Project[]
  onComplete: (id: string) => void
  onRegisterPerformance: (task: Task) => void
}

export function InboxSection({
  title,
  tasks,
  projects,
  onComplete,
  onRegisterPerformance,
}: InboxSectionProps) {
  if (tasks.length === 0) return null

  const today = todayLocal()
  const projectPrefixById = new Map(projects.map((p) => [p.id, p.prefix ?? '']))

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <span className="font-heading text-xl uppercase text-(--text-primary)">
          {title}
        </span>
        <span className="text-xs text-(--text-muted)">{tasks.length}</span>
      </div>
      {tasks.map((task) => {
        const project = projects.find((p) => p.id === task.project_id)
        const isSrsEligible =
          project?.type === 'study' &&
          SRS_ELIGIBLE_STATUSES.includes(task.status)

        return (
          <StaticBoardCard
            key={task.id}
            task={task}
            projectPrefixById={projectPrefixById}
            actions={
              isSrsEligible ? (
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-(--text-muted)">
                    {describeReview(task.next_review, today)}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onRegisterPerformance(task)}
                  >
                    <IconBookOpen size={12} aria-hidden="true" />
                    Registrar Desempenho
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onComplete(task.id)}
                >
                  ✓ Concluir
                </Button>
              )
            }
          />
        )
      })}
    </div>
  )
}
