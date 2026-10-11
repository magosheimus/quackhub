import type { IconComponent } from '@/shared/lib/icons'
import {
  IconArrowBigDown,
  IconArrowBigUp,
  IconChevronUp,
} from '@/shared/lib/icons'
import type { Task, TaskPriority } from '@/shared/types/entities'

type PriorityConfig = {
  icon: IconComponent
  ariaLabel: string
  text: string
  className: string
  colorVar: string
}

export const PRIORITY_CONFIG: Record<TaskPriority, PriorityConfig> = {
  high: {
    icon: IconArrowBigUp,
    ariaLabel: 'Prioridade alta',
    text: 'ALTA',
    className: 'text-danger',
    colorVar: '--signal-danger',
  },
  medium: {
    icon: IconChevronUp,
    ariaLabel: 'Prioridade média',
    text: 'MÉDIA',
    className: 'text-fg-muted',
    colorVar: '--text-muted',
  },
  low: {
    icon: IconArrowBigDown,
    ariaLabel: 'Prioridade baixa',
    text: 'BAIXA',
    className: 'text-success',
    colorVar: '--signal-success',
  },
}

const PRIORITY_ORDER: Record<TaskPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
}

// Prioridade (alta primeiro) e, no empate, criação mais antiga primeiro
export function sortByPriorityThenDate(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    const priorityDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    if (priorityDiff !== 0) {
      return priorityDiff
    }
    return (a.created_at ?? '').localeCompare(b.created_at ?? '')
  })
}
