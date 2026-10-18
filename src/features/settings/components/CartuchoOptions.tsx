import type { Settings } from '@/features/settings/lib/settings'
import { CARTUCHO_LABELS } from '@/features/settings/constants/texts'
import { cn } from '@/shared/lib/utils'

type CartuchoValue = Settings['cartucho']

const CARTUCHO_OPTIONS = (Object.keys(CARTUCHO_LABELS) as CartuchoValue[]).map(
  (value) => ({ value, label: CARTUCHO_LABELS[value] }),
)

type CartuchoOptionsProps = {
  selected: CartuchoValue
  onSelect: (value: CartuchoValue) => void
  size?: 'default' | 'compact'
  className?: string
}

export function CartuchoOptions({
  selected,
  onSelect,
  size = 'default',
  className,
}: CartuchoOptionsProps) {
  const dimensions = size === 'compact' ? 'h-16 w-12' : 'h-20 w-14'
  return (
    <div className={cn('flex gap-2', className)}>
      {CARTUCHO_OPTIONS.map((option) => {
        const isActive = option.value === selected
        return (
          <button
            key={option.value}
            type="button"
            title={option.label}
            aria-label={`Cartucho ${option.label}`}
            aria-pressed={isActive}
            onClick={() => onSelect(option.value)}
            className="rounded-sm p-0.5"
          >
            <div
              className={`cartucho-${option.value} ${dimensions} flex flex-col justify-between rounded-sm border-2 border-(--accent) bg-(--lcd-screen) p-1 shadow-[2px_2px_0_0_var(--accent)] motion-safe:transition-transform motion-safe:hover:-translate-y-1 ${
                isActive
                  ? 'outline-2 outline-offset-2 outline-fg motion-safe:animate-[cartucho-pulse_2s_ease-in-out_infinite]'
                  : ''
              }`}
            >
              <span className="mx-auto h-1 w-6 rounded-full bg-(--lcd-ink)/30" />
              <span className="text-left text-[10px] leading-tight text-(--lcd-ink)">
                {option.label}
              </span>
              <span className="h-1 w-full bg-(--accent)" />
            </div>
          </button>
        )
      })}
    </div>
  )
}
