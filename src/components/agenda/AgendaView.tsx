import { useState } from 'react'
import { Marquee } from '@/components/ui/marquee'
import { useAgendaItems } from '@/hooks/agenda/useAgendaItems'
import { useCompleteTask } from '@/hooks/agenda/useCompleteTask'
import { useActiveSprint } from '@/hooks/sprints/useActiveSprint'
import { useProjects } from '@/hooks/projects/useProjects'
import { AgendaSection } from './AgendaSection'
import { RegisterPerformanceModal } from '@/components/srs/RegisterPerformanceModal'
import type { Database } from '@/types/database.types'
import { LoadingText } from '../ui/loading-text'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { CalendarCheck } from 'lucide-react'

type Task = Database['public']['Tables']['tasks']['Row']

export function AgendaView() {
  const { data: agenda, isLoading } = useAgendaItems()
  const { data: activeSprint } = useActiveSprint()
  const { data: projects } = useProjects()
  const { mutate: completeTask } = useCompleteTask()
  const [registeringTask, setRegisteringTask] = useState<Task | null>(null)

  if (isLoading) {
    return <LoadingText />
  }

  const urgent = agenda?.urgent ?? []
  const srsOverdue = agenda?.srsOverdue ?? []
  const dueToday = agenda?.dueToday ?? []
  const isEmpty =
    urgent.length === 0 && srsOverdue.length === 0 && dueToday.length === 0
  const todayLabel = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  })
    .format(new Date())
    .toUpperCase()

  return (
    <div className="flex flex-col gap-4">
      {activeSprint?.goal && <Marquee>{activeSprint.goal}</Marquee>}

      <div className="flex items-baseline gap-3">
        <span className="font-heading text-3xl text-(--text-primary)">
          HOJE
        </span>
        <span className="text-xs text-(--text-muted)">{todayLabel}</span>
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
          <CalendarCheck
            size={32}
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
          <AgendaSection
            title="Urgentes"
            tasks={urgent}
            projects={projects ?? []}
            onComplete={completeTask}
            onRegisterPerformance={setRegisteringTask}
          />
          <AgendaSection
            title="SRS vencido"
            tasks={srsOverdue}
            projects={projects ?? []}
            onComplete={completeTask}
            onRegisterPerformance={setRegisteringTask}
          />
          <AgendaSection
            title="Prazo hoje"
            tasks={dueToday}
            projects={projects ?? []}
            onComplete={completeTask}
            onRegisterPerformance={setRegisteringTask}
          />
        </>
      )}

      {registeringTask && (
        <RegisterPerformanceModal
          task={registeringTask}
          open={registeringTask !== null}
          onOpenChange={(open) => !open && setRegisteringTask(null)}
        />
      )}
    </div>
  )
}
