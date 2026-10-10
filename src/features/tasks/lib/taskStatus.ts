import { isTaskStatus } from '@/shared/lib/enums'
import type { ProjectType, TaskStatus } from '@/shared/types/entities'

export const STATUS_LABELS: Record<TaskStatus, string> = {
  to_study: 'A ESTUDAR',
  todo: 'A FAZER',
  doing: 'FAZENDO',
  studying: 'ESTUDANDO',
  to_review: 'A REVISAR',
  blocked: 'IMPEDIDO',
  scheduled: 'AGENDADO',
  done: 'FINALIZADO',
}

export const STATUS_BADGE_CLASS: Record<TaskStatus, string> = {
  to_study: 'bg-(--text-muted)',
  todo: 'bg-(--signal-warning)',
  scheduled: 'bg-(--text-muted)',
  doing: 'bg-(--accent)',
  studying: 'bg-(--accent)',
  to_review: 'bg-(--accent)',
  blocked: 'bg-(--signal-danger)',
  done: 'bg-(--signal-success)',
}

// Para valores que chegam como texto livre (ex.: histórico de movimentação)
export function getStatusLabel(value: string | null | undefined): string {
  if (isTaskStatus(value)) {
    return STATUS_LABELS[value]
  }
  return value ?? ''
}

export function getInitialStatusForType(type: ProjectType): TaskStatus {
  return type === 'study' ? 'to_study' : 'todo'
}
