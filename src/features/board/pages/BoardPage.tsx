import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import { useSearchParams } from 'react-router-dom'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { useTasksByProjectId } from '@/features/projects/hooks/useTasksByProjectId'
import { useActiveSprint } from '@/features/sprints/hooks/useActiveSprint'
import { useTasksBySprintId } from '@/features/tasks/hooks/sprint/useTasksBySprintId'
import { useUpdateTaskStatus } from '@/features/tasks/hooks/sprint/useUpdateTaskStatus'
import { useBoardFilters } from '@/features/board/hooks/useBoardFilters'
import { useBulkTaskTags } from '@/features/tasks/hooks/tags/useBulkTaskTags'
import { useAllEpics } from '@/features/epics/hooks/useAllEpics'
import {
  BOARD_COLUMNS,
  applyBoardFilters,
  getBoardColumnKey,
  getBoardColumnLabel,
  getStatusForColumn,
  type BoardColumnKey,
} from '@/features/board/lib/board'
import { todayLocal } from '@/features/srs/lib/srs'
import { BoardColumn } from '@/features/board/components/BoardColumn'
import { BoardEmptyState } from '@/features/board/components/BoardEmptyState'
import { FilterBar } from '@/features/board/components/FilterBar'
import { ProjectBoardView } from '@/features/board/components/ProjectBoardView'
import { SprintHeader } from '@/features/sprints/components/SprintHeader'
import { useSprints } from '@/features/sprints/hooks/useSprints'
import { SprintPlanningHeader } from '@/features/backlog/components/SprintPlanningHeader'
import { BacklogPage } from '@/features/backlog/pages/BacklogPage'
import type { ProjectType } from '@/shared/types/entities'

export function BoardPage() {
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('project')
  const { data: projects, isLoading: isLoadingProjects } = useProjects()
  const { data: sprints } = useSprints()
  const { data: activeSprint, isLoading: isLoadingSprint } = useActiveSprint()
  const { data: tasks, isLoading: isLoadingTasks } = useTasksBySprintId(
    activeSprint?.id ?? '',
  )
  const { data: projectTasks } = useTasksByProjectId(projectId)
  const { mutate: updateTaskStatus } = useUpdateTaskStatus()
  const { data: epics } = useAllEpics()
  const { filters, updateFilter } = useBoardFilters()

  const { data: taskTagsMap } = useBulkTaskTags((tasks ?? []).map((t) => t.id))

  if (isLoadingProjects || isLoadingSprint) {
    return (
      <div className="text-sm text-(--text-muted)">[ CARREGANDO........ ]</div>
    )
  }
  const project = projectId
    ? (projects?.find((p) => p.id === projectId) ?? null)
    : null

  const projectPrefixById = new Map(
    projects?.map((p) => [p.id, p.prefix ?? '']),
  )
  const projectTypeById = new Map<string, ProjectType>(
    projects?.map((p) => [p.id, p.type]),
  )
  const filteredTypes = filters.projectIds.map((id) => projectTypeById.get(id))
  const labelScope =
    filteredTypes.length > 0 && filteredTypes.every((type) => type === 'study')
      ? 'study'
      : null

  if (project) {
    return (
      <ProjectBoardView
        project={project}
        activeSprintId={activeSprint?.id ?? null}
        activeSprintName={activeSprint?.name ?? null}
        tasks={projectTasks ?? []}
        projectPrefixById={projectPrefixById}
      />
    )
  }

  const plannedSprint = sprints?.find((s) => s.status === 'planned') ?? null

  if (!activeSprint) {
    if (!plannedSprint) return <BoardEmptyState />
    return (
      <div className="flex flex-col gap-4">
        <SprintPlanningHeader sprint={plannedSprint} />
        <BacklogPage />
      </div>
    )
  }

  const visibleTasks = applyBoardFilters(
    tasks ?? [],
    filters,
    taskTagsMap ?? new Map(),
    todayLocal(),
  )

  const projectIdsInSprint = new Set((tasks ?? []).map((t) => t.project_id))
  const epicIdsInSprint = new Set(
    (tasks ?? []).map((t) => t.epic_id).filter((id): id is string => !!id),
  )
  const sprintProjects = (projects ?? []).filter((p) =>
    projectIdsInSprint.has(p.id),
  )
  const sprintEpics = (epics ?? []).filter((e) => epicIdsInSprint.has(e.id))

  function handleDragEnd(result: DropResult) {
    if (!activeSprint) return
    const { destination, draggableId } = result
    if (!destination) return

    const task = tasks?.find((t) => t.id === draggableId)
    const taskType = task ? projectTypeById.get(task.project_id) : undefined
    if (!task || !taskType) return

    const status = getStatusForColumn(
      destination.droppableId as BoardColumnKey,
      taskType,
    )
    if (!status) return

    updateTaskStatus({
      id: draggableId,
      status,
      sprintId: activeSprint.id,
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <SprintHeader activeSprint={activeSprint} tasks={visibleTasks} />

      <FilterBar
        filters={filters}
        onUpdateFilter={updateFilter}
        epics={sprintEpics}
        projects={sprintProjects}
      />

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto">
          {BOARD_COLUMNS.map((column) => (
            <BoardColumn
              key={column}
              column={column}
              label={getBoardColumnLabel(column, labelScope)}
              tasks={visibleTasks.filter(
                (task) => getBoardColumnKey(task.status) === column,
              )}
              projectPrefixById={projectPrefixById}
            />
          ))}
        </div>
        {isLoadingTasks && (
          <div className="text-sm text-(--text-muted)">
            [ CARREGANDO........ ]
          </div>
        )}
      </DragDropContext>
    </div>
  )
}
