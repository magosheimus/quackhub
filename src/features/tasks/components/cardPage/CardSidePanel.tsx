import {
  IconAlarmClock,
  IconCalendar,
  IconRefresh,
  IconUsers,
} from '@/shared/lib/icons'
import { SectionLabel } from '@/components/layout/section-label'
import { Button } from '@/components/ui/button'
import { RecurrenceFields } from '@/features/tasks/components/RecurrenceFields'
import type { RecurrenceValue } from '@/features/tasks/lib/recurrence'
import { canRegisterPerformance } from '@/features/srs/lib/review'
import type { ProjectType } from '@/shared/types/entities'
import type { Task, TaskDue, TaskSrs } from '@/features/tasks/model/task'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { TASKS_TEXTS } from '@/features/tasks/constants/texts'
import { Panel } from '@/components/layout/panel'
import { AssigneeCombobox } from '@/features/personas/components/AssigneeCombobox'
import { PERSONAS_TEXTS } from '@/features/personas/constants/texts'
import { DatePicker } from '@/components/pickers/date-picker'
import { TimePicker } from '@/components/pickers/time-picker'
import { useDatePreferences } from '@/features/settings/hooks/useDatePreferences'

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
  const datePreferences = useDatePreferences()
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
          <SectionLabel icon={IconAlarmClock}>
            {TASKS_TEXTS.deadline}
          </SectionLabel>
          <div className="flex flex-col gap-3">
            <div className="flex min-w-0 flex-col gap-1.5">
              <label htmlFor="card-due-date" className="text-caption">
                {TASKS_TEXTS.dueDay}
              </label>
              <DatePicker
                id="card-due-date"
                label={TASKS_TEXTS.dueDateLabel}
                value={due?.date ?? null}
                onChange={onDueDateChange}
                {...datePreferences}
              />
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
              <label htmlFor="card-due-time" className="text-caption">
                {TASKS_TEXTS.dueTime}
              </label>
              <TimePicker
                id="card-due-time"
                label={TASKS_TEXTS.dueTime}
                value={due?.time ?? null}
                onChange={onDueTimeChange}
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
