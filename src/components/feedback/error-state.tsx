import { Button } from '@/components/ui/button'
import { IconWarning } from '@/shared/lib/icons'
import { COMMON_TEXTS } from '@/shared/constants/texts'

type ErrorStateProps = {
  onRetry: () => void
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 rounded-md border border-danger bg-card-empty px-6 py-12 text-center"
    >
      <IconWarning size={24} aria-hidden="true" className="text-danger" />
      <div className="flex flex-col gap-1">
        <span className="font-heading text-heading-2 text-danger">
          {COMMON_TEXTS.loadErrorTitle}
        </span>
        <span className="text-body text-fg-muted">
          {COMMON_TEXTS.loadErrorDescription}
        </span>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry}>
        {COMMON_TEXTS.retry}
      </Button>
    </div>
  )
}
