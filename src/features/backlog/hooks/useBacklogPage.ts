import { hasLoadError, retryFailedQueries } from '@/shared/query/queryState'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProjects } from '@/features/projects/hooks/useProjects'
import type { ColorScope } from '@/shared/lib/palette'
import { useAllEpics } from '@/features/epics/hooks/useAllEpics'
import {
  buildEpicLabels,
  buildEpicOptions,
  type EpicLabel,
} from '@/features/epics/lib/epic'
import { useBacklogTasks } from '@/features/tasks/hooks/useBacklogTasks'
import { useActiveSprint } from '@/features/sprints/hooks/useActiveSprint'
import { useSprints } from '@/features/sprints/hooks/useSprints'
import { useAddTaskToSprint } from '@/features/tasks/hooks/sprint/useAddTaskToSprint'
import { getInitialStatusForType } from '@/features/tasks/lib/taskStatus'
import {
  filterBacklogTasks,
  groupTasksByProject,
  type ProjectTaskGroup,
} from '@/features/backlog/lib/backlog'
import { isTaskPriority, isTaskStatus } from '@/shared/lib/enums'
import { useToggleSet } from '@/shared/hooks/useToggleSet'
import { useBulkTaskTags } from '@/features/tasks/hooks/tags/useBulkTaskTags'
import { collectTags } from '@/features/tasks/lib/taskTags'
import type {
  Project,
  Task,
  TaskPriority,
  TaskStatus,
} from '@/shared/types/entities'
import { buildProjectLabels } from '@/features/projects/lib/project'

export function useBacklogPage() {
  const [searchParams] = useSearchParams()
  const initialStatus = searchParams.get('status')

  const [projectFilter, setProjectFilter] = useState<string | null>(
    searchParams.get('project') || null,
  )
  const [statusFilter, setStatusFilter] = useState<TaskStatus | null>(
    isTaskStatus(initialStatus) ? initialStatus : null,
  )
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | null>(
    null,
  )
  const [epicFilter, setEpicFilter] = useState<string | null>(null)
  const [tagFilter, setTagFilter] = useState<string | null>(null)
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

  const targetSprint =
    activeSprint ?? sprints?.find((s) => s.status === 'planned') ?? null

  const projectById = new Map(projects?.map((p) => [p.id, p]))
  const projectLabels = buildProjectLabels(projects ?? [])
  const colorScope: ColorScope = projectFilter ? 'epic' : 'project'
  const { data: allEpics } = useAllEpics()
  const epicLabels = buildEpicLabels(allEpics ?? [])

  const filteredTasks = filterBacklogTasks(
    tasks ?? [],
    {
      status: statusFilter,
      priority: priorityFilter,
      epicId: epicFilter,
      tag: tagFilter,
    },
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
    setProjectFilter(projectId)
    setEpicFilter(null)
    setTagFilter(null)
  }

  function selectStatus(value: unknown) {
    setStatusFilter(isTaskStatus(value) ? value : null)
  }

  function selectPriority(value: unknown) {
    setPriorityFilter(isTaskPriority(value) ? value : null)
  }

  function getEpicLabel(task: Task): EpicLabel | null {
    if (!task.epic_id) {
      return null
    }
    return epicLabels.get(task.epic_id) ?? null
  }

  function addToSprint(task: Task, project: Project) {
    if (!targetSprint) {
      return
    }
    addTaskToSprint({
      taskId: task.id,
      sprintId: targetSprint.id,
      status: getInitialStatusForType(project.type),
      projectId: task.project_id,
    })
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
    tags: collectTags(tagsByTask ?? {}),
    selectedProject,
    selectedEpicName,
    selectProject,
    selectStatus,
    selectPriority,
    selectTag: setTagFilter,
    selectEpic: setEpicFilter,
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
  }
}
