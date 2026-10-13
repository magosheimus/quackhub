import type { FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { HabitFormFields } from '@/features/dailyTracker/components/HabitFormFields'
import { useHabitForm } from '@/features/dailyTracker/hooks/useHabitForm'
import { useCreateHabit } from '@/features/dailyTracker/hooks/useHabitMutations'
import {
  DAILY_TRACKER_TEXTS,
  NEW_HABIT_ID_PREFIX,
} from '@/features/dailyTracker/constants/texts'
import { IconPlus } from '@/shared/lib/icons'

type NewHabitFormProps = {
  weekdayOrder: number[]
}

export function NewHabitForm({ weekdayOrder }: NewHabitFormProps) {
  const { values, update, toggleWeekday, fields, reset } = useHabitForm()
  const { mutate: createHabit, isPending } = useCreateHabit()

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!fields) {
      return
    }
    createHabit(fields, { onSuccess: reset })
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <HabitFormFields
        idPrefix={NEW_HABIT_ID_PREFIX}
        values={values}
        weekdayOrder={weekdayOrder}
        onChange={update}
        onToggleWeekday={toggleWeekday}
      />
      <Button type="submit" disabled={!fields || isPending}>
        <IconPlus size={12} aria-hidden="true" />
        {DAILY_TRACKER_TEXTS.addHabit}
      </Button>
    </form>
  )
}
