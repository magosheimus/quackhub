import { ErrorState } from '@/components/feedback/error-state'
import {
  IconCalendar,
  IconFlag,
  IconFolder,
  IconInbox,
} from '@/shared/lib/icons'
import { cn } from '@/shared/lib/utils'
import type { InboxCounterTone } from '@/features/inbox/lib/inboxCounters'
import { CardCreateModal } from '@/features/tasks/components/CardCreateModal'
import { ProjectCreateModal } from '@/features/projects/components/ProjectCreateModal'
import { Marquee } from '@/components/brand/marquee'
import { useInboxPage } from '@/features/inbox/hooks/useInboxPage'
import { InboxSection } from '@/features/inbox/components/InboxSection'
import { RegisterPerformanceModal } from '@/features/srs/components/RegisterPerformanceModal'
import { LoadingText } from '@/components/feedback/loading-text'
import { PageTitle } from '@/components/layout/page-title'
import { INBOX_TEXTS } from '@/features/inbox/constants/texts'
import { Panel } from '@/components/layout/panel'
import { EmptyState } from '@/components/feedback/empty-state'

const COUNTER_TONE_CLASS: Record<InboxCounterTone, string> = {
  default: 'text-fg',
  muted: 'text-fg-muted',
  danger: 'text-danger',
}

export function InboxPage() {
  const {
    isLoading,
    hasError,
    retry,
    urgent,
    srsOverdue,
    dueByToday,
    totalCount,
    isEmpty,
    counters,
    title,
    sprintBanner,
    projects,
    hasProjects,
    completeTask,
    registeringTask,
    startRegistering,
    stopRegistering,
  } = useInboxPage()

  if (isLoading) {
    return <LoadingText />
  }

  if (hasError) {
    return <ErrorState onRetry={retry} />
  }

  return (
    <div className="flex flex-col gap-4">
      {sprintBanner && <Marquee>{sprintBanner}</Marquee>}

      <PageTitle title={title} icon={IconInbox} count={totalCount} />

      <div className="grid grid-cols-3 gap-3">
        {counters.map((counter) => (
          <Panel
            key={counter.key}
            className={cn(
              'flex flex-col gap-1 px-4 py-3',
              counter.tone === 'danger' && 'border-danger',
            )}
          >
            <span
              className={cn(
                'flex items-center gap-2 font-heading text-display',
                COUNTER_TONE_CLASS[counter.tone],
              )}
            >
              {counter.value}
              {counter.tone === 'danger' && (
                <IconFlag size={16} aria-hidden="true" />
              )}
            </span>
            <span className="text-caption">{counter.label}</span>
            {counter.overdueDetail && (
              <span className="text-caption text-danger">
                {counter.overdueDetail}
              </span>
            )}
          </Panel>
        ))}
      </div>

      {isEmpty ? (
        hasProjects ? (
          <EmptyState
            icon={IconCalendar}
            title={INBOX_TEXTS.emptyTitle}
            description={INBOX_TEXTS.emptyDescription}
          >
            <CardCreateModal />
          </EmptyState>
        ) : (
          <EmptyState
            icon={IconFolder}
            title={INBOX_TEXTS.welcomeTitle}
            description={INBOX_TEXTS.welcomeDescription}
          >
            <ProjectCreateModal triggerVariant="button" />
          </EmptyState>
        )
      ) : (
        <>
          <InboxSection
            title={INBOX_TEXTS.urgentSection}
            tasks={urgent}
            projects={projects}
            onComplete={completeTask}
            onRegisterPerformance={startRegistering}
          />
          <InboxSection
            title={INBOX_TEXTS.srsOverdueSection}
            tasks={srsOverdue}
            projects={projects}
            onComplete={completeTask}
            onRegisterPerformance={startRegistering}
          />
          <InboxSection
            title={INBOX_TEXTS.dueSection}
            tasks={dueByToday}
            projects={projects}
            onComplete={completeTask}
            onRegisterPerformance={startRegistering}
          />
        </>
      )}

      {registeringTask && (
        <RegisterPerformanceModal
          task={registeringTask}
          open={registeringTask !== null}
          onOpenChange={(open) => !open && stopRegistering()}
        />
      )}
    </div>
  )
}
