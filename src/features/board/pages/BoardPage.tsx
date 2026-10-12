import { DragDropContext } from '@hello-pangea/dnd'
import { BoardColumn } from '@/features/board/components/BoardColumn'
import { BoardEmptyState } from '@/features/board/components/BoardEmptyState'
import { FilterBar } from '@/features/board/components/FilterBar'
import { ProjectBoardView } from '@/features/board/components/ProjectBoardView'
import { useBoardPage } from '@/features/board/hooks/useBoardPage'
import { SprintHeader } from '@/features/sprints/components/SprintHeader'
import { SprintPlanningHeader } from '@/features/backlog/components/SprintPlanningHeader'
import { BacklogPage } from '@/features/backlog/pages/BacklogPage'
import { LoadingText } from '@/components/ui/loading-text'

export function BoardPage() {
  const {
    isLoading,
    isLoadingTasks,
    project,
    projectTasks,
    activeSprint,
    plannedSprint,
    projectPrefixById,
    filters,
    updateFilter,
    sprintProjects,
    sprintEpics,
    visibleTasks,
    columns,
    handleDragEnd,
  } = useBoardPage()

  if (isLoading) {
    return <LoadingText />
  }

  if (project) {
    return (
      <ProjectBoardView
        project={project}
        activeSprintId={activeSprint?.id ?? null}
        activeSprintName={activeSprint?.name ?? null}
        tasks={projectTasks}
        projectPrefixById={projectPrefixById}
      />
    )
  }

  if (!activeSprint) {
    if (!plannedSprint) {
      return <BoardEmptyState />
    }
    return (
      <div className="flex flex-col gap-4">
        <SprintPlanningHeader sprint={plannedSprint} />
        <BacklogPage />
      </div>
    )
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
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:snap-none">
          {columns.map((column) => (
            <BoardColumn
              key={column.key}
              column={column.key}
              label={column.label}
              tasks={column.tasks}
              projectPrefixById={projectPrefixById}
            />
          ))}
        </div>
        {isLoadingTasks && <LoadingText />}
      </DragDropContext>
    </div>
  )
}
