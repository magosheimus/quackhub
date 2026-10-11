import { IconInbox, IconCalendar } from '@/shared/lib/icons'
import { Marquee } from '@/components/ui/marquee'
import { useInboxPage } from '@/features/inbox/hooks/useInboxPage'
import { InboxSection } from '@/features/inbox/components/InboxSection'
import { RegisterPerformanceModal } from '@/features/srs/components/RegisterPerformanceModal'
import { LoadingText } from '@/components/ui/loading-text'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { PageTitle } from '@/components/ui/page-title'

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
        <PageTitle title="Inbox" icon={IconInbox} count={totalCount} />
        <span className="pl-4 text-xs text-(--text-muted)">{todayLabel}</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { value: dueToday.length, label: 'tarefas' },
          { value: srsOverdue.length, label: 'revisões' },
          { value: urgent.length, label: 'urgentes' },
        ].map((counter) => (
          <div
            key={counter.label}
            className="flex flex-col gap-1 rounded-md border border-border bg-(--bg-card) px-4 py-3"
          >
            <span className="font-heading text-3xl text-(--text-primary)">
              {counter.value}
            </span>
            <span className="text-xs text-(--text-muted)">{counter.label}</span>
          </div>
        ))}
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center gap-4 rounded-md border border-(--bg-surface) bg-(--bg-page) px-6 py-12 text-center">
          <IconCalendar
            size={24}
            aria-hidden="true"
            className="text-(--text-muted)"
          />
          <div className="flex flex-col gap-1">
            <span className="font-heading text-2xl text-(--text-primary)">
              Sem pendências para hoje
            </span>
            <span className="text-sm text-(--text-muted)">
              Use o board ou o Backlog para planejar.
            </span>
          </div>
          <div className="flex gap-3 pt-2">
            <Link
              to="/board"
              className={buttonVariants({ variant: 'outline', size: 'sm' })}
            >
              Sprint atual
            </Link>
            <Link
              to="/backlog"
              className={buttonVariants({ variant: 'outline', size: 'sm' })}
            >
              Ir para o Backlog
            </Link>
          </div>
        </div>
      ) : (
        <>
          <InboxSection
            title="Urgentes"
            tasks={urgent}
            projects={projects}
            onComplete={completeTask}
            onRegisterPerformance={startRegistering}
          />
          <InboxSection
            title="SRS vencido"
            tasks={srsOverdue}
            projects={projects}
            onComplete={completeTask}
            onRegisterPerformance={startRegistering}
          />
          <InboxSection
            title="Prazo hoje"
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
