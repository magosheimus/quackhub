import type { ProjectType } from '@/lib/project'

export const COLUMNS_GENERAL = ['todo', 'blocked', 'doing', 'done']
export const COLUMNS_STUDY = [
  'to_study',
  'blocked',
  'studying',
  'to_review',
  'done',
]

export const COLUMN_LABELS: Record<string, string> = {
  to_study: 'A ESTUDAR',
  todo: 'A FAZER',
  doing: 'FAZENDO',
  studying: 'ESTUDANDO',
  to_review: 'A REVISAR',
  blocked: 'IMPEDIDO',
  done: 'FINALIZADO',
}

export function getColumnsForType(type: ProjectType): string[] {
  const columns: Record<ProjectType, string[]> = {
    general: COLUMNS_GENERAL,
    study: COLUMNS_STUDY,
  }
  return columns[type]
}

export type TaskStatus =
  | 'to_study'
  | 'studying'
  | 'agendado'
  | 'to_review'
  | 'todo'
  | 'doing'
  | 'blocked'
  | 'done'

export type TaskPriority = 'alta' | 'média' | 'baixa'
