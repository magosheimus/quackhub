import type { ReactNode } from 'react'
import { SegmentedProgress } from '@/components/brand/segmented-progress'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { ANALYTICS_TEXTS } from '@/features/analytics/constants/texts'

type CompletionRowProps = {
  marker: ReactNode
  name: string
  percent: number
  completed: number
  total: number
  color?: string
}

// Linha "marcador · nome · barra · X de Y", usada por projeto e por persona
export function CompletionRow({
  marker,
  name,
  percent,
  completed,
  total,
  color,
}: CompletionRowProps) {
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
      <span className="flex min-w-0 items-center gap-2 text-body-strong sm:w-48 sm:shrink-0">
        {marker}
        <span className="truncate">{name}</span>
      </span>
      <div className="flex items-center gap-3">
        <SegmentedProgress
          value={percent}
          color={color}
          label={COMMON_TEXTS.progressOf(name)}
        />
        <span className="text-caption">
          {ANALYTICS_TEXTS.completedOf(completed, total)}
        </span>
      </div>
    </div>
  )
}
