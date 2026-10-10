import type { IconComponent } from '@/shared/lib/icons'
import {
  IconArrowBigDown,
  IconArrowBigUp,
  IconChevronUp,
} from '@/shared/lib/icons'
import type { TaskPriority } from '@/shared/types/entities'

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
    className: 'text-(--signal-danger)',
    colorVar: '--signal-danger',
  },
  medium: {
    icon: IconChevronUp,
    ariaLabel: 'Prioridade média',
    text: 'MÉDIA',
    className: 'text-(--text-muted)',
    colorVar: '--text-muted',
  },
  low: {
    icon: IconArrowBigDown,
    ariaLabel: 'Prioridade baixa',
    text: 'BAIXA',
    className: 'text-(--signal-success)',
    colorVar: '--signal-success',
  },
}
