import { ErrorState } from '@/components/ui/error-state'
import { hasLoadError, retryFailedQueries } from '@/shared/query/queryState'
import { Link, useParams } from 'react-router-dom'
import { useTaskById } from '@/features/tasks/hooks/useTaskById'
import { useCardPage } from '@/features/tasks/hooks/useCardPage'
import { CardPageHeader } from '@/features/tasks/components/cardPage/CardPageHeader'
import { CardDetailsSection } from '@/features/tasks/components/cardPage/CardDetailsSection'
import { CardSidePanel } from '@/features/tasks/components/cardPage/CardSidePanel'
import { CardChecklist } from '@/features/tasks/components/CardChecklist'
import { CardDependencies } from '@/features/tasks/components/CardDependencies'
import { CardAttachments } from '@/features/tasks/components/CardAttachments'
import { CardHistory } from '@/features/tasks/components/CardHistory'
import { RegisterPerformanceModal } from '@/features/srs/components/RegisterPerformanceModal'
import { LoadingText } from '@/components/ui/loading-text'
import { CardDescription } from '@/features/tasks/components/cardPage/CardDescription'
import type { Task } from '@/shared/types/entities'
import { TASKS_TEXTS } from '@/features/tasks/constants/texts'
import { EmptyState } from '@/components/ui/empty-state'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { HOME_PATH } from '@/features/auth/lib/redirect'
import { Button } from '@/components/ui/button'
import { IconFolder } from '@/shared/lib/icons'

export function CardPage() {
  const { id } = useParams<{ id: string }>()
  const taskQuery = useTaskById(id ?? '')
  const { data: task, isLoading } = taskQuery

  if (isLoading) {
    return <LoadingText />
  }

  if (hasLoadError(taskQuery)) {
    return <ErrorState onRetry={() => retryFailedQueries(taskQuery)} />
  }

  if (!task) {
    return (
      <EmptyState
        icon={IconFolder}
        title={TASKS_TEXTS.notFound}
        description={TASKS_TEXTS.notFoundDescription}
      >
        <Button variant="outline" size="sm" render={<Link to={HOME_PATH} />}>
          {TASKS_TEXTS.goToInbox}
        </Button>
      </EmptyState>
    )
  }

  return <CardPageBody key={task.id} task={task} />
}

function CardPageBody({ task }: { task: Task }) {
  const {
    navigate,
    changeStatus,
    updateTask,
    project,
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
    projectLabel,
    epicLabel,
    epicOptions,
    projectOptions,
    projectMoveDescription,
    requestProjectChange,
    confirmProjectChange,
    cancelProjectChange,
  } = useCardPage(task)

  return (
    <div className="flex flex-col gap-4">
      <CardPageHeader
        taskNumber={task.task_number}
        projectLabel={projectLabel}
        epicLabel={epicLabel}
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
            projectId={task.project_id}
            projectName={project?.name}
            projectOptions={projectOptions}
            onProjectChange={requestProjectChange}
            projectType={project?.type}
            status={task.status}
            priority={task.priority}
            flagged={task.flagged}
            epicId={task.epic_id}
            epicLabel={epicLabel}
            epicOptions={epicOptions}
            sprintId={task.sprint_id}
            sprints={assignableSprints}
            tags={tags ?? []}
            tagSuggestions={tagSuggestions ?? []}
            onUpdate={(data) => updateTask({ id: task.id, data })}
            onStatusChange={changeStatus}
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
      <ConfirmDialog
        open={projectMoveDescription !== null}
        onOpenChange={(open) => !open && cancelProjectChange()}
        title={TASKS_TEXTS.moveProjectTitle}
        description={projectMoveDescription ?? ''}
        confirmLabel={TASKS_TEXTS.moveProjectConfirm}
        onConfirm={confirmProjectChange}
      />
    </div>
  )
}
