import { INBOX_TEXTS } from '@/features/inbox/constants/texts'
import { countOverdue } from '@/features/inbox/lib/inboxDue'
import { buildInboxCounters } from '@/features/inbox/lib/inboxCounters'
import { hasLoadError, retryFailedQueries } from '@/shared/query/queryState'
import { useState } from 'react'
import { useInboxItems } from '@/features/inbox/hooks/useInboxItems'
import { useCompleteTask } from '@/features/inbox/hooks/useCompleteTask'
import { useActiveSprint } from '@/features/sprints/hooks/useActiveSprint'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { formatSprintBanner } from '@/features/sprints/lib/sprint'
import {
  formatDayMonth,
  formatWeekdayName,
  todayLocal,
} from '@/shared/lib/date'
import type { Task } from '@/features/tasks/model/task'

export function useInboxPage() {
  const inboxQuery = useInboxItems()
  const { data: inbox, isLoading } = inboxQuery
  const { data: activeSprint } = useActiveSprint()
  const { data: projects } = useProjects()
  const { mutate: completeTask } = useCompleteTask()
  const [registeringTask, setRegisteringTask] = useState<Task | null>(null)

  const urgent = inbox?.urgent ?? []
  const srsOverdue = inbox?.srsOverdue ?? []
  const dueByToday = inbox?.dueByToday ?? []
  const totalCount = urgent.length + srsOverdue.length + dueByToday.length

  return {
    isLoading,
    hasError: hasLoadError(inboxQuery),
    retry: () => retryFailedQueries(inboxQuery),
    urgent,
    srsOverdue,
    dueByToday,
    totalCount,
    isEmpty: totalCount === 0,
    counters: buildInboxCounters({
      dueByToday: dueByToday.length,
      overdue: countOverdue(dueByToday, todayLocal()),
      srsOverdue: srsOverdue.length,
      urgent: urgent.length,
    }),
    title: INBOX_TEXTS.titleWithDate(
      formatWeekdayName(new Date()),
      formatDayMonth(todayLocal()),
    ),
    sprintBanner: activeSprint ? formatSprintBanner(activeSprint) : null,
    projects: projects ?? [],
    hasProjects: (projects?.length ?? 0) > 0,
    completeTask,
    registeringTask,
    startRegistering: setRegisteringTask,
    stopRegistering: () => setRegisteringTask(null),
  }
}
