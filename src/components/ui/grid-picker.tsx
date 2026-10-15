import { useState, type ReactNode } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { IconChevronDown } from '@/shared/lib/icons'
import { cn } from '@/shared/lib/utils'

type GridPickerProps<T> = {
  labelId?: string
  ariaLabel?: string
  options: readonly T[]
  value: T
  onChange: (option: T) => void
  getLabel: (option: T) => string
  renderOption: (option: T) => ReactNode
  columns: string
  triggerClassName?: string
}

export function GridPicker<T>({
  labelId,
  ariaLabel,
  options,
  value,
  onChange,
  getLabel,
  renderOption,
  columns,
  triggerClassName = 'w-full',
}: GridPickerProps<T>) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-labelledby={labelId}
        aria-label={ariaLabel}
        className={cn(
          'flex h-8 items-center justify-between gap-1.5 rounded-(--control-radius) border border-(--control-border) bg-(--control-bg) pr-2 pl-2.5 text-sm transition-colors outline-none hover:bg-(--control-hover) focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
          triggerClassName,
        )}
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
          aria-label={ariaLabel}
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
