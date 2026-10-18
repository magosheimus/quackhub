import { hasLoadError, retryFailedQueries } from '@/shared/query/queryState'
import type { DropResult } from '@hello-pangea/dnd'
import { useSearchParams } from 'react-router-dom'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { useTasksByProjectId } from '@/features/projects/hooks/useTasksByProjectId'
import { useActiveSprint } from '@/features/sprints/hooks/useActiveSprint'
import { useSprints } from '@/features/sprints/hooks/useSprints'
import { useTasksBySprintId } from '@/features/tasks/hooks/sprint/useTasksBySprintId'
import { useUpdateTaskStatus } from '@/features/tasks/hooks/sprint/useUpdateTaskStatus'
import { useUpdateTask } from '@/features/tasks/hooks/useUpdateTask'
import { useBulkTaskTags } from '@/features/tasks/hooks/tags/useBulkTaskTags'
import { useAllEpics } from '@/features/epics/hooks/useAllEpics'
import { useBoardFilters } from '@/features/board/hooks/useBoardFilters'
import { useQuickFilterVisibility } from '@/features/board/hooks/useQuickFilterVisibility'
import { BOARD_TEXTS } from '@/features/board/constants/texts'
import {
  getVisibleBoardColumns,
  applyBoardFilters,
  getBoardColumnLabel,
  getEpicsInTasks,
  getLabelScope,
  getProjectsInTasks,
  getStatusForColumn,
  groupTasksByColumn,
  clearHiddenFilter,
  withoutHidden,
  type QuickFilterKind,
  type QuickFilterMenuGroup,
  shouldFlagOnDrop,
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
import { usePersonaOptions } from '@/features/personas/hooks/usePersonaOptions'
import { getPersonasInTasks } from '@/features/personas/lib/persona'

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
  const { mutate: updateTask } = useUpdateTask()
  const { data: epics } = useAllEpics()
  const personaOptions = usePersonaOptions()
  const { filters, updateFilter, setFilters } = useBoardFilters()
  const visibility = useQuickFilterVisibility()
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
  const columns = getVisibleBoardColumns(sprintTasks, projectTypeById).map(
    (column) => ({
      key: column,
      label: getBoardColumnLabel(column, labelScope),
      tasks: tasksByColumn[column],
    }),
  )

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
    const { source, destination, draggableId } = result
    if (!destination || !isBoardColumnKey(destination.droppableId)) {
      return
    }
    const column = destination.droppableId
    if (column !== source.droppableId) {
      moveTask(draggableId, column)
    }
    const task = sprintTasks.find((t) => t.id === draggableId)
    if (task && shouldFlagOnDrop(task, column, destination.index)) {
      updateTask({ id: task.id, data: { flagged: true } })
    }
  }

  const hidden = visibility.hidden
  const sprintProjectOptions = buildProjectOptions(
    getProjectsInTasks(projects ?? [], sprintTasks),
  )
  const sprintEpicOptions = buildEpicOptions(
    getEpicsInTasks(epics ?? [], sprintTasks),
  )
  const sprintPersonaOptions = getPersonasInTasks(personaOptions, sprintTasks)

  function buildMenu(): QuickFilterMenuGroup[] {
    const groups: [QuickFilterKind, string, { id: string; name: string }[]][] =
      [
        ['epic', BOARD_TEXTS.quickFilterEpics, sprintEpicOptions],
        ['project', BOARD_TEXTS.quickFilterProjects, sprintProjectOptions],
        ['persona', BOARD_TEXTS.quickFilterPersonas, sprintPersonaOptions],
      ]
    return groups
      .filter(([, , items]) => items.length > 0)
      .map(([kind, label, items]) => ({
        kind,
        label,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          isVisible: visibility.isVisible(kind, item.id),
        })),
      }))
  }

  function toggleQuickFilter(kind: QuickFilterKind, id: string) {
    if (visibility.isVisible(kind, id)) {
      setFilters(clearHiddenFilter(filters, kind, id))
    }
    visibility.toggle(kind, id)
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
    sprintProjects: withoutHidden(sprintProjectOptions, 'project', hidden),
    sprintEpics: withoutHidden(sprintEpicOptions, 'epic', hidden),
    sprintPersonas: withoutHidden(sprintPersonaOptions, 'persona', hidden),
    quickFilterMenu: buildMenu(),
    toggleQuickFilter,
    visibleTasks,
    columns,
    handleDragEnd,
    moveTask,
    getMoveOptionsFor,
  }
}
