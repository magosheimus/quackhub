import { IconInbox, IconCalendar } from '@/shared/lib/icons'
import { Marquee } from '@/components/ui/marquee'
import { useInboxPage } from '@/features/inbox/hooks/useInboxPage'
import { InboxSection } from '@/features/inbox/components/InboxSection'
import { RegisterPerformanceModal } from '@/features/srs/components/RegisterPerformanceModal'
import { LoadingText } from '@/components/ui/loading-text'
import { PageTitle } from '@/components/ui/page-title'
import { INBOX_TEXTS } from '@/features/inbox/constants/texts'
import { Panel } from '@/components/ui/panel'
import { EmptyState } from '@/components/ui/empty-state'

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
        <span className="pl-4 text-caption">{todayLabel}</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { value: dueToday.length, label: INBOX_TEXTS.tasksCounter },
          { value: srsOverdue.length, label: INBOX_TEXTS.reviewsCounter },
          { value: urgent.length, label: INBOX_TEXTS.urgentCounter },
        ].map((counter) => (
          <Panel key={counter.label} className="flex flex-col gap-1 px-4 py-3">
            <span className="font-heading text-3xl text-fg">
              {counter.value}
            </span>
            <span className="text-caption">{counter.label}</span>
          </Panel>
        ))}
      </div>

      {isEmpty ? (
        <EmptyState
          icon={IconCalendar}
          title={INBOX_TEXTS.emptyTitle}
          description={INBOX_TEXTS.emptyDescription}
        >
          {/* os mesmos dois Links/botões que já estão lá dentro */}
        </EmptyState>
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
