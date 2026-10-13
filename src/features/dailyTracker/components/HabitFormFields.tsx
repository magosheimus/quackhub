import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { HabitAppearancePicker } from '@/features/dailyTracker/components/HabitAppearancePicker'
import { WeekdayPicker } from '@/features/dailyTracker/components/WeekdayPicker'
import {
  DAILY_TRACKER_TEXTS,
  HABIT_TYPE_LABELS,
} from '@/features/dailyTracker/constants/texts'
import type { HabitFormValues } from '@/features/dailyTracker/lib/dailyTracker'
import { HABIT_TYPES, isHabitType } from '@/shared/lib/enums'

type HabitFormFieldsProps = {
  idPrefix: string
  values: HabitFormValues
  weekdayOrder: number[]
  onChange: (changes: Partial<HabitFormValues>) => void
  onToggleWeekday: (weekday: number) => void
  isTypeLocked?: boolean
}

export function HabitFormFields({
  idPrefix,
  values,
  weekdayOrder,
  onChange,
  onToggleWeekday,
  isTypeLocked = false,
}: HabitFormFieldsProps) {
  const isCounter = values.type === 'counter'

  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="text-caption">{DAILY_TRACKER_TEXTS.habitName}</span>
        <Input
          value={values.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder={DAILY_TRACKER_TEXTS.habitNamePlaceholder}
        />
      </label>

      <HabitAppearancePicker
        idPrefix={idPrefix}
        icon={values.icon}
        color={values.color}
        onIconChange={(icon) => onChange({ icon })}
        onColorChange={(color) => onChange({ color })}
      />

      <div className="grid grid-cols-[minmax(0,1fr)_6rem] gap-3">
        <div className="flex min-w-0 flex-col gap-1.5">
          <span id={`${idPrefix}-type`} className="text-caption">
            {DAILY_TRACKER_TEXTS.habitType}
          </span>
          <Select
            value={values.type}
            disabled={isTypeLocked}
            onValueChange={(value) => {
              if (isHabitType(value)) {
                onChange({ type: value })
              }
            }}
          >
            <SelectTrigger
              aria-labelledby={`${idPrefix}-type`}
              className="w-full"
            >
              <SelectValue>{HABIT_TYPE_LABELS[values.type]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {HABIT_TYPES.map((option) => (
                <SelectItem key={option} value={option}>
                  {HABIT_TYPE_LABELS[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <label className="flex min-w-0 flex-col gap-1.5">
          <span className="text-caption">{DAILY_TRACKER_TEXTS.goal}</span>
          <Input
            type="text"
            inputMode="numeric"
            value={isCounter ? values.goalText : ''}
            onChange={(e) => onChange({ goalText: e.target.value })}
            placeholder={isCounter ? '5' : DAILY_TRACKER_TEXTS.goalDisabled}
            disabled={!isCounter}
          />
        </label>
        {isTypeLocked && (
          <span className="col-span-2 text-caption">
            {DAILY_TRACKER_TEXTS.typeLockedHint}
          </span>
        )}
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_6rem] items-end gap-3">
        <div className="flex min-w-0 flex-col gap-1.5">
          <span className="text-caption">{DAILY_TRACKER_TEXTS.weekdays}</span>
          <WeekdayPicker
            order={weekdayOrder}
            selected={values.weekdays}
            onToggle={onToggleWeekday}
            label={DAILY_TRACKER_TEXTS.weekdays}
          />
        </div>
        <label className="flex min-w-0 flex-col gap-1.5">
          <span className="text-caption">{DAILY_TRACKER_TEXTS.duration}</span>
          <Input
            type="text"
            inputMode="numeric"
            value={values.durationText}
            onChange={(e) => onChange({ durationText: e.target.value })}
            placeholder={DAILY_TRACKER_TEXTS.durationPlaceholder}
          />
        </label>
      </div>
    </div>
  )
}
