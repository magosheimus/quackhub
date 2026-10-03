import { useState } from 'react'
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

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

function toEndOfMonthDate(yearMonth: string): string {
  const [year, monthNumber] = yearMonth.split('-').map(Number)
  const lastDay = new Date(year, monthNumber, 0).getDate()
  return `${yearMonth}-${String(lastDay).padStart(2, '0')}`
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

  const isMonthPrecision = value.type === 'monthly' || value.type === 'yearly'

  return (
    <div className="flex flex-col gap-2 rounded-md border border-border p-3">
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
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="recurrence-day-of-month"
            className="text-xs text-(--text-muted)"
          >
            Dia do mês
          </label>
          <Input
            id="recurrence-day-of-month"
            type="number"
            min={1}
            max={31}
            value={value.dayOfMonth ?? ''}
            onChange={(e) =>
              onChange({
                ...value,
                dayOfMonth: e.target.value ? Number(e.target.value) : null,
              })
            }
          />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-(--text-muted)">
          Repetir até (opcional)
        </span>
        {isMonthPrecision ? (
          <MonthYearField
            endDate={value.endDate}
            onChange={(endDate) => onChange({ ...value, endDate })}
          />
        ) : (
          <Input
            type="date"
            aria-label="Repetir até"
            value={value.endDate ?? ''}
            onChange={(e) =>
              onChange({ ...value, endDate: e.target.value || null })
            }
          />
        )}
      </div>
    </div>
  )
}

type MonthYearFieldProps = {
  endDate: string | null
  onChange: (endDate: string | null) => void
}

function MonthYearField({ endDate, onChange }: MonthYearFieldProps) {
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 11 }, (_, index) =>
    String(currentYear + index),
  )
  const [month, setMonth] = useState(endDate ? endDate.slice(5, 7) : '')
  const [year, setYear] = useState(endDate ? endDate.slice(0, 4) : '')

  function update(nextMonth: string, nextYear: string) {
    setMonth(nextMonth)
    setYear(nextYear)
    onChange(
      nextMonth && nextYear
        ? toEndOfMonthDate(`${nextYear}-${nextMonth}`)
        : null,
    )
  }

  return (
    <div className="flex gap-2">
      <Select value={month} onValueChange={(v) => update(v ?? '', year)}>
        <SelectTrigger className="flex-1" aria-label="Mês">
          <SelectValue>{MONTH_NAMES[Number(month) - 1] ?? 'Mês'}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {MONTH_NAMES.map((name, index) => {
            const monthValue = String(index + 1).padStart(2, '0')
            return (
              <SelectItem key={monthValue} value={monthValue}>
                {name}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>

      <Select value={year} onValueChange={(v) => update(month, v ?? '')}>
        <SelectTrigger className="w-28" aria-label="Ano">
          <SelectValue>{year || 'Ano'}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {yearOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
