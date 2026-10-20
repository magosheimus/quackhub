import { EpicChip } from '@/features/epics/components/EpicChip'
import { useEpicLabel } from '@/features/epics/hooks/useEpicLabel'

type CardEpicChipProps = {
  epicId: string | null
  withSeparator?: boolean
}

export function CardEpicChip({ epicId, withSeparator }: CardEpicChipProps) {
  const label = useEpicLabel(epicId)
  return label ? <EpicChip label={label} withSeparator={withSeparator} /> : null
}
