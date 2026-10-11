import { IconInbox, IconCalendar } from '@/shared/lib/icons'
import { Marquee } from '@/components/ui/marquee'
import { useInboxPage } from '@/features/inbox/hooks/useInboxPage'
import { InboxSection } from '@/features/inbox/components/InboxSection'
import { RegisterPerformanceModal } from '@/features/srs/components/RegisterPerformanceModal'
import { LoadingText } from '@/components/ui/loading-text'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { PageTitle } from '@/components/ui/page-title'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { INBOX_TEXTS } from '@/features/inbox/constants/texts'

export function InboxPage() {
  const {
    isLoading,
    urgent,
    srsOverdue,
    dueToday,
    totalCount,
    isEmpty,
    todayLabel,
    sprintBanner,
    projects,
    completeTask,
    registeringTask,
    startRegistering,
    stopRegistering,
  } = useInboxPage()

  if (isLoading) {
    return <LoadingText />
  }

  return (
    <div className="flex flex-col gap-4">
      {sprintBanner && <Marquee>{sprintBanner}</Marquee>}

      <div className="flex flex-col gap-1">
        <PageTitle
          title={INBOX_TEXTS.title}
          icon={IconInbox}
          count={totalCount}
        />
        <span className="pl-4 text-xs text-fg-muted">{todayLabel}</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { value: dueToday.length, label: INBOX_TEXTS.tasksCounter },
          { value: srsOverdue.length, label: INBOX_TEXTS.reviewsCounter },
          { value: urgent.length, label: INBOX_TEXTS.urgentCounter },
        ].map((counter) => (
          <div
            key={counter.label}
            className="flex flex-col gap-1 rounded-md border border-border bg-card px-4 py-3"
          >
            <span className="font-heading text-3xl text-fg">
              {counter.value}
            </span>
            <span className="text-xs text-fg-muted">{counter.label}</span>
          </div>
        ))}
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center gap-4 rounded-md border border-surface bg-page px-6 py-12 text-center">
          <IconCalendar
            size={24}
            aria-hidden="true"
            className="text-fg-muted"
          />
          <div className="flex flex-col gap-1">
            <span className="font-heading text-2xl text-fg">
              {INBOX_TEXTS.emptyTitle}
            </span>
            <span className="text-sm text-fg-muted">
              {INBOX_TEXTS.emptyDescription}
            </span>
          </div>
          <div className="flex gap-3 pt-2">
            <Link
              to="/board"
              className={buttonVariants({ variant: 'outline', size: 'sm' })}
            >
              {COMMON_TEXTS.currentSprint}
            </Link>
            <Link
              to="/backlog"
              className={buttonVariants({ variant: 'outline', size: 'sm' })}
            >
              {COMMON_TEXTS.goToBacklog}
            </Link>
          </div>
        </div>
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
            title={INBOX_TEXTS.dueTodaySection}
            tasks={dueToday}
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
