import { hasLoadError, retryFailedQueries } from '@/shared/query/queryState'
import { useState } from 'react'
import { useProjects } from '@/features/projects/hooks/useProjects'
import type { ColorScope } from '@/shared/lib/palette'
import { useAllEpics } from '@/features/epics/hooks/useAllEpics'
import {
  buildEpicLabels,
  buildEpicOptions,
  type EpicLabel,
} from '@/features/epics/lib/epic'
import { useBacklogTasks } from '@/features/tasks/hooks/useBacklogTasks'
import { useBacklogFilters } from '@/features/backlog/hooks/useBacklogFilters'
import { useActiveSprint } from '@/features/sprints/hooks/useActiveSprint'
import { useSprints } from '@/features/sprints/hooks/useSprints'
import { useAddTaskToSprint } from '@/features/tasks/hooks/sprint/useAddTaskToSprint'
import { getInitialStatusForType } from '@/features/tasks/lib/taskStatus'
import {
  filterBacklogTasks,
  groupTasksByProject,
  hasActiveFilters,
  type ProjectTaskGroup,
} from '@/features/backlog/lib/backlog'
import { isTaskPriority, isTaskStatus } from '@/shared/lib/enums'
import { useToggleSet } from '@/shared/hooks/useToggleSet'
import { useBulkTaskTags } from '@/features/tasks/hooks/tags/useBulkTaskTags'
import { collectTags } from '@/features/tasks/lib/taskTags'
import type { Project } from '@/shared/types/entities'
import type { Task } from '@/features/tasks/model/task'
import { buildProjectLabels } from '@/features/projects/lib/project'
import { usePersonaOptions } from '@/features/personas/hooks/usePersonaOptions'
import { toImportance } from '@/features/tasks/lib/importance'
import { useReorderTasks } from '@/features/tasks/hooks/useReorderTasks'
import { queryKeys } from '@/shared/query/queryKeys'
import { moveItem } from '@/shared/lib/array'
import type { DropResult } from '@hello-pangea/dnd'

export function useBacklogPage() {
  const { filters, update } = useBacklogFilters()
  const {
    projectId: projectFilter,
    status: statusFilter,
    priority: priorityFilter,
    epicId: epicFilter,
    tag: tagFilter,
    assigneeId: assigneeFilter,
    minImportance: minImportanceFilter,
  } = filters
  const [isEpicModalOpen, setIsEpicModalOpen] = useState(false)
  const collapsedProjects = useToggleSet<string>()

  const projectsQuery = useProjects()
  const tasksQuery = useBacklogTasks(projectFilter)
  const { data: projects, isLoading: isLoadingProjects } = projectsQuery
  const { data: tasks, isLoading: isLoadingTasks } = tasksQuery
  const { data: tagsByTask } = useBulkTaskTags((tasks ?? []).map((t) => t.id))
  const { data: activeSprint } = useActiveSprint()
  const { data: sprints } = useSprints()
  const { mutate: addTaskToSprint } = useAddTaskToSprint()
  const { reorder } = useReorderTasks(queryKeys.tasks.backlog(projectFilter))

  const targetSprint =
    activeSprint ?? sprints?.find((s) => s.status === 'planned') ?? null

  const projectById = new Map(projects?.map((p) => [p.id, p]))
  const projectLabels = buildProjectLabels(projects ?? [])
  const colorScope: ColorScope = projectFilter ? 'epic' : 'project'
  const { data: allEpics } = useAllEpics()
  const epicLabels = buildEpicLabels(allEpics ?? [])
  const hasPersonas = usePersonaOptions().length > 0

  const filteredTasks = filterBacklogTasks(
    tasks ?? [],
    filters,
    tagsByTask ?? {},
  )
  const projectGroups = groupTasksByProject(projects ?? [], filteredTasks)

  const selectedProject = projectFilter
    ? (projectById.get(projectFilter) ?? null)
    : null
  const selectedEpicName = epicFilter
    ? epicLabels.get(epicFilter)?.name
    : undefined

  function selectProject(projectId: string | null) {
    update({ projectId, epicId: null, tag: null })
  }

  function selectStatus(value: unknown) {
    update({ status: isTaskStatus(value) ? value : null })
  }

  function selectPriority(value: unknown) {
    update({ priority: isTaskPriority(value) ? value : null })
  }

  function selectMinImportance(value: unknown) {
    update({
      minImportance: toImportance(Number(value)),
    })
  }

  function getEpicLabel(task: Task): EpicLabel | null {
    if (!task.epicId) {
      return null
    }
    return epicLabels.get(task.epicId) ?? null
  }

  function addToSprint(task: Task, project: Project) {
    if (!targetSprint) {
      return
    }
    addTaskToSprint({
      taskId: task.id,
      sprintId: targetSprint.id,
      status: getInitialStatusForType(project.type),
      projectId: task.projectId,
    })
  }

  function handleDragEnd({ source, destination }: DropResult) {
    if (
      !destination ||
      destination.droppableId !== source.droppableId ||
      destination.index === source.index
    ) {
      return
    }
    const group = projectGroups.find(
      ({ project }) => project.id === source.droppableId,
    )
    if (!group) {
      return
    }
    reorder(
      moveItem(group.tasks, source.index, destination.index).map(
        (task) => task.id,
      ),
    )
  }

  function addAllToSprint(group: ProjectTaskGroup) {
    group.tasks.forEach((task) => addToSprint(task, group.project))
  }

  return {
    projects,
    isLoadingProjects,
    isLoadingTasks,
    hasError: hasLoadError(projectsQuery, tasksQuery),
    retry: () => retryFailedQueries(projectsQuery, tasksQuery),
    projectFilter,
    statusFilter,
    priorityFilter,
    epicFilter,
    tagFilter,
    assigneeFilter,
    minImportanceFilter,
    hasPersonas,
    selectAssignee: (assigneeId: string | null) => update({ assigneeId }),
    tags: collectTags(tagsByTask ?? {}),
    selectedProject,
    selectedEpicName,
    selectProject,
    selectStatus,
    selectPriority,
    selectMinImportance,
    selectTag: (tag: string | null) => update({ tag }),
    selectEpic: (epicId: string | null) => update({ epicId }),
    isEpicModalOpen,
    setIsEpicModalOpen,
    filteredTasks,
    hasBacklogTasks: (tasks ?? []).length > 0,
    projectGroups,
    projectLabels,
    getEpicLabel,
    colorScope,
    epicOptions: buildEpicOptions(
      (allEpics ?? []).filter((epic) => epic.project_id === projectFilter),
    ),
    toggleProject: collapsedProjects.toggle,
    isProjectCollapsed: collapsedProjects.has,
    canAddToSprint: targetSprint !== null,
    addToSprint,
    addAllToSprint,
    canReorder: !hasActiveFilters(filters),
    handleDragEnd,
  }
}
