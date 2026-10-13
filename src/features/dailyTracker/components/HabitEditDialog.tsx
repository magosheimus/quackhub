import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { HabitFormFields } from '@/features/dailyTracker/components/HabitFormFields'
import { useHabitForm } from '@/features/dailyTracker/hooks/useHabitForm'
import { useUpdateHabit } from '@/features/dailyTracker/hooks/useHabitMutations'
import { DAILY_TRACKER_TEXTS } from '@/features/dailyTracker/constants/texts'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import type { Habit } from '@/shared/types/entities'

type HabitEditDialogProps = {
  habit: Habit
  weekdayOrder: number[]
  onClose: () => void
}

export function HabitEditDialog({
  habit,
  weekdayOrder,
  onClose,
}: HabitEditDialogProps) {
  const { values, update, toggleWeekday, fields } = useHabitForm(habit)
  const { mutate: updateHabit, isPending } = useUpdateHabit()

  function save() {
    if (!fields) {
      return
    }
    updateHabit({ id: habit.id, changes: fields }, { onSuccess: onClose })
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{DAILY_TRACKER_TEXTS.editTitle}</DialogTitle>
        </DialogHeader>
        <HabitFormFields
          idPrefix={`edit-habit-${habit.id}`}
          values={values}
          weekdayOrder={weekdayOrder}
          onChange={update}
          onToggleWeekday={toggleWeekday}
          isTypeLocked
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {COMMON_TEXTS.cancel}
          </Button>
          <Button onClick={save} disabled={!fields || isPending}>
            {DAILY_TRACKER_TEXTS.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
