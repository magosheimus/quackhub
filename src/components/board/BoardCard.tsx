import { Draggable } from '@hello-pangea/dnd'
import { Flag, ArrowUp, Minus, ArrowDown, type LucideIcon } from 'lucide-react'
import type { TaskPriority } from '@/lib/board'
import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']

const PRIORITY_CONFIG: Record<
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

type BoardCardProps = {
  task: Task
  index: number
  projectPrefix: string
}

export function BoardCard({ task, index, projectPrefix }: BoardCardProps) {
  const priority = PRIORITY_CONFIG[task.priority as TaskPriority]
  const PriorityIcon = priority.icon

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            borderLeftColor: `var(${priority.colorVar})`,
          }}
          className={`flex gap-2 rounded-[--radius-md] border border-l-4  border-[--border] bg-[--bg-card] p-3 text-sm ${
            snapshot.isDragging ? 'bg-[--bg-card-hover]' : ''
          }`}
        >
          <div className="flex w-4 shrink-0 flex-col items-center gap-1 pt-0.5">
            {task.flagged && (
              <Flag
                size={14}
                className="text-[--signal-danger]"
                aria-label="Urgente"
              />
            )}
            <PriorityIcon
              size={14}
              className={priority.className}
              aria-label={priority.ariaLabel}
            />
          </div>

          <div className="flex flex-col gap-1">
            {task.task_number && (
              <span className="text-xs text-[--text-muted]">
                {projectPrefix}-{task.task_number}
              </span>
            )}
            <span className="line-clamp-3 text-[--text-primary]">
              {task.title}
            </span>
            <span className="text-xs text-[--text-muted]">{priority.text}</span>
          </div>
        </div>
      )}
    </Draggable>
  )
}
