import { useState } from 'react'
import { Marquee } from '@/components/ui/marquee'
import { useAgendaItems } from '@/hooks/agenda/useAgendaItems'
import { useCompleteTask } from '@/hooks/agenda/useCompleteTask'
import { useActiveSprint } from '@/hooks/sprints/useActiveSprint'
import { useProjects } from '@/hooks/projects/useProjects'
import { AgendaSection } from './AgendaSection'
import { RegisterPerformanceModal } from '@/components/srs/RegisterPerformanceModal'
import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']

export function AgendaView() {
  const { data: agenda, isLoading } = useAgendaItems()
  const { data: activeSprint } = useActiveSprint()
  const { data: projects } = useProjects()
  const { mutate: completeTask } = useCompleteTask()
  const [registeringTask, setRegisteringTask] = useState<Task | null>(null)

  if (isLoading) {
    return (
      <div className="text-sm text-[--text-muted]">[ CARREGANDO........ ]</div>
    )
  }

  const urgent = agenda?.urgent ?? []
  const srsOverdue = agenda?.srsOverdue ?? []
  const dueToday = agenda?.dueToday ?? []
  const isEmpty =
    urgent.length === 0 && srsOverdue.length === 0 && dueToday.length === 0

  return (
    <div className="flex flex-col gap-4">
      {activeSprint?.goal && <Marquee>{activeSprint.goal}</Marquee>}

      <div className="flex gap-6 font-heading text-2xl text-[--text-primary]">
        <span>HOJE</span>
        <span>{dueToday.length} tarefas</span>
        <span>{srsOverdue.length} revisões</span>
        <span>{urgent.length} urgentes</span>
      </div>

      {isEmpty ? (
        <div className="text-sm text-[--text-muted]">
          — Sem pendências para hoje. —
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
