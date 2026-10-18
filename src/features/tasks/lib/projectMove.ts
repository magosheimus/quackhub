import {
  getInitialStatusForType,
  getStatusOptions,
} from '@/features/tasks/lib/taskStatus'
import type { Project } from '@/shared/types/entities'
import type { Task, TaskUpdate } from '@/features/tasks/model/task'

export function buildProjectMove(
  task: Pick<Task, 'status'>,
  target: Pick<Project, 'id' | 'type'>,
): TaskUpdate {
  const keepsStatus = getStatusOptions(target.type).includes(task.status)
  return {
    projectId: target.id,
    epicId: null,
    status: keepsStatus ? task.status : getInitialStatusForType(target.type),
  }
}
