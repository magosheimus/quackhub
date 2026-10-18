import { useBacklogTasks } from '@/features/tasks/hooks/useBacklogTasks'
import { findDueCandidates } from '@/features/sprints/lib/sprint'
import { useToggleSet } from '@/shared/hooks/useToggleSet'
import type { Task } from '@/features/tasks/model/task'

// Cards do período vêm marcados (o usuário desmarca); atrasados vêm desmarcados
export function useSprintDueCandidates(startDate: string, endDate: string) {
  const { data: tasks = [] } = useBacklogTasks()
  const { inPeriod, overdue } = findDueCandidates(tasks, startDate, endDate)
  const unchecked = useToggleSet<string>()
  const checkedOverdue = useToggleSet<string>()

  function isSelected(task: Task): boolean {
    return inPeriod.some((item) => item.id === task.id)
      ? !unchecked.has(task.id)
      : checkedOverdue.has(task.id)
  }

  function toggle(task: Task) {
    if (inPeriod.some((item) => item.id === task.id)) {
      unchecked.toggle(task.id)
      return
    }
    checkedOverdue.toggle(task.id)
  }

  return {
    inPeriod,
    overdue,
    isSelected,
    toggle,
    selectedTasks: [...inPeriod, ...overdue].filter(isSelected),
    reset: () => {
      unchecked.clear()
      checkedOverdue.clear()
    },
  }
}
