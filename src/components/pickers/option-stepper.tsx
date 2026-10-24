import { Button } from '@/components/ui/button'
import { IconChevronLeft, IconChevronRight } from '@/shared/lib/icons'
import { cycleItem } from '@/shared/lib/array'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { cn } from '@/shared/lib/utils'

type OptionStepperProps<T extends string | number> = {
  label: string
  options: readonly T[]
  value: T
  labels: Record<T, string>
  onChange: (value: T) => void
  disabled?: boolean
}

export function OptionStepper<T extends string | number>({
  label,
  options,
  value,
  labels,
  onChange,
  disabled = false,
}: OptionStepperProps<T>) {
  return (
    <div role="group" aria-label={label} className="flex items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={COMMON_TEXTS.previousOption(label)}
        disabled={disabled}
        onClick={() => onChange(cycleItem(options, value, -1))}
      >
        <IconChevronLeft size={16} aria-hidden="true" />
      </Button>
      <span
        aria-live="polite"
        className={cn(
          'w-36 text-center text-body-sm',
          disabled ? 'text-fg-muted' : 'text-fg',
        )}
      >
        {labels[value]}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={COMMON_TEXTS.nextOption(label)}
        disabled={disabled}
        onClick={() => onChange(cycleItem(options, value, 1))}
      >
        <IconChevronRight size={16} aria-hidden="true" />
      </Button>
    </div>
  )
}

const ON_OFF_OPTIONS = ['off', 'on'] as const
type OnOff = (typeof ON_OFF_OPTIONS)[number]

const ON_OFF_LABELS: Record<OnOff, string> = {
  off: COMMON_TEXTS.off,
  on: COMMON_TEXTS.on,
}

type OnOffStepperProps = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function OnOffStepper({ label, checked, onChange }: OnOffStepperProps) {
  return (
    <OptionStepper
      label={label}
      options={ON_OFF_OPTIONS}
      value={checked ? 'on' : 'off'}
      labels={ON_OFF_LABELS}
      onChange={(value) => onChange(value === 'on')}
    />
  )
}
