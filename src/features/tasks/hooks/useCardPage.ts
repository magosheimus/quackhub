import { useRef, useState, type KeyboardEvent } from 'react'
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
import {
  fromRecurrenceValue,
  toRecurrenceValue,
  type RecurrenceValue,
} from '@/features/tasks/lib/recurrence'
import type { TaskStatus } from '@/shared/types/entities'
import type { Task } from '@/features/tasks/model/task'
import { useSettings } from '@/features/settings/hooks/useSettings'
import {
  findDueToken,
  removeDueToken,
  toTaskDue,
  withDueDate,
  withDueTime,
} from '@/features/tasks/lib/due'
import { useSoftDeleteTask } from '@/features/tasks/hooks/useSoftDeleteTask'

export function useCardPage(task: Task) {
  const [title, setTitle] = useState(task.title)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isSrsModalOpen, setIsSrsModalOpen] = useState(false)
  const [description, setDescription] = useState(task.description ?? '')
  const [pendingProjectId, setPendingProjectId] = useState<string | null>(null)
  const navigate = useNavigate()
  const { settings } = useSettings()

  const { mutate: updateTask } = useUpdateTask()
  const { mutate: updateTaskStatus } = useUpdateTaskStatus()
  const { data: projects } = useProjects()
  const project = projects?.find((p) => p.id === task.projectId)
  const { data: epics } = useEpics(task.projectId)
  const epic = epics?.find((e) => e.id === task.epicId)
  const { data: sprints } = useSprints()
  const assignableSprints = sprints?.filter((s) => s.status !== 'closed')
  const { data: tags } = useTaskTags(task.id)
  const { data: tagSuggestions } = useProjectTags(task.projectId)
  const { mutate: addTaskTag } = useAddTaskTag()
  const { mutate: removeTaskTag } = useRemoveTaskTag()
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const { mutate: softDeleteTask } = useSoftDeleteTask()

  function deleteTask() {
    navigate(-1)
    softDeleteTask(task.id)
  }

  const recurrenceValue = toRecurrenceValue(task.recurrence)

  const discardTitleRef = useRef(false)

  function handleTitleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      discardTitleRef.current = true
    }
    if (event.key === 'Enter' || event.key === 'Escape') {
      event.currentTarget.blur()
    }
  }

  function handleTitleBlur() {
    setIsEditingTitle(false)
    if (discardTitleRef.current) {
      discardTitleRef.current = false
      setTitle(task.title)
      return
    }
    const token =
      project?.type === 'general'
        ? findDueToken(title, new Date(), settings.weekStartsOn)
        : null
    const cleanedTitle = token ? removeDueToken(title, token) : title.trim()
    // Título só com "@amanhã 14h": aplica o prazo e mantém o nome atual
    const nextTitle = cleanedTitle || (token ? task.title : '')
    if (!nextTitle || (nextTitle === task.title && !token)) {
      setTitle(task.title)
      return
    }
    setTitle(nextTitle)
    updateTask({
      id: task.id,
      data: token
        ? { title: nextTitle, due: toTaskDue(token.dueDate, token.dueTime) }
        : { title: nextTitle },
    })
  }

  function handleDescriptionBlur() {
    const trimmed = description.trim()
    if (trimmed === (task.description ?? '')) {
      return
    }
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
      data: { recurrence: fromRecurrenceValue(value) },
    })
  }

  const pendingProject =
    projects?.find((p) => p.id === pendingProjectId) ?? null

  function requestProjectChange(projectId: string) {
    if (projectId !== task.projectId) {
      setPendingProjectId(projectId)
    }
  }

  function confirmProjectChange() {
    if (pendingProject) {
      updateTask({ id: task.id, data: buildProjectMove(task, pendingProject) })
    }
    setPendingProjectId(null)
  }

  function changeDueDate(date: string | null) {
    updateTask({ id: task.id, data: { due: withDueDate(task.due, date) } })
  }

  function changeDueTime(time: string | null) {
    updateTask({ id: task.id, data: { due: withDueTime(task.due, time) } })
  }

  function changeStatus(status: TaskStatus) {
    if (status === task.status) {
      return
    }
    updateTaskStatus({ id: task.id, status, sprintId: task.sprintId })
  }

  return {
    navigate,
    changeStatus,
    changeDueDate,
    changeDueTime,
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
          task.epicId !== null,
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
    handleTitleKeyDown,
    isSrsModalOpen,
    setIsSrsModalOpen,
    description,
    setDescription,
    handleDescriptionBlur,
    handleTagsChange,
    recurrenceValue,
    handleRecurrenceChange,
    isConfirmingDelete,
    setIsConfirmingDelete,
    deleteTask,
  }
}
