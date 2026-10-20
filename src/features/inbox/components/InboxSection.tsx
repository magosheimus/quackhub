import { IconBookOpen } from '@/shared/lib/icons'
import { StaticBoardCard } from '@/features/board/components/BoardCard'
import { Button } from '@/components/ui/button'
import { canRegisterPerformance } from '@/features/srs/lib/review'
import { daysBetween, todayLocal } from '@/shared/lib/date'
import type { Project } from '@/shared/types/entities'
import type { Task } from '@/features/tasks/model/task'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { INBOX_TEXTS } from '@/features/inbox/constants/texts'
import { buildProjectLabels } from '@/features/projects/lib/project'
import { DueBadge } from '@/features/tasks/components/DueBadge'

function describeReview(nextReview: string | null, today: string): string {
  if (!nextReview) return INBOX_TEXTS.reviewWithoutDate
  const days = daysBetween(nextReview, today)
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
  const projectLabels = buildProjectLabels(projects ?? [])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <span className="font-heading text-heading-2 text-fg">{title}</span>
        <span className="text-caption">{tasks.length}</span>
      </div>
      {tasks.map((task) => {
        const project = projects.find((p) => p.id === task.projectId)
        const isSrsEligible = canRegisterPerformance(project?.type, task.status)

        return (
          <StaticBoardCard
            key={task.id}
            task={task}
            projectLabels={projectLabels}
            showDue={false}
            info={
              isSrsEligible ? (
                <span className="text-caption">
                  {describeReview(task.srs?.nextReview ?? null, today)}
                </span>
              ) : (
                <DueBadge due={task.due} />
              )
            }
            actions={
              isSrsEligible ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onRegisterPerformance(task)}
                >
                  <IconBookOpen size={12} aria-hidden="true" />
                  {COMMON_TEXTS.registerPerformance}
                </Button>
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
