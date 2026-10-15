import { useState, type ReactNode } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { HABIT_ICONS } from '@/features/dailyTracker/components/habitIcons'
import {
  DAILY_TRACKER_TEXTS,
  HABIT_ICON_LABELS,
} from '@/features/dailyTracker/constants/texts'
import {
  HABIT_ICON_KEYS,
  type HabitIconKey,
} from '@/features/dailyTracker/lib/habitAppearance'
import { IconChevronDown } from '@/shared/lib/icons'
import { cn } from '@/shared/lib/utils'

type HabitIconPickerProps = {
  idPrefix: string
  icon: HabitIconKey
  onIconChange: (icon: HabitIconKey) => void
}

type GridPickerProps<T> = {
  labelId: string
  options: readonly T[]
  value: T
  onChange: (option: T) => void
  getLabel: (option: T) => string
  renderOption: (option: T) => ReactNode
  columns: string
}

function GridPicker<T>({
  labelId,
  options,
  value,
  onChange,
  getLabel,
  renderOption,
  columns,
}: GridPickerProps<T>) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-labelledby={labelId}
        className="flex h-8 w-full items-center justify-between gap-1.5 rounded-(--control-radius) border border-(--control-border) bg-(--control-bg) pr-2 pl-2.5 text-sm transition-colors outline-none hover:bg-(--control-hover) focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <span className="flex items-center" title={getLabel(value)}>
          {renderOption(value)}
        </span>
        <IconChevronDown
          size={16}
          aria-hidden="true"
          className="text-muted-foreground"
        />
      </PopoverTrigger>
      <PopoverContent>
        <div
          className={cn('grid gap-1', columns)}
          role="group"
          aria-labelledby={labelId}
        >
          {options.map((option) => {
            const isSelected = option === value
            return (
              <button
                key={getLabel(option)}
                type="button"
                aria-pressed={isSelected}
                aria-label={getLabel(option)}
                title={getLabel(option)}
                onClick={() => {
                  onChange(option)
                  setOpen(false)
                }}
                className={cn(
                  'flex size-8 items-center justify-center rounded-sm border',
                  isSelected
                    ? 'border-strong bg-selected text-fg'
                    : 'border-transparent text-fg-muted hover:bg-hover hover:text-fg',
                )}
              >
                {renderOption(option)}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
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
