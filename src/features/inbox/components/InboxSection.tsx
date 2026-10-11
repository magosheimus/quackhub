import { IconBookOpen } from '@/shared/lib/icons'
import { Button } from '@/components/ui/button'
import { StaticBoardCard } from '@/features/board/components/BoardCard'
import { canRegisterPerformance, todayLocal } from '@/features/srs/lib/srs'
import type { Project, Task } from '@/shared/types/entities'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { INBOX_TEXTS } from '@/features/inbox/constants/texts'

function describeReview(nextReview: string | null, today: string): string {
  if (!nextReview) return INBOX_TEXTS.reviewWithoutDate
  const days = Math.round(
    (Date.parse(today) - Date.parse(nextReview)) / 86_400_000,
  )
  if (days === 0) return INBOX_TEXTS.reviewToday
  if (days > 0) return INBOX_TEXTS.reviewOverdue(COMMON_TEXTS.dayCount(days))
  const ahead = -days
  return INBOX_TEXTS.reviewIn(COMMON_TEXTS.dayCount(ahead))
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
        <span className="font-heading text-xl uppercase text-fg">{title}</span>
        <span className="text-caption">{tasks.length}</span>
      </div>
      {tasks.map((task) => {
        const project = projects.find((p) => p.id === task.project_id)
        const isSrsEligible = canRegisterPerformance(project?.type, task.status)

        return (
          <StaticBoardCard
            key={task.id}
            task={task}
            projectPrefixById={projectPrefixById}
            actions={
              isSrsEligible ? (
                <div className="flex flex-col items-end gap-1">
                  <span className="text-caption">
                    {describeReview(task.next_review, today)}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onRegisterPerformance(task)}
                  >
                    <IconBookOpen size={12} aria-hidden="true" />
                    {COMMON_TEXTS.registerPerformance}
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onComplete(task.id)}
                >
                  {INBOX_TEXTS.complete}
                </Button>
              )
            }
          />
        )
      })}
    </div>
  )
}
