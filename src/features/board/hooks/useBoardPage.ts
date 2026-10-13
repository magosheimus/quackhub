import { hasLoadError, retryFailedQueries } from '@/shared/query/queryState'
import type { DropResult } from '@hello-pangea/dnd'
import { useSearchParams } from 'react-router-dom'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { useTasksByProjectId } from '@/features/projects/hooks/useTasksByProjectId'
import { useActiveSprint } from '@/features/sprints/hooks/useActiveSprint'
import { useSprints } from '@/features/sprints/hooks/useSprints'
import { useTasksBySprintId } from '@/features/tasks/hooks/sprint/useTasksBySprintId'
import { useUpdateTaskStatus } from '@/features/tasks/hooks/sprint/useUpdateTaskStatus'
import { useBulkTaskTags } from '@/features/tasks/hooks/tags/useBulkTaskTags'
import { useAllEpics } from '@/features/epics/hooks/useAllEpics'
import { useBoardFilters } from '@/features/board/hooks/useBoardFilters'
import {
  BOARD_COLUMNS,
  applyBoardFilters,
  getBoardColumnLabel,
  getEpicsInTasks,
  getLabelScope,
  getProjectsInTasks,
  getStatusForColumn,
  groupTasksByColumn,
  isBoardColumnKey,
  getMoveOptions,
  type BoardColumnKey,
  type MoveOption,
} from '@/features/board/lib/board'
import { todayLocal } from '@/shared/lib/date'
import type { ProjectType, Task } from '@/shared/types/entities'
import {
  buildProjectLabels,
  buildProjectOptions,
} from '@/features/projects/lib/project'
import { buildEpicOptions } from '@/features/epics/lib/epic'

export function useBoardPage() {
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('project')

  const projectsQuery = useProjects()
  const activeSprintQuery = useActiveSprint()
  const { data: projects, isLoading: isLoadingProjects } = projectsQuery
  const { data: sprints } = useSprints()
  const { data: activeSprint, isLoading: isLoadingSprint } = activeSprintQuery
  const tasksQuery = useTasksBySprintId(activeSprint?.id ?? '')
  const { data: tasks, isLoading: isLoadingTasks } = tasksQuery
  const { data: projectTasks } = useTasksByProjectId(projectId)
  const { mutate: updateTaskStatus } = useUpdateTaskStatus()
  const { data: epics } = useAllEpics()
  const { filters, updateFilter } = useBoardFilters()
  const { data: tagsByTask } = useBulkTaskTags((tasks ?? []).map((t) => t.id))

  const sprintTasks = tasks ?? []
  const project = projectId
    ? (projects?.find((p) => p.id === projectId) ?? null)
    : null
  const plannedSprint = sprints?.find((s) => s.status === 'planned') ?? null

  const projectLabels = buildProjectLabels(projects ?? [])
  const projectTypeById = new Map<string, ProjectType>(
    projects?.map((p) => [p.id, p.type]),
  )
  const labelScope = getLabelScope(filters.projectIds, projectTypeById)

  const visibleTasks = applyBoardFilters(
    sprintTasks,
    filters,
    tagsByTask ?? {},
    todayLocal(),
  )
  const tasksByColumn = groupTasksByColumn(visibleTasks)
  const columns = BOARD_COLUMNS.map((column) => ({
    key: column,
    label: getBoardColumnLabel(column, labelScope),
    tasks: tasksByColumn[column],
  }))

  function moveTask(taskId: string, column: BoardColumnKey) {
    if (!activeSprint) {
      return
    }
    const task = sprintTasks.find((t) => t.id === taskId)
    const taskType = task ? projectTypeById.get(task.project_id) : undefined
    if (!taskType) {
      return
    }
    const status = getStatusForColumn(column, taskType)
    if (!status) {
      return
    }
    updateTaskStatus({ id: taskId, status, sprintId: activeSprint.id })
  }

  function handleDragEnd(result: DropResult) {
    const { destination, draggableId } = result
    if (!destination || !isBoardColumnKey(destination.droppableId)) {
      return
    }
    moveTask(draggableId, destination.droppableId)
  }

  function getMoveOptionsFor(task: Task): MoveOption[] {
    const taskType = projectTypeById.get(task.project_id)
    return taskType ? getMoveOptions(task.status, taskType) : []
  }

  return {
    isLoading: isLoadingProjects || isLoadingSprint,
    isLoadingTasks,
    hasError: hasLoadError(projectsQuery, activeSprintQuery, tasksQuery),
    retry: () =>
      retryFailedQueries(projectsQuery, activeSprintQuery, tasksQuery),
    project,
    projectTasks: projectTasks ?? [],
    activeSprint: activeSprint ?? null,
    plannedSprint,
    projectLabels,
    filters,
    updateFilter,
    sprintProjects: buildProjectOptions(
      getProjectsInTasks(projects ?? [], sprintTasks),
    ),
    sprintEpics: buildEpicOptions(getEpicsInTasks(epics ?? [], sprintTasks)),
    visibleTasks,
    columns,
    handleDragEnd,
    moveTask,
    getMoveOptionsFor,
  }
}
