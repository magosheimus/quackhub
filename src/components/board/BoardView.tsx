import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import { useSearchParams } from 'react-router-dom'
import { useProjects } from '@/hooks/projects/useProjects'
import { useTasksByProjectId } from '@/hooks/projects/useTasksByProjectId'
import { useActiveSprint } from '@/hooks/sprints/useActiveSprint'
import { useTasksBySprintId } from '@/hooks/tasks/sprint/useTasksBySprintId'
import { useUpdateTaskStatus } from '@/hooks/tasks/sprint/useUpdateTaskStatus'
import { useBoardFilters } from '@/hooks/board/useBoardFilters'
import { useBulkTaskTags } from '@/hooks/tasks/tags/useBulkTaskTags'
import { useAllEpics } from '@/hooks/epics/useAllEpics'
import {
  BOARD_COLUMNS,
  applyBoardFilters,
  getBoardColumnKey,
  getBoardColumnLabel,
  getStatusForColumn,
  type BoardColumnKey,
} from '@/lib/board'
import { todayLocal } from '@/lib/srs'
import { BoardColumn } from './BoardColumn'
import { BoardEmptyState } from './BoardEmptyState'
import { FilterBar } from './FilterBar'
import { ProjectBoardView } from './ProjectBoardView'
import { SprintHeader } from '@/components/sprint/SprintHeader'
import { useSprints } from '@/hooks/sprints/useSprints'
import { SprintPlanningHeader } from '../backlog/SprintPlanningHeader'
import { BacklogView } from '../backlog/BacklogView'
import type { ProjectType } from '@/lib/project'

export function BoardView() {
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
    projects?.map((p) => [p.id, p.type as ProjectType]),
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
        <BacklogView />
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
