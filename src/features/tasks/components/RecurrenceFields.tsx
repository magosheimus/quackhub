import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { isRecurrenceType } from '@/shared/lib/enums'
import type { RecurrenceType } from '@/shared/types/entities'
import {
  MONTH_NAMES,
  RECURRENCE_TYPE_LABELS,
  TASKS_TEXTS,
} from '@/features/tasks/constants/texts'

export type RecurrenceValue = {
  type: RecurrenceType | null
  interval: number | null
  dayOfMonth: number | null
  endDate: string | null
}

type RecurrenceFieldsProps = {
  value: RecurrenceValue
  onChange: (value: RecurrenceValue) => void
}

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
        className="flex h-8 items-center text-left text-subtle"
      >
        {TASKS_TEXTS.notRecurring}
      </button>
    )
  }

  const isMonthPrecision = value.type === 'monthly' || value.type === 'yearly'

  return (
    <div className="flex flex-col gap-2 rounded-md border border-border p-3">
      <div className="flex items-center justify-between">
        <span className="text-caption">{TASKS_TEXTS.recurrence}</span>
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
          className="text-caption underline"
        >
          {TASKS_TEXTS.removeRecurrence}
        </button>
      </div>

      <Select
        value={value.type}
        onValueChange={(v) => {
          if (isRecurrenceType(v)) {
            onChange({ ...value, type: v })
          }
        }}
      >
        <SelectTrigger>
          <SelectValue>{RECURRENCE_TYPE_LABELS[value.type]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">{RECURRENCE_TYPE_LABELS.daily}</SelectItem>
          <SelectItem value="weekly">
            {RECURRENCE_TYPE_LABELS.weekly}
          </SelectItem>
          <SelectItem value="monthly">
            {RECURRENCE_TYPE_LABELS.monthly}
          </SelectItem>
          <SelectItem value="yearly">
            {RECURRENCE_TYPE_LABELS.yearly}
          </SelectItem>
        </SelectContent>
      </Select>

      {value.type === 'monthly' && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="recurrence-day-of-month" className="text-caption">
            {TASKS_TEXTS.dayOfMonth}
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
        <span className="text-caption">{TASKS_TEXTS.repeatUntilOptional}</span>
        {isMonthPrecision ? (
          <MonthYearField
            endDate={value.endDate}
            onChange={(endDate) => onChange({ ...value, endDate })}
          />
        ) : (
          <Input
            type="date"
            aria-label={TASKS_TEXTS.repeatUntil}
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
        <SelectTrigger className="flex-1" aria-label={TASKS_TEXTS.month}>
          <SelectValue>
            {MONTH_NAMES[Number(month) - 1] ?? TASKS_TEXTS.month}
          </SelectValue>
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
        <SelectTrigger className="w-28" aria-label={TASKS_TEXTS.year}>
          <SelectValue>{year || TASKS_TEXTS.year}</SelectValue>
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
