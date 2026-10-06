import { Droppable } from '@hello-pangea/dnd'
import { type BoardColumnKey } from '@/lib/board'
import { BoardCard } from './BoardCard'
import type { Database } from '@/types/database.types'
import { IconLayout } from '@/lib/icons'

type Task = Database['public']['Tables']['tasks']['Row']

type BoardColumnProps = {
  column: BoardColumnKey
  label: string
  tasks: Task[]
  projectPrefixById: Map<string, string>
}

export function BoardColumn({
  column,
  label,
  tasks,
  projectPrefixById,
}: BoardColumnProps) {
  return (
    <div className="flex flex-1 min-w-0 flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <span className="font-heading text-xl text-[--text-primary]">
          {label}
        </span>
        <span className="flex size-6 items-center justify-center rounded-md border border-(--border-card-empty) bg-(--bg-card-empty) text-xs text-(--text-muted)">
          {tasks.length}
        </span>
      </div>

      <Droppable droppableId={column}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex min-h-16 flex-col gap-1"
          >
            {tasks.length === 0 && (
              <div className="flex h-21 flex-col items-center justify-center gap-1 rounded-md border border-(--border-card-empty) bg-(--bg-card-empty) px-2 text-xs text-(--text-muted)">
                <IconLayout size={24} aria-hidden="true" />
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
