import { Droppable } from '@hello-pangea/dnd'
import {
  type BoardColumnKey,
  type MoveOption,
} from '@/features/board/lib/board'
import { BoardCard } from './BoardCard'
import { IconLayout } from '@/shared/lib/icons'
import type { Task } from '@/shared/types/entities'
import { BOARD_TEXTS } from '@/features/board/constants/texts'

type BoardColumnProps = {
  column: BoardColumnKey
  label: string
  tasks: Task[]
  projectPrefixById: Map<string, string>
  getMoveOptions: (task: Task) => MoveOption[]
  onMove: (taskId: string, column: BoardColumnKey) => void
}

export function BoardColumn({
  column,
  label,
  tasks,
  projectPrefixById,
  getMoveOptions,
  onMove,
}: BoardColumnProps) {
  return (
    <div className="flex w-[78vw] max-w-72 shrink-0 snap-start flex-col gap-2 lg:w-auto lg:max-w-none lg:min-w-0 lg:flex-1 lg:shrink">
      <div className="flex items-center justify-between px-1">
        <span className="font-heading text-xl text-fg">{label}</span>
        <span className="flex size-6 items-center justify-center rounded-md border border-(--border-card-empty) bg-card-empty text-caption">
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
              <div className="flex h-21 flex-col items-center justify-center gap-1 rounded-md border border-(--border-card-empty) bg-card-empty px-2 text-caption">
                <IconLayout size={24} aria-hidden="true" />
                <span className="whitespace-nowrap">
                  {BOARD_TEXTS.emptyColumn}
                </span>
              </div>
            )}
            {tasks.map((task, index) => (
              <BoardCard
                key={task.id}
                task={task}
                index={index}
                projectPrefixById={projectPrefixById}
                moveOptions={getMoveOptions(task)}
                onMove={(target) => onMove(task.id, target)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
