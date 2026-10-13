import type { ReactNode } from 'react'
import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd'
import { BoardCard, StaticBoardCard } from './BoardCard'
import { useAddTaskToSprint } from '@/features/tasks/hooks/sprint/useAddTaskToSprint'
import { getColumnsForType } from '@/features/board/lib/board'
import { getInitialStatusForType } from '@/features/tasks/lib/taskStatus'
import {
  getProjectBucket,
  sortByStatusOrder,
  type ProjectBucket,
} from '@/features/board/lib/projectBoard'
import type { Project, Task } from '@/shared/types/entities'
import { BOARD_TEXTS } from '@/features/board/constants/texts'
import type { ProjectLabels } from '@/features/projects/lib/project'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { IconFolder, IconPlus } from '@/shared/lib/icons'

type ProjectProgressViewProps = {
  project: Project
  onAddCard: () => void
  activeSprintId: string | null
  tasks: Task[]
  projectLabels: ProjectLabels
}

export function ProjectProgressView({
  project,
  onAddCard,
  activeSprintId,
  tasks,
  projectLabels,
}: ProjectProgressViewProps) {
  const { mutate: addTaskToSprint } = useAddTaskToSprint()
  const projectType = project.type

  const buckets: Record<ProjectBucket, Task[]> = {
    sprint: [],
    done: [],
    backlog: [],
  }
  for (const task of tasks) {
    buckets[getProjectBucket(task, activeSprintId)].push(task)
  }
  const sprintTasks = sortByStatusOrder(
    buckets.sprint,
    getColumnsForType(projectType),
  )

  function handleDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result
    if (!destination || !activeSprintId) return
    if (
      source.droppableId !== 'backlog' ||
      destination.droppableId !== 'sprint'
    ) {
      return
    }
    addTaskToSprint({
      taskId: draggableId,
      sprintId: activeSprintId,
      status: getInitialStatusForType(projectType),
      projectId: project.id,
    })
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={IconFolder}
        title={BOARD_TEXTS.emptyProjectTitle}
        description={BOARD_TEXTS.emptyProjectDescription}
      >
        <Button type="button" onClick={onAddCard}>
          <IconPlus size={12} aria-hidden="true" />
          {BOARD_TEXTS.newCard}
        </Button>
      </EmptyState>
    )
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr]">
        <Section
          title={BOARD_TEXTS.currentSprintSection}
          count={sprintTasks.length}
        >
          <Droppable droppableId="sprint" isDropDisabled={!activeSprintId}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex min-h-16 flex-col gap-2"
              >
                {sprintTasks.map((task) => (
                  <StaticBoardCard
                    key={task.id}
                    task={task}
                    projectLabels={projectLabels}
                    colorScope="epic"
                    showStatus
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Section>

        <Section
          title={BOARD_TEXTS.backlogSection}
          count={buckets.backlog.length}
        >
          <Droppable droppableId="backlog" isDropDisabled>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex min-h-16 flex-col gap-2"
              >
                {buckets.backlog.map((task, index) => (
                  <BoardCard
                    key={task.id}
                    task={task}
                    index={index}
                    projectLabels={projectLabels}
                    colorScope="epic"
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Section>

        <Section title={BOARD_TEXTS.doneSection} count={buckets.done.length}>
          <div className="flex flex-col gap-2">
            {buckets.done.map((task) => (
              <StaticBoardCard
                key={task.id}
                task={task}
                projectLabels={projectLabels}
                colorScope="epic"
              />
            ))}
          </div>
        </Section>
      </div>
    </DragDropContext>
  )
}

function Section({
  title,
  count,
  children,
}: {
  title: string
  count: number
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <span className="font-heading text-xl text-fg">{title}</span>
        <span className="text-caption">{count}</span>
      </div>
      {count === 0 && (
        <span className="px-1 text-caption">{BOARD_TEXTS.noCards}</span>
      )}
      {children}
    </div>
  )
}
