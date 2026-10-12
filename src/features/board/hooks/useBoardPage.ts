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
} from '@/features/board/lib/board'
import { todayLocal } from '@/shared/lib/date'
import type { ProjectType } from '@/shared/types/entities'

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
  const { data: taskTagsMap } = useBulkTaskTags((tasks ?? []).map((t) => t.id))

  const sprintTasks = tasks ?? []
  const project = projectId
    ? (projects?.find((p) => p.id === projectId) ?? null)
    : null
  const plannedSprint = sprints?.find((s) => s.status === 'planned') ?? null

  const projectPrefixById = new Map(
    projects?.map((p) => [p.id, p.prefix ?? '']),
  )
  const projectTypeById = new Map<string, ProjectType>(
    projects?.map((p) => [p.id, p.type]),
  )
  const labelScope = getLabelScope(filters.projectIds, projectTypeById)

  const visibleTasks = applyBoardFilters(
    sprintTasks,
    filters,
    taskTagsMap ?? new Map(),
    todayLocal(),
  )
  const tasksByColumn = groupTasksByColumn(visibleTasks)
  const columns = BOARD_COLUMNS.map((column) => ({
    key: column,
    label: getBoardColumnLabel(column, labelScope),
    tasks: tasksByColumn[column],
  }))

  function handleDragEnd(result: DropResult) {
    const { destination, draggableId } = result
    if (!activeSprint || !destination) {
      return
    }
    if (!isBoardColumnKey(destination.droppableId)) {
      return
    }

    const task = sprintTasks.find((t) => t.id === draggableId)
    const taskType = task ? projectTypeById.get(task.project_id) : undefined
    if (!taskType) {
      return
    }

    const status = getStatusForColumn(destination.droppableId, taskType)
    if (!status) {
      return
    }
    updateTaskStatus({ id: draggableId, status, sprintId: activeSprint.id })
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
    projectPrefixById,
    filters,
    updateFilter,
    sprintProjects: getProjectsInTasks(projects ?? [], sprintTasks),
    sprintEpics: getEpicsInTasks(epics ?? [], sprintTasks),
    visibleTasks,
    columns,
    handleDragEnd,
  }
}
