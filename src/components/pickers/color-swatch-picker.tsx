import { cn } from '@/shared/lib/utils'
import { PALETTE_COLOR_LABELS, COMMON_TEXTS } from '@/shared/constants/texts'
import {
  PALETTE_COLORS,
  paletteVar,
  type PaletteColor,
} from '@/shared/lib/palette'

type ColorSwatchPickerProps = {
  value: PaletteColor | null
  className?: string
  onChange: (color: PaletteColor) => void
  'aria-label'?: string
  'aria-labelledby'?: string
}

export function ColorSwatchPicker({
  value,
  onChange,
  className,
  ...groupLabel
}: ColorSwatchPickerProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-1.5',
        className,
      )}
      role="group"
      {...groupLabel}
    >
      {PALETTE_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          aria-pressed={value === color}
          aria-label={COMMON_TEXTS.selectColor(PALETTE_COLOR_LABELS[color])}
          title={PALETTE_COLOR_LABELS[color]}
          onClick={() => onChange(color)}
          className="size-5 rounded-full"
          style={{
            backgroundColor: paletteVar(color),
            outline: value === color ? '2px solid var(--accent)' : 'none',
            outlineOffset: 2,
          }}
        />
      ))}
    </div>
  )
}
