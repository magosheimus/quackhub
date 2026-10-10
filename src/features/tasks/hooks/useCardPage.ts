import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUpdateTask } from '@/features/tasks/hooks/useUpdateTask'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { useEpics } from '@/features/epics/hooks/useEpics'
import { useSprints } from '@/features/sprints/hooks/useSprints'
import { useTaskTags } from '@/features/tasks/hooks/tags/useTaskTags'
import { useAddTaskTag } from '@/features/tasks/hooks/tags/useAddTaskTag'
import { useRemoveTaskTag } from '@/features/tasks/hooks/tags/useRemoveTaskTag'
import { useProjectTags } from '@/features/tasks/hooks/tags/useProjectTags'
import type { RecurrenceValue } from '@/features/tasks/components/RecurrenceFields'
import type { Task } from '@/shared/types/entities'

export function useCardPage(task: Task) {
  const [title, setTitle] = useState(task.title)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isSrsModalOpen, setIsSrsModalOpen] = useState(false)
  const [description, setDescription] = useState(task.description ?? '')
  const navigate = useNavigate()

  const { mutate: updateTask } = useUpdateTask()
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

  return {
    navigate,
    updateTask,
    projects,
    project,
    epics,
    epic,
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
