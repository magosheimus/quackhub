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
import { useCreateHabit } from '@/features/dailyTracker/hooks/useHabitMutations'
import { useWeekdayOrder } from '@/features/dailyTracker/hooks/useWeekdayOrder'
import {
  DAILY_TRACKER_TEXTS,
  NEW_HABIT_ID_PREFIX,
} from '@/features/dailyTracker/constants/texts'
import { COMMON_TEXTS } from '@/shared/constants/texts'

type HabitCreateDialogProps = {
  initialName: string
  onCreated: () => void
  onClose: () => void
}

export function HabitCreateDialog({
  initialName,
  onCreated,
  onClose,
}: HabitCreateDialogProps) {
  const { values, update, toggleWeekday, fields } = useHabitForm(
    undefined,
    initialName,
  )
  const { mutate: createHabit, isPending } = useCreateHabit()
  const weekdayOrder = useWeekdayOrder()

  function save() {
    if (!fields) {
      return
    }
    createHabit(fields, {
      onSuccess: () => {
        onCreated()
        onClose()
      },
    })
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{DAILY_TRACKER_TEXTS.newHabitTitle}</DialogTitle>
        </DialogHeader>
        <HabitFormFields
          idPrefix={`${NEW_HABIT_ID_PREFIX}-dialog`}
          values={values}
          weekdayOrder={weekdayOrder}
          onChange={update}
          onToggleWeekday={toggleWeekday}
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {COMMON_TEXTS.cancel}
          </Button>
          <Button onClick={save} disabled={!fields || isPending}>
            {DAILY_TRACKER_TEXTS.addHabit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
