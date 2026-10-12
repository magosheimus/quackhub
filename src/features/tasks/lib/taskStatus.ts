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
  to_study: 'bg-fg-muted',
  todo: 'bg-warning',
  scheduled: 'bg-fg-muted',
  doing: 'bg-accent',
  studying: 'bg-accent',
  to_review: 'bg-accent',
  blocked: 'bg-danger',
  done: 'bg-success',
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

const STATUS_OPTIONS: Record<ProjectType, TaskStatus[]> = {
  study: ['to_study', 'studying', 'to_review', 'blocked', 'done'],
  general: ['todo', 'doing', 'blocked', 'done'],
}

export function getStatusOptions(
  type: ProjectType | null | undefined,
): TaskStatus[] {
  return STATUS_OPTIONS[type ?? 'general']
}
