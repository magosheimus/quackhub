import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RecurrenceFields, type RecurrenceValue } from '../RecurrenceFields'
import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']

const SRS_ELIGIBLE_STATUSES: Task['status'][] = [
  'studying',
  'to_review',
  'scheduled',
]

function formatDate(value: string | null): string {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('pt-BR')
}

type CardSidePanelProps = {
  projectType?: string | null
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
      <div className="flex flex-col gap-1.5 rounded-md border border-border bg-(--bg-card) p-3">
        <span className="text-sm font-medium text-[--text-primary]">Datas</span>
        <span className="text-sm text-[--text-primary]">
          Criado: {formatDate(createdAt)}
        </span>
        <span className="text-sm text-[--text-primary]">
          Atualizado: {formatDate(updatedAt)}
        </span>
      </div>

      {projectType === 'general' && (
        <>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="card-due-date"
              className="text-xs text-[--text-muted]"
            >
              Due Date
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

      {projectType === 'study' && SRS_ELIGIBLE_STATUSES.includes(status) && (
        <div className="flex flex-col gap-1.5 rounded-md border border-border bg-(--bg-card) p-3">
          <span className="text-sm font-medium text-[--text-primary]">SRS</span>
          <span className="text-sm text-[--text-primary]">
            EF: {(easeFactor ?? 2.5).toFixed(2)}
          </span>
          <span className="text-sm text-[--text-primary]">
            Próxima revisão: {nextReview ?? '—'}
          </span>
          <Button type="button" size="sm" onClick={onRegisterPerformance}>
            Registrar Desempenho
          </Button>
        </div>
      )}
    </div>
  )
}
