import type { DropResult } from '@hello-pangea/dnd'
import { useEpics } from '@/features/epics/hooks/useEpics'
import { useMoveTaskToEpic } from '@/features/tasks/hooks/useMoveTaskToEpic'
import {
  getEpicIdForColumn,
  getProjectBucket,
  groupOpenTasksByEpic,
} from '@/features/board/lib/projectBoard'
import type { MoveOption } from '@/features/board/lib/board'
import { BOARD_TEXTS } from '@/features/board/constants/texts'
import { NEUTRAL_COLOR } from '@/shared/lib/palette'
import { toEpicLabel } from '@/features/epics/lib/epic'
import type { Task } from '@/shared/types/entities'

export type EpicColumnItem = {
  task: Task
  tag: string | undefined
}

export type EpicColumnView = {
  id: string
  title: string
  color: string
  items: EpicColumnItem[]
  progressLabel: string
  progressPercent: number
}

type UseProjectEpicsViewArgs = {
  projectId: string
  tasks: Task[]
  activeSprintId: string | null
}

export function useProjectEpicsView({
  projectId,
  tasks,
  activeSprintId,
}: UseProjectEpicsViewArgs) {
  const { data: epics, isLoading } = useEpics(projectId)
  const { mutate: moveTaskToEpic } = useMoveTaskToEpic(projectId)

  const columns: EpicColumnView[] = groupOpenTasksByEpic(
    tasks,
    epics ?? [],
    activeSprintId,
  ).map((column) => ({
    id: column.id,
    title: column.epic?.name ?? BOARD_TEXTS.noEpic,
    color: column.epic ? toEpicLabel(column.epic).color : NEUTRAL_COLOR,
    items: column.tasks.map((task) => ({
      task,
      tag:
        getProjectBucket(task, activeSprintId) === 'sprint'
          ? BOARD_TEXTS.inSprint
          : undefined,
    })),
    progressLabel: BOARD_TEXTS.epicProgress(
      column.doneCount,
      column.totalCount,
    ),
    progressPercent:
      column.totalCount === 0
        ? 0
        : Math.round((column.doneCount / column.totalCount) * 100),
  }))

  function moveTask(taskId: string, columnId: string) {
    moveTaskToEpic({ taskId, epicId: getEpicIdForColumn(columnId) })
  }

  function getMoveOptions(columnId: string): MoveOption<string>[] {
    return columns
      .filter((column) => column.id !== columnId)
      .map((column) => ({ column: column.id, label: column.title }))
  }

  function handleDragEnd({ source, destination, draggableId }: DropResult) {
    if (!destination || destination.droppableId === source.droppableId) {
      return
    }
    moveTask(draggableId, destination.droppableId)
  }

  return { isLoading, columns, moveTask, getMoveOptions, handleDragEnd }
}
