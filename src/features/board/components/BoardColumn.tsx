import { Droppable } from '@hello-pangea/dnd'
import {
  type BoardColumnKey,
  type MoveOption,
} from '@/features/board/lib/board'
import { BoardCard } from './BoardCard'
import { UrgentDropZone } from './UrgentDropZone'
import { IconLayout } from '@/shared/lib/icons'
import type { Task } from '@/features/tasks/model/task'
import { BOARD_TEXTS } from '@/features/board/constants/texts'
import type { ProjectLabels } from '@/features/projects/lib/project'

type BoardColumnProps = {
  column: BoardColumnKey
  label: string
  tasks: Task[]
  showUrgentZone: boolean
  projectLabels: ProjectLabels
  getMoveOptions: (task: Task) => MoveOption[]
  onMove: (taskId: string, column: BoardColumnKey) => void
}

export function BoardColumn({
  column,
  label,
  tasks,
  showUrgentZone,
  projectLabels,
  getMoveOptions,
  onMove,
}: BoardColumnProps) {
  return (
    <div className="flex w-[78vw] max-w-72 shrink-0 snap-start flex-col gap-2 lg:w-auto lg:max-w-none lg:min-w-0 lg:flex-1 lg:shrink">
      <div className="page-backdrop sticky top-0 z-10 flex items-center justify-between px-1 py-1">
        {showUrgentZone && <UrgentDropZone column={column} />}
        <span className="font-heading text-heading-3 text-fg">{label}</span>
        <span className="flex size-6 items-center justify-center rounded-md border border-(--border-card-empty) bg-card-empty text-caption">
          {tasks.length}
        </span>
      </div>

      <Droppable droppableId={column}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex min-h-16 flex-1 flex-col gap-1"
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
                projectLabels={projectLabels}
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
