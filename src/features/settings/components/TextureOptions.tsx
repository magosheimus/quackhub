import type { CSSProperties } from 'react'
import {
  TEXTURES,
  type PatternTexture,
  type Texture,
} from '@/features/settings/lib/settings'
import { TEXTURE_LABELS } from '@/features/settings/constants/texts'
import { cn } from '@/shared/lib/utils'

type TextureOptionsProps = {
  selected: Texture
  opacity: Record<PatternTexture, number>
  onSelect: (texture: Texture) => void
}

function swatchStyle(
  texture: Texture,
  opacity: Record<PatternTexture, number>,
): CSSProperties | undefined {
  if (texture === 'none') {
    return undefined
  }
  return { '--texture-opacity': `${opacity[texture]}%` } as CSSProperties
}

export function TextureOptions({
  selected,
  opacity,
  onSelect,
}: TextureOptionsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {TEXTURES.map((texture) => {
        const isActive = texture === selected
        return (
          <button
            key={texture}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(texture)}
            className="flex flex-col items-center gap-1"
          >
            <span
              style={swatchStyle(texture, opacity)}
              className={cn(
                `texture-${texture} texture-swatch h-20 w-14 rounded-sm border border-border bg-page`,
                isActive && 'outline-2 outline-offset-2 outline-fg',
              )}
            />
            <span className="text-caption">{TEXTURE_LABELS[texture]}</span>
          </button>
        )
      })}
    </div>
  )
}
