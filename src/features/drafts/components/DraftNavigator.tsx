import { Button } from '@/components/ui/button'
import { DRAFTS_TEXTS } from '@/features/drafts/constants/texts'
import { IconChevronLeft, IconChevronRight } from '@/shared/lib/icons'

type DraftNavigatorProps = {
  current: number
  total: number
  canGoPrevious: boolean
  canGoNext: boolean
  onPrevious: () => void
  onNext: () => void
}

export function DraftNavigator({
  current,
  total,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
}: DraftNavigatorProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onPrevious}
        disabled={!canGoPrevious}
        aria-label={DRAFTS_TEXTS.previousDraft}
        title={DRAFTS_TEXTS.previousDraft}
      >
        <IconChevronLeft size={24} aria-hidden="true" />
      </Button>
      <span aria-live="polite">{DRAFTS_TEXTS.position(current, total)}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onNext}
        disabled={!canGoNext}
        aria-label={DRAFTS_TEXTS.nextDraft}
        title={DRAFTS_TEXTS.nextDraft}
      >
        <IconChevronRight size={24} aria-hidden="true" />
      </Button>
    </div>
  )
}
