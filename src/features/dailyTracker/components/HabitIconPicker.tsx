import { HABIT_ICONS } from '@/features/dailyTracker/components/habitIcons'
import {
  DAILY_TRACKER_TEXTS,
  HABIT_ICON_LABELS,
} from '@/features/dailyTracker/constants/texts'
import {
  HABIT_ICON_KEYS,
  type HabitIconKey,
} from '@/features/dailyTracker/lib/habitAppearance'
import { GridPicker } from '@/components/pickers/grid-picker'

type HabitIconPickerProps = {
  idPrefix: string
  icon: HabitIconKey
  onIconChange: (icon: HabitIconKey) => void
}

function renderIcon(icon: HabitIconKey) {
  const Icon = HABIT_ICONS[icon]
  return <Icon size={16} aria-hidden="true" />
}

export function HabitIconPicker({
  idPrefix,
  icon,
  onIconChange,
}: HabitIconPickerProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span id={`${idPrefix}-icon`} className="text-caption">
        {DAILY_TRACKER_TEXTS.habitIcon}
      </span>
      <GridPicker
        labelId={`${idPrefix}-icon`}
        options={HABIT_ICON_KEYS}
        value={icon}
        onChange={onIconChange}
        getLabel={(key) => HABIT_ICON_LABELS[key]}
        renderOption={renderIcon}
        columns="grid-cols-6"
      />
    </div>
  )
}
