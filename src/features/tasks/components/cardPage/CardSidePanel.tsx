import { IconCalendar, IconRefresh, IconUsers } from '@/shared/lib/icons'
import { SectionLabel } from '@/components/layout/section-label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RecurrenceFields } from '@/features/tasks/components/RecurrenceFields'
import type { RecurrenceValue } from '@/features/tasks/lib/recurrence'
import { canRegisterPerformance } from '@/features/srs/lib/review'
import type { ProjectType } from '@/shared/types/entities'
import type { Task, TaskDue, TaskSrs } from '@/features/tasks/model/task'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { TASKS_TEXTS } from '@/features/tasks/constants/texts'
import { Panel } from '@/components/layout/panel'
import { formatDueTime } from '@/features/tasks/lib/due'
import { AssigneeCombobox } from '@/features/personas/components/AssigneeCombobox'
import { PERSONAS_TEXTS } from '@/features/personas/constants/texts'

function formatDate(value: string | null): string {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('pt-BR')
}

type CardSidePanelProps = {
  projectType?: ProjectType | null
  status: Task['status']
  assigneeId: string | null
  createdAt: string | null
  updatedAt: string | null
  due: TaskDue | null
  srs: TaskSrs | null
  recurrenceValue: RecurrenceValue
  onAssigneeChange: (assigneeId: string | null) => void
  onDueDateChange: (value: string | null) => void
  onDueTimeChange: (value: string | null) => void
  onRecurrenceChange: (value: RecurrenceValue) => void
  onRegisterPerformance: () => void
}

export function CardSidePanel({
  projectType,
  status,
  assigneeId,
  createdAt,
  updatedAt,
  due,
  srs,
  recurrenceValue,
  onAssigneeChange,
  onDueDateChange,
  onDueTimeChange,
  onRecurrenceChange,
  onRegisterPerformance,
}: CardSidePanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <Panel className="flex flex-col gap-2 p-3">
        <SectionLabel icon={IconUsers}>{PERSONAS_TEXTS.people}</SectionLabel>
        <div className="flex flex-col gap-1.5">
          <span id="card-page-assignee-label" className="text-caption">
            {PERSONAS_TEXTS.assignee}
          </span>
          <AssigneeCombobox
            value={assigneeId}
            onChange={onAssigneeChange}
            labelId="card-page-assignee-label"
            inline
          />
        </div>
      </Panel>

      <Panel className="flex flex-col gap-1.5 p-3">
        <SectionLabel icon={IconCalendar}>{TASKS_TEXTS.dates}</SectionLabel>
        <span className="text-body">
          {TASKS_TEXTS.createdAt(formatDate(createdAt))}
        </span>
        <span className="text-body">
          {TASKS_TEXTS.updatedAt(formatDate(updatedAt))}
        </span>
      </Panel>

      {projectType === 'general' && (
        <Panel className="flex flex-col gap-3 p-3">
          <div className="flex gap-2">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <label htmlFor="card-due-date" className="text-caption">
                {TASKS_TEXTS.dueDate}
              </label>
              <Input
                id="card-due-date"
                type="date"
                value={due?.date ?? ''}
                onChange={(e) => onDueDateChange(e.target.value || null)}
              />
            </div>
            <div className="flex w-28 shrink-0 flex-col gap-1.5">
              <label htmlFor="card-due-time" className="text-caption">
                {TASKS_TEXTS.dueTime}
              </label>
              <Input
                id="card-due-time"
                type="time"
                value={formatDueTime(due?.time ?? null) ?? ''}
                onChange={(e) => onDueTimeChange(e.target.value || null)}
                disabled={!due}
              />
            </div>
          </div>

          <RecurrenceFields
            value={recurrenceValue}
            onChange={onRecurrenceChange}
          />
        </Panel>
      )}

      {canRegisterPerformance(projectType, status) && (
        <Panel className="flex flex-col gap-1.5 p-3">
          <SectionLabel icon={IconRefresh}>{TASKS_TEXTS.srs}</SectionLabel>
          <span className="text-body">
            {TASKS_TEXTS.easeFactor((srs?.easeFactor ?? 2.5).toFixed(2))}
          </span>
          <span className="text-body">
            {TASKS_TEXTS.nextReview(srs?.nextReview ?? '—')}
          </span>
          <Button type="button" size="sm" onClick={onRegisterPerformance}>
            {COMMON_TEXTS.registerPerformance}
          </Button>
        </Panel>
      )}
    </div>
  )
}
