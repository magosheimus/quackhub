import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { EmptyMessage } from '@/components/ui/empty-message'
import { HabitIcon } from '@/features/dailyTracker/components/HabitIcon'
import { HabitEditDialog } from '@/features/dailyTracker/components/HabitEditDialog'
import { NewHabitForm } from '@/features/dailyTracker/components/NewHabitForm'
import { WeekdayPicker } from '@/features/dailyTracker/components/WeekdayPicker'
import { useHabitManager } from '@/features/dailyTracker/hooks/useHabitManager'
import { DAILY_TRACKER_TEXTS } from '@/features/dailyTracker/constants/texts'
import { IconPencil, IconPlus, IconTrash } from '@/shared/lib/icons'
import type { Habit } from '@/shared/types/entities'

type HabitManagerProps = {
  habits: Habit[]
  weekdayOrder: number[]
}

const TABLE =
  'grid grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,1fr)_auto_auto_auto_auto_auto]'

const ROW = 'col-span-full grid grid-cols-subgrid'

const NAME_CELL = 'flex min-w-0 items-center gap-2 pr-4'

const COLUMN_CELL = 'hidden items-center border-l border-border px-4 lg:flex'

const CENTERED_CELL = `${COLUMN_CELL} justify-center`

const ACTIONS_CELL =
  'flex items-center gap-1 pl-3 lg:border-l lg:border-border lg:pl-4'

export function HabitManager({ habits, weekdayOrder }: HabitManagerProps) {
  const {
    rows,
    editingHabit,
    startEditing,
    stopEditing,
    deletingHabit,
    startDeleting,
    stopDeleting,
    confirmDelete,
  } = useHabitManager(habits)

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="flex min-w-0 flex-col">
        {habits.length === 0 ? (
          <EmptyMessage>{DAILY_TRACKER_TEXTS.noHabits}</EmptyMessage>
        ) : (
          <div className={TABLE}>
            <div
              className={`${ROW} border-b border-border text-xs text-fg-muted *:py-2`}
            >
              <span className={NAME_CELL}>
                {DAILY_TRACKER_TEXTS.columnName}
              </span>
              <span className={COLUMN_CELL}>
                {DAILY_TRACKER_TEXTS.columnType}
              </span>
              <span className={CENTERED_CELL}>
                {DAILY_TRACKER_TEXTS.columnGoal}
              </span>
              <span className={COLUMN_CELL}>
                {DAILY_TRACKER_TEXTS.columnDays}
              </span>
              <span className={CENTERED_CELL}>
                {DAILY_TRACKER_TEXTS.columnDuration}
              </span>
              <span className={ACTIONS_CELL} />
            </div>
            <ul className={ROW}>
              {rows.map(
                ({ habit, typeLabel, goalLabel, weekdays, durationLabel }) => (
                  <li
                    key={habit.id}
                    className={`${ROW} border-b border-border text-sm *:py-3`}
                  >
                    <span className={NAME_CELL}>
                      <HabitIcon habit={habit} />
                      <span className="truncate text-fg">{habit.name}</span>
                    </span>
                    <span className={`${COLUMN_CELL} text-caption`}>
                      {typeLabel}
                    </span>
                    <span className={`${CENTERED_CELL} text-fg`}>
                      {goalLabel}
                    </span>
                    <span className={COLUMN_CELL}>
                      <WeekdayPicker
                        order={weekdayOrder}
                        selected={weekdays}
                        label={DAILY_TRACKER_TEXTS.columnDays}
                      />
                    </span>
                    <span className={`${CENTERED_CELL} text-caption`}>
                      {durationLabel}
                    </span>
                    <span className={ACTIONS_CELL}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={DAILY_TRACKER_TEXTS.edit(habit.name)}
                        title={DAILY_TRACKER_TEXTS.editLabel}
                        onClick={() => startEditing(habit)}
                      >
                        <IconPencil size={14} aria-hidden="true" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={DAILY_TRACKER_TEXTS.delete(habit.name)}
                        title={DAILY_TRACKER_TEXTS.deleteLabel}
                        onClick={() => startDeleting(habit)}
                      >
                        <IconTrash size={14} aria-hidden="true" />
                      </Button>
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>
        )}
      </div>

      <aside className="flex flex-col gap-3 border-t border-border pt-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
        <span className="flex items-center gap-1.5 text-sm font-medium text-fg">
          <IconPlus size={14} aria-hidden="true" />
          {DAILY_TRACKER_TEXTS.newHabitTitle}
        </span>
        <NewHabitForm weekdayOrder={weekdayOrder} />
      </aside>

      {editingHabit && (
        <HabitEditDialog
          key={editingHabit.id}
          habit={editingHabit}
          weekdayOrder={weekdayOrder}
          onClose={stopEditing}
        />
      )}
      <ConfirmDialog
        open={deletingHabit !== null}
        onOpenChange={(open) => !open && stopDeleting()}
        title={DAILY_TRACKER_TEXTS.deleteTitle}
        description={DAILY_TRACKER_TEXTS.confirmDelete(
          deletingHabit?.name ?? '',
        )}
        confirmLabel={DAILY_TRACKER_TEXTS.deleteLabel}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
