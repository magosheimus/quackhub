import { useState } from 'react'
import { useInboxItems } from '@/features/inbox/hooks/useInboxItems'
import { useCompleteTask } from '@/features/inbox/hooks/useCompleteTask'
import { useActiveSprint } from '@/features/sprints/hooks/useActiveSprint'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { formatSprintBanner } from '@/features/sprints/lib/sprint'
import { formatWeekdayShort } from '@/shared/lib/date'
import type { Task } from '@/shared/types/entities'

export function useInboxPage() {
  const { data: inbox, isLoading } = useInboxItems()
  const { data: activeSprint } = useActiveSprint()
  const { data: projects } = useProjects()
  const { mutate: completeTask } = useCompleteTask()
  const [registeringTask, setRegisteringTask] = useState<Task | null>(null)

  const urgent = inbox?.urgent ?? []
  const srsOverdue = inbox?.srsOverdue ?? []
  const dueToday = inbox?.dueToday ?? []
  const totalCount = urgent.length + srsOverdue.length + dueToday.length

  return {
    isLoading,
    urgent,
    srsOverdue,
    dueToday,
    totalCount,
    isEmpty: totalCount === 0,
    todayLabel: formatWeekdayShort(new Date()),
    sprintBanner: activeSprint ? formatSprintBanner(activeSprint) : null,
    projects: projects ?? [],
    hasProjects: (projects?.length ?? 0) > 0,
    completeTask,
    registeringTask,
    startRegistering: setRegisteringTask,
    stopRegistering: () => setRegisteringTask(null),
  }
}
