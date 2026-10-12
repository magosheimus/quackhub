import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  RecurrenceFields,
  type RecurrenceValue,
} from '@/features/tasks/components/RecurrenceFields'
import { canRegisterPerformance } from '@/features/srs/lib/review'
import type { ProjectType, Task } from '@/shared/types/entities'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { TASKS_TEXTS } from '@/features/tasks/constants/texts'
import { Panel } from '@/components/ui/panel'

function formatDate(value: string | null): string {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('pt-BR')
}

type CardSidePanelProps = {
  projectType?: ProjectType | null
  status: Task['status']
  createdAt: string | null
  updatedAt: string | null
  dueDate: string | null
  easeFactor: number | null
  nextReview: string | null
  recurrenceValue: RecurrenceValue
  onDueDateChange: (value: string | null) => void
  onRecurrenceChange: (value: RecurrenceValue) => void
  onRegisterPerformance: () => void
}

export function CardSidePanel({
  projectType,
  status,
  createdAt,
  updatedAt,
  dueDate,
  easeFactor,
  nextReview,
  recurrenceValue,
  onDueDateChange,
  onRecurrenceChange,
  onRegisterPerformance,
}: CardSidePanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <Panel className="flex flex-col gap-1.5 p-3">
        <span className="text-sm font-medium text-fg">{TASKS_TEXTS.dates}</span>
        <span className="text-sm text-fg">
          {TASKS_TEXTS.createdAt(formatDate(createdAt))}
        </span>
        <span className="text-sm text-fg">
          {TASKS_TEXTS.updatedAt(formatDate(updatedAt))}
        </span>
      </Panel>

      {projectType === 'general' && (
        <>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="card-due-date" className="text-caption">
              {TASKS_TEXTS.dueDate}
            </label>
            <Input
              id="card-due-date"
              type="date"
              value={dueDate ?? ''}
              onChange={(e) => onDueDateChange(e.target.value || null)}
            />
          </div>

          <RecurrenceFields
            value={recurrenceValue}
            onChange={onRecurrenceChange}
          />
        </>
      )}

      {canRegisterPerformance(projectType, status) && (
        <Panel className="flex flex-col gap-1.5 p-3">
          <span className="text-sm font-medium text-fg">{TASKS_TEXTS.srs}</span>
          <span className="text-sm text-fg">
            EF: {(easeFactor ?? 2.5).toFixed(2)}
          </span>
          <span className="text-sm text-fg">
            Próxima revisão: {nextReview ?? '—'}
          </span>
          <Button type="button" size="sm" onClick={onRegisterPerformance}>
            {COMMON_TEXTS.registerPerformance}
          </Button>
        </Panel>
      )}
    </div>
  )
}
