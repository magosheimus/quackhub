import { useState } from 'react'
import {
  buildHabitFields,
  getHabitFormValues,
  type HabitFormValues,
} from '@/features/dailyTracker/lib/dailyTracker'
import type { Habit } from '@/shared/types/entities'

export function useHabitForm(habit?: Habit) {
  const [values, setValues] = useState<HabitFormValues>(() =>
    getHabitFormValues(habit),
  )

  function update(changes: Partial<HabitFormValues>) {
    setValues((current) => ({ ...current, ...changes }))
  }

  function toggleWeekday(weekday: number) {
    setValues((current) => ({
      ...current,
      weekdays: current.weekdays.includes(weekday)
        ? current.weekdays.filter((day) => day !== weekday)
        : [...current.weekdays, weekday],
    }))
  }

  return {
    values,
    update,
    toggleWeekday,
    fields: buildHabitFields(values),
    reset: () => setValues(getHabitFormValues(habit)),
  }
}
