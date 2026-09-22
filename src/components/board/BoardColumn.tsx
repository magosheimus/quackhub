import { Droppable } from '@hello-pangea/dnd'
import { COLUMN_LABELS, type TaskStatus } from '@/lib/board'
import { BoardCard } from './BoardCard'
import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']

type BoardColumnProps = {
  status: TaskStatus
  tasks: Task[]
  projectPrefix: string
}

export function BoardColumn({
  status,
  tasks,
  projectPrefix,
}: BoardColumnProps) {
  return (
    <div className="flex flex-1 min-w-0 flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <span className="font-heading text-lg text-[--text-primary]">
          {COLUMN_LABELS[status]}
        </span>
        <span className="text-xs text-[--text-muted]">{tasks.length}</span>
      </div>

      <Droppable droppableId={status}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex min-h-16 flex-col gap-1"
          >
            {tasks.length === 0 && (
              <div className="px-1 text-xs text-[--text-muted]">
                — nenhum card nesta coluna —
              </div>
            )}
            {tasks.map((task, index) => (
              <BoardCard
                key={task.id}
                task={task}
                index={index}
                projectPrefix={projectPrefix}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
