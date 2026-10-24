import { hasLoadError, retryFailedQueries } from '@/shared/query/queryState'
import type { BeforeCapture, DropResult } from '@hello-pangea/dnd'
import { useState } from 'react'
import { flushSync } from 'react-dom'
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
  canFlagInColumn,
  parseDropTarget,
  getMoveOptions,
  getColumnOrderAfterDrop,
  hasActiveBoardFilters,
  type BoardColumnKey,
  type MoveOption,
} from '@/features/board/lib/board'
import { todayLocal } from '@/shared/lib/date'
import type { ProjectType } from '@/shared/types/entities'
import type { Task } from '@/features/tasks/model/task'
import {
  buildProjectLabels,
  buildProjectOptions,
} from '@/features/projects/lib/project'
import { buildEpicOptions } from '@/features/epics/lib/epic'
import { usePersonaOptions } from '@/features/personas/hooks/usePersonaOptions'
import { getPersonasInTasks } from '@/features/personas/lib/persona'
import { useReorderTasks } from '@/features/tasks/hooks/useReorderTasks'
import { queryKeys } from '@/shared/query/queryKeys'

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
  const [draggingTask, setDraggingTask] = useState<Task | null>(null)
  const { reorder } = useReorderTasks(
    queryKeys.tasks.sprint(activeSprint?.id ?? ''),
  )
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
      showUrgentZone:
        draggingTask !== null && canFlagInColumn(draggingTask, column),
    }),
  )

  function moveTask(taskId: string, column: BoardColumnKey) {
    if (!activeSprint) {
      return
    }
    const task = sprintTasks.find((t) => t.id === taskId)
    const taskType = task ? projectTypeById.get(task.projectId) : undefined
    if (!taskType) {
      return
    }
    const status = getStatusForColumn(column, taskType)
    if (!status) {
      return
    }
    updateTaskStatus({ id: taskId, status, sprintId: activeSprint.id })
  }

  function handleBeforeCapture({ draggableId }: BeforeCapture) {
    flushSync(() => {
      setDraggingTask(sprintTasks.find((t) => t.id === draggableId) ?? null)
    })
  }

  function handleDragEnd({ source, destination, draggableId }: DropResult) {
    setDraggingTask(null)
    const target = destination ? parseDropTarget(destination.droppableId) : null
    if (!destination || !target) {
      return
    }
    const { column, isUrgentZone } = target
    const index = isUrgentZone ? 0 : destination.index
    const isSameColumn = column === source.droppableId
    if (!isSameColumn) {
      moveTask(draggableId, column)
    }
    const isSameSpot = isSameColumn && index === source.index
    if (!isSameSpot && !hasActiveBoardFilters(filters)) {
      reorder(
        getColumnOrderAfterDrop(tasksByColumn[column], draggableId, index),
      )
    }
    const task = sprintTasks.find((t) => t.id === draggableId)
    if (isUrgentZone && task && canFlagInColumn(task, column)) {
      updateTask({ id: task.id, data: { flag: { note: null } } })
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
    const taskType = projectTypeById.get(task.projectId)
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
    handleBeforeCapture,
    handleDragEnd,
    moveTask,
    getMoveOptionsFor,
  }
}
