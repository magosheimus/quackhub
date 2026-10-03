import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import { useSearchParams } from 'react-router-dom'
import { useProjects } from '@/hooks/projects/useProjects'
import { useActiveSprint } from '@/hooks/sprints/useActiveSprint'
import { useTasksBySprintId } from '@/hooks/tasks/sprint/useTasksBySprintId'
import { useUpdateTaskStatus } from '@/hooks/tasks/sprint/useUpdateTaskStatus'
import { useBoardFilters } from '@/hooks/board/useBoardFilters'
import { useBulkTaskTags } from '@/hooks/tasks/tags/useBulkTaskTags'
import { useAllEpics } from '@/hooks/epics/useAllEpics'
import {
  getColumnsForType,
  applyBoardFilters,
  type TaskStatus,
} from '@/lib/board'
import { todayLocal } from '@/lib/srs'
import type { ProjectType } from '@/lib/project'
import { BoardColumn } from './BoardColumn'
import { FilterBar } from './FilterBar'
import { SprintHeader } from '@/components/sprint/SprintHeader'
import { LoadingText } from '../ui/loading-text'

export function BoardView() {
  const [searchParams, setSearchParams] = useSearchParams()
  const projectId = searchParams.get('project')

  const { data: projects, isLoading: isLoadingProjects } = useProjects()
  const { data: activeSprint, isLoading: isLoadingSprint } = useActiveSprint()
  const { data: tasks, isLoading: isLoadingTasks } = useTasksBySprintId(
    activeSprint?.id ?? '',
  )
  const { mutate: updateTaskStatus } = useUpdateTaskStatus()
  const { data: epics } = useAllEpics()
  const { filters, updateFilter, resetFilters } = useBoardFilters()

  const scopedTasks = projectId
    ? (tasks ?? []).filter((task) => task.project_id === projectId)
    : (tasks ?? [])

  const { data: taskTagsMap } = useBulkTaskTags(scopedTasks.map((t) => t.id))

  if (isLoadingProjects || isLoadingSprint) {
    return <LoadingText />
  }

  const project = projectId
    ? (projects?.find((p) => p.id === projectId) ?? null)
    : null

  const visibleTasks = applyBoardFilters(
    scopedTasks,
    filters,
    taskTagsMap ?? new Map(),
    todayLocal(),
  )

  const projectPrefixById = new Map(
    projects?.map((p) => [p.id, p.prefix ?? '']),
  )

  const projectIdsInSprint = new Set((tasks ?? []).map((t) => t.project_id))
  const epicIdsInSprint = new Set(
    (tasks ?? []).map((t) => t.epic_id).filter((id): id is string => !!id),
  )
  const sprintProjects = (projects ?? []).filter((p) =>
    projectIdsInSprint.has(p.id),
  )
  const sprintEpics = (epics ?? []).filter((e) => epicIdsInSprint.has(e.id))

  const columns = getColumnsForType(
    project ? (project.type as ProjectType) : null,
  )

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
      <SprintHeader activeSprint={activeSprint ?? null} tasks={visibleTasks} />

      <FilterBar
        filters={filters}
        onUpdateFilter={updateFilter}
        onReset={resetFilters}
        epics={sprintEpics}
        projects={sprintProjects}
        selectedProjectId={projectId}
        onSelectProject={handleSelectProject}
      />

      {activeSprint ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto">
            {columns.map((status) => (
              <BoardColumn
                key={status}
                status={status as TaskStatus}
                tasks={visibleTasks.filter((task) => task.status === status)}
                projectPrefixById={projectPrefixById}
              />
            ))}
          </div>
          {isLoadingTasks && <LoadingText />}
        </DragDropContext>
      ) : (
        <div className="text-sm text-[--text-muted]">
          — Sem Sprint ativa. Crie ou inicie uma acima pra ver o board. —
        </div>
      )}
    </div>
  )
}
