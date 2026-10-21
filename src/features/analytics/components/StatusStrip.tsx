import type { CSSProperties } from 'react'
import type { StatusCountItem } from '@/features/analytics/hooks/useAnalyticsPage'
import { cn } from '@/shared/lib/utils'

function shareStyle(percent: number): CSSProperties {
  return { width: `${percent}%` }
}

export function StatusStrip({ items }: { items: StatusCountItem[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-3 w-full gap-0.5 overflow-hidden rounded-sm bg-page saturate-150">
        {items
          .filter((item) => item.count > 0)
          .map((item) => (
            <div
              key={item.status}
              style={shareStyle(item.percent)}
              className={item.colorClass}
            />
          ))}
      </div>
      <div className="flex flex-wrap gap-x-10 gap-y-3">
        {items.map((item) => (
          <div key={item.status} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={cn(
                'size-2.5 rounded-sm saturate-150',
                item.colorClass,
              )}
            />
            <span className="font-heading text-heading-2 text-fg">
              {item.count}
            </span>
            <span className="text-caption">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
