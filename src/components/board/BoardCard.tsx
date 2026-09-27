import { Draggable } from '@hello-pangea/dnd'
import { Flag } from 'lucide-react'
import { PRIORITY_CONFIG, type TaskPriority } from '@/lib/board'
import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']

type BoardCardProps = {
  task: Task
  index: number
  projectPrefixById: Map<string, string>
}

export function BoardCard({ task, index, projectPrefixById }: BoardCardProps) {
  const priority = PRIORITY_CONFIG[task.priority as TaskPriority]
  const PriorityIcon = priority.icon
  const projectPrefix = projectPrefixById.get(task.project_id) ?? ''

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
