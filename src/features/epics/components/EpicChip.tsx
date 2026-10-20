import { epicChipStyle, type EpicLabel } from '@/features/epics/lib/epic'
import { COMMON_TEXTS } from '@/shared/constants/texts'

type EpicChipProps = {
  label: EpicLabel
  withSeparator?: boolean
}

// Com separador, vai na linha do código do projeto: "ME-1 / Épico"
export function EpicChip({ label, withSeparator }: EpicChipProps) {
  return (
    <>
      {withSeparator && (
        <span aria-hidden="true" className="text-fg-muted">
          {COMMON_TEXTS.pathSeparator}
        </span>
      )}
      <span
        title={label.name}
        style={epicChipStyle(label.color)}
        className="inline-flex w-fit max-w-full min-w-0 rounded-sm px-1 py-0.5 text-fg"
      >
        <span className="truncate">{label.name}</span>
      </span>
    </>
  )
}
