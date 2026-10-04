import { Droppable } from '@hello-pangea/dnd'
import { COLUMN_LABELS, type TaskStatus } from '@/lib/board'
import { BoardCard } from './BoardCard'
import type { Database } from '@/types/database.types'
import { Layers } from 'lucide-react'

type Task = Database['public']['Tables']['tasks']['Row']

type BoardColumnProps = {
  status: TaskStatus
  tasks: Task[]
  projectPrefixById: Map<string, string>
}

export function BoardColumn({
  status,
  tasks,
  projectPrefixById,
}: BoardColumnProps) {
  return (
    <div className="flex flex-1 min-w-0 flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <span className="font-heading text-xl text-[--text-primary]">
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
              <div className="flex h-21 flex-col items-center justify-center gap-1 rounded-md border border-(--bg-surface) bg-(--bg-page) px-2 text-xs text-(--text-muted)">
                <Layers size={18} aria-hidden="true" />
                <span className="whitespace-nowrap">— vazio —</span>
              </div>
            )}
            {tasks.map((task, index) => (
              <BoardCard
                key={task.id}
                task={task}
                index={index}
                projectPrefixById={projectPrefixById}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
