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
import { CardLinks } from '@/features/tasks/components/CardLinks'
import { CardHistory } from '@/features/tasks/components/CardHistory'
import { RegisterPerformanceModal } from '@/features/srs/components/RegisterPerformanceModal'
import { LoadingText } from '@/components/ui/loading-text'
import { CardDescription } from '@/features/tasks/components/cardPage/CardDescription'
import type { Task } from '@/features/tasks/model/task'
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
    changeDueDate,
    changeDueTime,
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
    handleTitleKeyDown,
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
    isConfirmingDelete,
    setIsConfirmingDelete,
    deleteTask,
  } = useCardPage(task)

  return (
    <div className="flex flex-col gap-4">
      <CardPageHeader
        taskNumber={task.number}
        projectLabel={projectLabel}
        epicLabel={epicLabel}
        title={title}
        isEditingTitle={isEditingTitle}
        onTitleChange={setTitle}
        onTitleFocus={() => setIsEditingTitle(true)}
        onTitleBlur={handleTitleBlur}
        onTitleKeyDown={handleTitleKeyDown}
        onBack={() => navigate(-1)}
        onDelete={() => setIsConfirmingDelete(true)}
      />

      <div className="grid gap-6 sm:grid-cols-[1fr_240px]">
        <div className="flex flex-col gap-4">
          <CardDetailsSection
            projectId={task.projectId}
            projectName={project?.name}
            projectOptions={projectOptions}
            onProjectChange={requestProjectChange}
            projectType={project?.type}
            status={task.status}
            epicId={task.epicId}
            epicLabel={epicLabel}
            epicOptions={epicOptions}
            sprintId={task.sprintId}
            sprints={assignableSprints}
            tags={tags ?? []}
            tagSuggestions={tagSuggestions ?? []}
            priority={task.priority}
            isFlagged={task.flag !== null}
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

          <CardLinks taskId={task.id} />

          <CardChecklist taskId={task.id} />

          <CardDependencies taskId={task.id} projectId={task.projectId} />

          <CardHistory taskId={task.id} />
        </div>

        <CardSidePanel
          projectType={project?.type}
          status={task.status}
          assigneeId={task.assigneeId}
          createdAt={task.createdAt}
          updatedAt={task.updatedAt}
          due={task.due}
          srs={task.srs}
          recurrenceValue={recurrenceValue}
          onAssigneeChange={(assigneeId) =>
            updateTask({ id: task.id, data: { assigneeId } })
          }
          onDueDateChange={changeDueDate}
          onDueTimeChange={changeDueTime}
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
      <ConfirmDialog
        open={isConfirmingDelete}
        onOpenChange={setIsConfirmingDelete}
        title={TASKS_TEXTS.deleteCard}
        description={TASKS_TEXTS.deleteCardDescription(task.title)}
        confirmLabel={TASKS_TEXTS.deleteCardConfirm}
        onConfirm={deleteTask}
      />
    </div>
  )
}
