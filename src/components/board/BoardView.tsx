import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import { useParams } from 'react-router-dom'
import { useProjects } from '@/hooks/projects/useProjects'
import { useBoardTasks } from '@/hooks/tasks/useBoardTasks'
import { useUpdateTaskStatus } from '@/hooks/tasks/useUpdateTaskStatus'
import { getColumnsForType, type TaskStatus } from '@/lib/board'
import type { ProjectType } from '@/lib/project'
import { BoardColumn } from './BoardColumn'

export function BoardView() {
  const { id: projectId } = useParams<{ id: string }>()
  const { data: projects, isLoading: isLoadingProjects } = useProjects()
  const { data: tasks, isLoading: isLoadingTasks } = useBoardTasks(
    projectId ?? '',
  )
  const { mutate: updateTaskStatus } = useUpdateTaskStatus()

  const project = projects?.find((p) => p.id === projectId)

  if (isLoadingProjects) {
    return (
      <div className="text-sm text-[--text-muted]">[ CARREGANDO........ ]</div>
    )
  }

  if (!projectId || !project) {
    return (
      <div className="text-sm text-[--text-muted]">
        — Projeto não encontrado —
      </div>
    )
  }

  const currentProjectId = projectId
  const columns = getColumnsForType(project.type as ProjectType)

  function handleDragEnd(result: DropResult) {
    const { destination, draggableId } = result
    if (!destination) return

    updateTaskStatus({
      id: draggableId,
      status: destination.droppableId as TaskStatus,
      projectId: currentProjectId,
    })
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto">
        {columns.map((status) => (
          <BoardColumn
            key={status}
            status={status as TaskStatus}
            tasks={(tasks ?? []).filter((task) => task.status === status)}
            projectPrefix={project.prefix ?? ''}
          />
        ))}
      </div>
      {isLoadingTasks && (
        <div className="mt-4 text-sm text-[--text-muted]">
          [ CARREGANDO........ ]
        </div>
      )}
    </DragDropContext>
  )
}
