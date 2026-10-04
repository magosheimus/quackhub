import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import { useSearchParams } from 'react-router-dom'
import { useProjects } from '@/hooks/projects/useProjects'
import { useTasksByProjectId } from '@/hooks/projects/useTasksByProjectId'
import { useActiveSprint } from '@/hooks/sprints/useActiveSprint'
import { useSprints } from '@/hooks/sprints/useSprints'
import { useTasksBySprintId } from '@/hooks/tasks/sprint/useTasksBySprintId'
import { useUpdateTaskStatus } from '@/hooks/tasks/sprint/useUpdateTaskStatus'
import { useBoardFilters } from '@/hooks/board/useBoardFilters'
import { useBulkTaskTags } from '@/hooks/tasks/tags/useBulkTaskTags'
import { useAllEpics } from '@/hooks/epics/useAllEpics'
import { ALL_COLUMNS, applyBoardFilters, type TaskStatus } from '@/lib/board'
import { todayLocal } from '@/lib/srs'
import { BoardColumn } from './BoardColumn'
import { BoardEmptyState } from './BoardEmptyState'
import { FilterBar } from './FilterBar'
import { ProjectBoardView } from './ProjectBoardView'
import { SprintHeader } from '@/components/sprint/SprintHeader'

export function BoardView() {
  const [searchParams, setSearchParams] = useSearchParams()
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
  const { filters, updateFilter, resetFilters } = useBoardFilters()

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

  if (!activeSprint) {
    return (
      <BoardEmptyState
        plannedSprint={sprints?.find((s) => s.status === 'planned') ?? null}
      />
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

  function handleSelectProject(nextProjectId: string | null) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (nextProjectId) {
        next.set('project', nextProjectId)
      } else {
        next.delete('project')
      }
      return next
    })
  }

  function handleDragEnd(result: DropResult) {
    if (!activeSprint) return
    const { destination, draggableId } = result
    if (!destination) return

    updateTaskStatus({
      id: draggableId,
      status: destination.droppableId as TaskStatus,
      sprintId: activeSprint.id,
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <SprintHeader activeSprint={activeSprint} tasks={visibleTasks} />

      <FilterBar
        filters={filters}
        onUpdateFilter={updateFilter}
        onReset={resetFilters}
        epics={sprintEpics}
        projects={sprintProjects}
        selectedProjectId={projectId}
        onSelectProject={handleSelectProject}
      />

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto">
          {ALL_COLUMNS.map((status) => (
            <BoardColumn
              key={status}
              status={status as TaskStatus}
              tasks={visibleTasks.filter((task) => task.status === status)}
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
