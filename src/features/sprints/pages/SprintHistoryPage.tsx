import { ErrorState } from '@/components/ui/error-state'
import { IconClock, IconChevronRight } from '@/shared/lib/icons'
import { PageTitle } from '@/components/ui/page-title'
import { SegmentedProgress } from '@/components/ui/segmented-progress'
import { SprintSummary } from '@/features/sprints/components/SprintSummary'
import { LoadingText } from '@/components/ui/loading-text'
import { useSprintHistoryPage } from '@/features/sprints/hooks/useSprintHistoryPage'
import { getCompletionPercent } from '@/features/sprints/lib/sprint'
import { formatDayMonth } from '@/shared/lib/date'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { SPRINTS_TEXTS } from '@/features/sprints/constants/texts'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export function SprintHistoryPage() {
  const {
    isLoading,
    hasError,
    retry,
    closedSprints,
    isSprintOpen,
    toggleSprint,
  } = useSprintHistoryPage()

  if (isLoading) {
    return <LoadingText />
  }

  if (hasError) {
    return <ErrorState onRetry={retry} />
  }

  if (closedSprints.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <PageTitle title={COMMON_TEXTS.history} icon={IconClock} count={0} />
        <EmptyState
          icon={IconClock}
          title={SPRINTS_TEXTS.historyEmptyTitle}
          description={SPRINTS_TEXTS.historyEmptyDescription}
        >
          <Button variant="outline" size="sm" render={<Link to="/board" />}>
            {SPRINTS_TEXTS.goToCurrentSprint}
          </Button>
        </EmptyState>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <PageTitle
        title={COMMON_TEXTS.history}
        icon={IconClock}
        count={closedSprints.length}
      />
      <div className="flex flex-col gap-2">
        {closedSprints.map((sprint) => {
          const isOpen = isSprintOpen(sprint.id)
          const percent = getCompletionPercent(sprint)
          return (
            <div key={sprint.id} className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => toggleSprint(sprint.id)}
                aria-expanded={isOpen}
                className="relative flex flex-col gap-3 rounded-md border border-border bg-card p-4 text-left hover:bg-card-hover sm:flex-row sm:items-center sm:gap-4"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-1 pr-6 sm:pr-0">
                  <span className="text-base text-fg">
                    {sprint.name}
                    <span className="ml-2 text-caption">
                      ({formatDayMonth(sprint.start_date)} -{' '}
                      {formatDayMonth(sprint.end_date)})
                    </span>
                  </span>
                  {sprint.goal && (
                    <span className="text-subtle">{sprint.goal}</span>
                  )}
                </div>
                <div className="flex flex-col gap-1 sm:items-end">
                  <span className="text-caption">
                    {SPRINTS_TEXTS.completedOf(
                      sprint.completed_tasks ?? 0,
                      sprint.total_tasks ?? 0,
                    )}
                  </span>
                  <SegmentedProgress
                    value={percent}
                    label={COMMON_TEXTS.progressOf(sprint.name)}
                  />
                </div>
                <IconChevronRight
                  size={12}
                  aria-hidden="true"
                  className={`absolute top-4 right-4 text-fg-muted transition-transform sm:static ${isOpen ? 'rotate-90' : ''}`}
                />
              </button>
              {isOpen && <SprintSummary sprint={sprint} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
