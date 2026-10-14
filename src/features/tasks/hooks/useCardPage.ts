import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUpdateTask } from '@/features/tasks/hooks/useUpdateTask'
import { useUpdateTaskStatus } from '@/features/tasks/hooks/sprint/useUpdateTaskStatus'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { useEpics } from '@/features/epics/hooks/useEpics'
import { buildEpicOptions, toEpicLabel } from '@/features/epics/lib/epic'
import {
  buildProjectOptions,
  toProjectLabel,
} from '@/features/projects/lib/project'
import { buildProjectMove } from '@/features/tasks/lib/projectMove'
import { TASKS_TEXTS } from '@/features/tasks/constants/texts'
import { useSprints } from '@/features/sprints/hooks/useSprints'
import { useTaskTags } from '@/features/tasks/hooks/tags/useTaskTags'
import { useAddTaskTag } from '@/features/tasks/hooks/tags/useAddTaskTag'
import { useRemoveTaskTag } from '@/features/tasks/hooks/tags/useRemoveTaskTag'
import { useProjectTags } from '@/features/tasks/hooks/tags/useProjectTags'
import type { RecurrenceValue } from '@/features/tasks/components/RecurrenceFields'
import type { Task, TaskStatus } from '@/shared/types/entities'

export function useCardPage(task: Task) {
  const [title, setTitle] = useState(task.title)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isSrsModalOpen, setIsSrsModalOpen] = useState(false)
  const [description, setDescription] = useState(task.description ?? '')
  const [pendingProjectId, setPendingProjectId] = useState<string | null>(null)
  const navigate = useNavigate()

  const { mutate: updateTask } = useUpdateTask()
  const { mutate: updateTaskStatus } = useUpdateTaskStatus()
  const { data: projects } = useProjects()
  const project = projects?.find((p) => p.id === task.project_id)
  const { data: epics } = useEpics(task.project_id)
  const epic = epics?.find((e) => e.id === task.epic_id)
  const { data: sprints } = useSprints()
  const assignableSprints = sprints?.filter((s) => s.status !== 'closed')
  const { data: tags } = useTaskTags(task.id)
  const { data: tagSuggestions } = useProjectTags(task.project_id)
  const { mutate: addTaskTag } = useAddTaskTag()
  const { mutate: removeTaskTag } = useRemoveTaskTag()

  const recurrenceValue: RecurrenceValue = {
    type: task.recurrence_type,
    interval: task.recurrence_interval,
    dayOfMonth: task.recurrence_day_of_month,
    endDate: task.recurrence_end_date,
  }

  function handleTitleBlur() {
    setIsEditingTitle(false)
    const trimmed = title.trim()
    if (!trimmed || trimmed === task.title) {
      setTitle(task.title)
      return
    }
    updateTask({ id: task.id, data: { title: trimmed } })
  }

  function handleDescriptionBlur() {
    const trimmed = description.trim()
    if (trimmed === (task.description ?? '')) return
    updateTask({ id: task.id, data: { description: trimmed || null } })
  }

  function handleTagsChange(newTags: string[]) {
    const current = tags ?? []
    const added = newTags.filter((t) => !current.includes(t))
    const removed = current.filter((t) => !newTags.includes(t))
    added.forEach((tagName) => addTaskTag({ taskId: task.id, tagName }))
    removed.forEach((tagName) => removeTaskTag({ taskId: task.id, tagName }))
  }

  function handleRecurrenceChange(value: RecurrenceValue) {
    updateTask({
      id: task.id,
      data: {
        recurrence_type: value.type,
        recurrence_interval: value.interval,
        recurrence_day_of_month: value.dayOfMonth,
        recurrence_end_date: value.endDate,
      },
    })
  }

  const pendingProject =
    projects?.find((p) => p.id === pendingProjectId) ?? null

  function requestProjectChange(projectId: string) {
    if (projectId !== task.project_id) {
      setPendingProjectId(projectId)
    }
  }

  function confirmProjectChange() {
    if (pendingProject) {
      updateTask({ id: task.id, data: buildProjectMove(task, pendingProject) })
    }
    setPendingProjectId(null)
  }

  function changeStatus(status: TaskStatus) {
    if (status === task.status) {
      return
    }
    updateTaskStatus({ id: task.id, status, sprintId: task.sprint_id })
  }

  return {
    navigate,
    changeStatus,
    updateTask,
    projects,
    project,
    projectLabel: project ? toProjectLabel(project) : undefined,
    epicLabel: epic ? toEpicLabel(epic) : undefined,
    epicOptions: buildEpicOptions(epics ?? []),
    projectOptions: buildProjectOptions(projects ?? []),
    projectMoveDescription: pendingProject
      ? TASKS_TEXTS.moveProjectDescription(
          pendingProject.name,
          task.epic_id !== null,
          buildProjectMove(task, pendingProject).status !== task.status,
        )
      : null,
    requestProjectChange,
    confirmProjectChange,
    cancelProjectChange: () => setPendingProjectId(null),
    assignableSprints,
    tags,
    tagSuggestions,
    title,
    setTitle,
    isEditingTitle,
    setIsEditingTitle,
    handleTitleBlur,
    isSrsModalOpen,
    setIsSrsModalOpen,
    description,
    setDescription,
    handleDescriptionBlur,
    handleTagsChange,
    recurrenceValue,
    handleRecurrenceChange,
  }
}
