import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { IconCalendar } from '@/shared/lib/icons'
import {
  formatFullDate,
  parseDbDate,
  todayLocal,
  toDbDate,
  type DateFormat,
} from '@/shared/lib/date'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { cn } from '@/shared/lib/utils'

type DatePickerProps = {
  value: string | null
  onChange: (value: string | null) => void
  label: string
  dateFormat: DateFormat
  weekStartsOn: 0 | 1
  placeholder?: string
  id?: string
  disabled?: boolean
  className?: string
}

export function DatePicker({
  value,
  onChange,
  label,
  dateFormat,
  weekStartsOn,
  placeholder = COMMON_TEXTS.pickDate,
  id,
  disabled,
  className,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selected = value ? parseDbDate(value) : undefined

  function choose(date: string | null) {
    onChange(date)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            aria-label={label}
            className={cn(
              'w-full min-w-0 justify-start gap-2 font-normal',
              className,
            )}
          />
        }
      >
        <IconCalendar size={16} aria-hidden="true" />
        <span className={cn('truncate', !value && 'text-fg-muted')}>
          {value ? formatFullDate(value, dateFormat) : placeholder}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          weekStartsOn={weekStartsOn}
          onSelect={(date) => choose(date ? toDbDate(date) : null)}
        />
        <div className="mt-3 flex justify-between gap-2 border-t border-border pt-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => choose(null)}
            disabled={!value}
          >
            {COMMON_TEXTS.clear}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => choose(todayLocal())}
          >
            {COMMON_TEXTS.today}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
