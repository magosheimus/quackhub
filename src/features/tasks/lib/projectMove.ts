import {
  getInitialStatusForType,
  getStatusOptions,
} from '@/features/tasks/lib/taskStatus'
import type { Project, Task, TaskUpdate } from '@/shared/types/entities'

export function buildProjectMove(
  task: Pick<Task, 'status'>,
  target: Pick<Project, 'id' | 'type'>,
): TaskUpdate {
  const keepsStatus = getStatusOptions(target.type).includes(task.status)
  return {
    project_id: target.id,
    epic_id: null,
    status: keepsStatus ? task.status : getInitialStatusForType(target.type),
  }
}
