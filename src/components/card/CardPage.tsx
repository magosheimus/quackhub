import { useParams } from 'react-router-dom'
import { useTaskById } from '@/hooks/tasks/useTaskById'
import { useCardPage } from '@/hooks/card/useCardPage'
import { CardPageHeader } from './page/CardPageHeader'
import { CardDetailsSection } from './page/CardDetailsSection'
import { CardSidePanel } from './page/CardSidePanel'
import { CardChecklist } from './CardChecklist'
import { CardDependencies } from './CardDependencies'
import { CardAttachments } from './CardAttachments'
import { CardHistory } from './CardHistory'
import { type TaskPriority } from '@/lib/board'
import type { Database } from '@/types/database.types'
import { RegisterPerformanceModal } from '@/components/srs/RegisterPerformanceModal'
import { LoadingText } from '../ui/loading-text'
import { CardDescription } from './page/CardDescription'

type Task = Database['public']['Tables']['tasks']['Row']

export function CardPage() {
  const { id } = useParams<{ id: string }>()
  const { data: task, isLoading } = useTaskById(id ?? '')

  if (isLoading) {
    return <LoadingText />
  }

  if (!task) {
    return (
      <div className="text-sm text-(--text-muted)">— Card não encontrado —</div>
    )
  }

  return <CardPageBody key={task.id} task={task} />
}

function CardPageBody({ task }: { task: Task }) {
  const {
    navigate,
    updateTask,
    project,
    epic,
    epics,
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
  } = useCardPage(task)

  return (
    <div className="flex flex-col gap-4">
      <CardPageHeader
        taskNumber={task.task_number}
        projectPrefix={project?.prefix}
        epicName={epic?.name}
        title={title}
        isEditingTitle={isEditingTitle}
        onTitleChange={setTitle}
        onTitleFocus={() => setIsEditingTitle(true)}
        onTitleBlur={handleTitleBlur}
        onBack={() => navigate(-1)}
      />

      <div className="grid gap-6 sm:grid-cols-[1fr_240px]">
        <div className="flex flex-col gap-4">
          <CardDetailsSection
            projectType={project?.type}
            status={task.status}
            priority={task.priority as TaskPriority}
            flagged={task.flagged}
            epicId={task.epic_id}
            epicName={epic?.name}
            epics={epics}
            sprintId={task.sprint_id}
            sprints={assignableSprints}
            tags={tags ?? []}
            tagSuggestions={tagSuggestions ?? []}
            onUpdate={(data) => updateTask({ id: task.id, data })}
            onTagsChange={handleTagsChange}
          />

          <CardDescription
            value={description}
            onChange={setDescription}
            onBlur={handleDescriptionBlur}
          />

          <CardAttachments taskId={task.id} />

          <CardChecklist taskId={task.id} />

          <CardDependencies taskId={task.id} projectId={task.project_id} />

          <CardHistory taskId={task.id} />
        </div>

        <CardSidePanel
          projectType={project?.type}
          status={task.status}
          createdAt={task.created_at}
          updatedAt={task.updated_at}
          dueDate={task.due_date}
          easeFactor={task.ease_factor}
          nextReview={task.next_review}
          recurrenceValue={recurrenceValue}
          onDueDateChange={(value) =>
            updateTask({ id: task.id, data: { due_date: value } })
          }
          onRecurrenceChange={handleRecurrenceChange}
          onRegisterPerformance={() => setIsSrsModalOpen(true)}
        />
      </div>

      <RegisterPerformanceModal
        task={task}
        open={isSrsModalOpen}
        onOpenChange={setIsSrsModalOpen}
      />
    </div>
  )
}
