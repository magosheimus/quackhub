import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

export type RecurrenceValue = {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly' | null
  interval: number | null
  dayOfMonth: number | null
  endDate: string | null
}

type RecurrenceFieldsProps = {
  value: RecurrenceValue
  onChange: (value: RecurrenceValue) => void
}

const TYPE_LABELS: Record<NonNullable<RecurrenceValue['type']>, string> = {
  daily: 'Diária',
  weekly: 'Semanal',
  monthly: 'Mensal',
  yearly: 'Anual',
}

export function RecurrenceFields({ value, onChange }: RecurrenceFieldsProps) {
  if (!value.type) {
    return (
      <button
        type="button"
        onClick={() => onChange({ ...value, type: 'monthly', interval: 1 })}
        className="text-left text-sm text-[--text-muted]"
      >
        [ Não recorrente ▾ ]
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-2 rounded-[--radius-md] border border-[--border] p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[--text-muted]">Recorrência</span>
        <button
          type="button"
          onClick={() =>
            onChange({
              type: null,
              interval: null,
              dayOfMonth: null,
              endDate: null,
            })
          }
          className="text-xs text-[--text-muted] underline"
        >
          remover
        </button>
      </div>

      <Select
        value={value.type}
        onValueChange={(v) =>
          onChange({
            ...value,
            type: v as NonNullable<RecurrenceValue['type']>,
          })
        }
      >
        <SelectTrigger>
          <SelectValue>{TYPE_LABELS[value.type]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Diária</SelectItem>
          <SelectItem value="weekly">Semanal</SelectItem>
          <SelectItem value="monthly">Mensal</SelectItem>
          <SelectItem value="yearly">Anual</SelectItem>
        </SelectContent>
      </Select>

      {value.type === 'monthly' && (
        <Input
          type="number"
          min={1}
          max={31}
          placeholder="Dia do mês"
          value={value.dayOfMonth ?? ''}
          onChange={(e) =>
            onChange({
              ...value,
              dayOfMonth: e.target.value ? Number(e.target.value) : null,
            })
          }
        />
      )}

      <Input
        type="date"
        value={value.endDate ?? ''}
        onChange={(e) =>
          onChange({ ...value, endDate: e.target.value || null })
        }
        placeholder="Data final (opcional)"
      />
    </div>
  )
}
