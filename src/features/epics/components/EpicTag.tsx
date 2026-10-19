import { ColorDot } from '@/components/pickers/color-dot'
import type { EpicLabel } from '@/features/epics/lib/epic'

type EpicTagProps = {
  label: EpicLabel
  withColor?: boolean
}

export function EpicTag({ label, withColor = true }: EpicTagProps) {
  return (
    <span className="flex min-w-0 items-center gap-1.5 text-caption">
      {withColor && <ColorDot color={label.color} />}
      <span className="truncate">{label.name}</span>
    </span>
  )
}
