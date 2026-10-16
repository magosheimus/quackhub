import { epicChipStyle, type EpicLabel } from '@/features/epics/lib/epic'

type EpicChipProps = {
  label: EpicLabel
}

export function EpicChip({ label }: EpicChipProps) {
  return (
    <span
      title={label.name}
      style={epicChipStyle(label.color)}
      className="inline-flex w-fit max-w-full min-w-0 rounded-sm px-1 py-0.5 text-xs text-fg"
    >
      <span className="truncate">{label.name}</span>
    </span>
  )
}
