import { COMMON_TEXTS } from '@/shared/constants/texts'
export function LoadingText() {
  return (
    <div className="text-sm text-(--text-muted)">
      {COMMON_TEXTS.loading}
      <span className="loading-dots" aria-hidden="true" /> ]
    </div>
  )
}
