import { PALETTE_COLOR_LABELS, COMMON_TEXTS } from '@/shared/constants/texts'
import {
  PALETTE_COLORS,
  paletteVar,
  type PaletteColor,
} from '@/shared/lib/palette'

type ColorSwatchPickerProps = {
  value: PaletteColor
  onChange: (color: PaletteColor) => void
  'aria-label'?: string
  'aria-labelledby'?: string
}

export function ColorSwatchPicker({
  value,
  onChange,
  ...groupLabel
}: ColorSwatchPickerProps) {
  return (
    <div className="flex h-8 items-center gap-2" role="group" {...groupLabel}>
      {PALETTE_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          aria-pressed={value === color}
          aria-label={COMMON_TEXTS.selectColor(PALETTE_COLOR_LABELS[color])}
          title={PALETTE_COLOR_LABELS[color]}
          onClick={() => onChange(color)}
          className="size-6 rounded-full"
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
