import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import { BoardCard } from './BoardCard'
import { ColorDot } from '@/components/ui/color-dot'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { LoadingText } from '@/components/ui/loading-text'
import { SegmentedProgress } from '@/components/ui/segmented-progress'
import {
  useProjectEpicsView,
  type EpicColumnView,
} from '@/features/board/hooks/useProjectEpicsView'
import type { MoveOption } from '@/features/board/lib/board'
import type { Task } from '@/features/tasks/model/task'
import { BOARD_TEXTS } from '@/features/board/constants/texts'
import { IconBulletlist, IconPlus } from '@/shared/lib/icons'
import type { ProjectLabels } from '@/features/projects/lib/project'

type ProjectEpicsViewProps = {
  projectId: string
  onAddEpic: () => void
  activeSprintId: string | null
  tasks: Task[]
  projectLabels: ProjectLabels
}

type EpicColumnProps = {
  column: EpicColumnView
  projectLabels: ProjectLabels
  moveOptions: MoveOption<string>[]
  onMove: (taskId: string, columnId: string) => void
}

function EpicColumn({
  column,
  projectLabels,
  moveOptions,
  onMove,
}: EpicColumnProps) {
  return (
    <div className="flex w-[78vw] max-w-72 shrink-0 snap-start flex-col gap-2 lg:w-72">
      <div className="flex flex-col gap-1.5 px-1">
        <div className="flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-2">
            <ColorDot color={column.color} className="size-3" />
            <span className="truncate font-heading text-xl text-fg">
              {column.title}
            </span>
          </span>
          <span className="text-caption">{column.items.length}</span>
        </div>
        <SegmentedProgress
          value={column.progressPercent}
          segments={10}
          label={BOARD_TEXTS.epicProgressOf(column.title)}
        />
        <span className="text-caption">{column.progressLabel}</span>
      </div>

      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex min-h-16 flex-col gap-1"
          >
            {column.items.length === 0 && (
              <span className="px-1 text-caption">
                {BOARD_TEXTS.nothingPending}
              </span>
            )}
            {column.items.map(({ task, tag }, index) => (
              <BoardCard
                key={task.id}
                task={task}
                index={index}
                projectLabels={projectLabels}
                colorScope="epic"
                showEpic={false}
                tag={tag}
                moveOptions={moveOptions}
                onMove={(columnId) => onMove(task.id, columnId)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}

export function ProjectEpicsView({
  projectId,
  onAddEpic,
  activeSprintId,
  tasks,
  projectLabels,
}: ProjectEpicsViewProps) {
  const { isLoading, columns, moveTask, getMoveOptions, handleDragEnd } =
    useProjectEpicsView({ projectId, tasks, activeSprintId })

  if (isLoading) {
    return <LoadingText />
  }

  if (columns.length === 0) {
    return (
      <EmptyState
        icon={IconBulletlist}
        title={BOARD_TEXTS.noEpicsTitle}
        description={BOARD_TEXTS.noEpicsDescription}
      >
        <Button type="button" onClick={onAddEpic}>
          <IconPlus size={12} aria-hidden="true" />
          {BOARD_TEXTS.addEpic}
        </Button>
      </EmptyState>
    )
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex snap-x gap-4 overflow-x-auto pb-2">
        {columns.map((column) => (
          <EpicColumn
            key={column.id}
            column={column}
            projectLabels={projectLabels}
            moveOptions={getMoveOptions(column.id)}
            onMove={moveTask}
          />
        ))}
      </div>
    </DragDropContext>
  )
}
