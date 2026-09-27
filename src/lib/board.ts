import type { ProjectType } from '@/lib/project'
import { ArrowUp, Minus, ArrowDown, type LucideIcon } from 'lucide-react'

export const COLUMNS_GENERAL = ['todo', 'blocked', 'doing', 'done']
export const COLUMNS_STUDY = [
  'to_study',
  'blocked',
  'studying',
  'to_review',
  'done',
]
export const ALL_COLUMNS = [
  'to_study',
  'todo',
  'studying',
  'doing',
  'to_review',
  'blocked',
  'done',
]
export const COLUMN_LABELS: Record<string, string> = {
  to_study: 'A ESTUDAR',
  todo: 'A FAZER',
  doing: 'FAZENDO',
  studying: 'ESTUDANDO',
  to_review: 'A REVISAR',
  blocked: 'IMPEDIDO',
  scheduled: 'AGENDADO',
  done: 'FINALIZADO',
}

export function getColumnsForType(type: ProjectType | null): string[] {
  if (!type) return ALL_COLUMNS
  const columns: Record<ProjectType, string[]> = {
    general: COLUMNS_GENERAL,
    study: COLUMNS_STUDY,
  }
  return columns[type]
}

export type TaskStatus =
  | 'to_study'
  | 'studying'
  | 'scheduled'
  | 'to_review'
  | 'todo'
  | 'doing'
  | 'blocked'
  | 'done'

export type TaskPriority = 'alta' | 'média' | 'baixa'

export const PRIORITY_CONFIG: Record<
  TaskPriority,
  {
    icon: LucideIcon
    ariaLabel: string
    text: string
    className: string
    colorVar: string
  }
> = {
  alta: {
    icon: ArrowUp,
    ariaLabel: 'Prioridade alta',
    text: 'ALTA',
    className: 'text-[--signal-danger]',
    colorVar: '--signal-danger',
  },
  média: {
    icon: Minus,
    ariaLabel: 'Prioridade média',
    text: 'MÉDIA',
    className: 'text-[--text-muted]',
    colorVar: '--text-muted',
  },
  baixa: {
    icon: ArrowDown,
    ariaLabel: 'Prioridade baixa',
    text: 'BAIXA',
    className: 'text-[--signal-success]',
    colorVar: '--signal-success',
  },
}

export function getInitialStatusForType(type: ProjectType): TaskStatus {
  return type === 'study' ? 'to_study' : 'todo'
}
