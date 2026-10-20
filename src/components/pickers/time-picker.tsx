import { useState, type KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { IconClock } from '@/shared/lib/icons'
import { getTimeSlots, parseTimeInput } from '@/shared/lib/date'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { cn } from '@/shared/lib/utils'

const TIME_SLOTS = getTimeSlots()

type TimePickerProps = {
  value: string | null
  onChange: (value: string | null) => void
  label: string
  id?: string
  disabled?: boolean
  className?: string
}

// Campo de horário do app: lista de 30 em 30 minutos e campo para digitar
// qualquer horário ('14h30', '1430'...). Valor 'HH:mm' ou null
export function TimePicker({
  value,
  onChange,
  label,
  id,
  disabled,
  className,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [typed, setTyped] = useState('')
  const current = value?.slice(0, 5) ?? null

  function choose(time: string | null) {
    onChange(time)
    setTyped('')
    setIsOpen(false)
  }

  function handleTypedKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') {
      return
    }
    event.preventDefault()
    const time = parseTimeInput(typed)
    if (time) {
      choose(time)
    }
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
        <IconClock size={16} aria-hidden="true" />
        <span className={cn('truncate', !current && 'text-fg-muted')}>
          {current ?? COMMON_TEXTS.pickTime}
        </span>
      </PopoverTrigger>
      <PopoverContent className="flex w-44 flex-col gap-2 p-2">
        <Input
          value={typed}
          onChange={(event) => setTyped(event.target.value)}
          onKeyDown={handleTypedKeyDown}
          placeholder={COMMON_TEXTS.typeTime}
          aria-label={COMMON_TEXTS.typeTime}
          aria-invalid={typed !== '' && parseTimeInput(typed) === null}
        />
        <div className="flex max-h-56 flex-col overflow-y-auto">
          {TIME_SLOTS.map((slot) => (
            <Button
              key={slot}
              type="button"
              size="sm"
              variant={slot === current ? 'selected' : 'ghost'}
              onClick={() => choose(slot)}
              className="justify-start"
            >
              {slot}
            </Button>
          ))}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => choose(null)}
          disabled={!value}
          className="border-t border-border"
        >
          {COMMON_TEXTS.clear}
        </Button>
      </PopoverContent>
    </Popover>
  )
}
