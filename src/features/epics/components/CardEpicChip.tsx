import { EpicChip } from '@/features/epics/components/EpicChip'
import { useEpicLabel } from '@/features/epics/hooks/useEpicLabel'

type CardEpicChipProps = {
  epicId: string | null
}

export function CardEpicChip({ epicId }: CardEpicChipProps) {
  const label = useEpicLabel(epicId)
  return label ? <EpicChip label={label} /> : null
}
