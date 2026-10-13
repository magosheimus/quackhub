import { useRef, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDayComment } from '@/features/dailyTracker/hooks/useDayComment'
import { DAILY_TRACKER_TEXTS } from '@/features/dailyTracker/constants/texts'
import { IconSend } from '@/shared/lib/icons'
import { cn } from '@/shared/lib/utils'

type DayCommentFieldProps = {
  savedComment: string
  isEnabled: boolean
  onSave: (text: string) => void
}

export function DayCommentField({
  savedComment,
  isEnabled,
  onSave,
}: DayCommentFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { draft, setDraft, startEditing, submit, isStatic } = useDayComment(
    savedComment,
    onSave,
  )

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    inputRef.current?.blur()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="-ml-[calc(0.625rem+1px)] flex items-center gap-2"
    >
      <Input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onFocus={startEditing}
        onBlur={submit}
        placeholder={
          isEnabled
            ? DAILY_TRACKER_TEXTS.commentPlaceholder
            : DAILY_TRACKER_TEXTS.commentNeedsMood
        }
        aria-label={DAILY_TRACKER_TEXTS.commentLabel}
        disabled={!isEnabled}
        className={cn(isStatic && 'input-static cursor-text')}
      />
      {!isStatic && (
        <Button
          type="submit"
          variant="outline"
          size="icon"
          disabled={!isEnabled}
          aria-label={DAILY_TRACKER_TEXTS.saveComment}
          title={DAILY_TRACKER_TEXTS.saveComment}
          onMouseDown={(e) => e.preventDefault()}
        >
          <IconSend size={14} aria-hidden="true" />
        </Button>
      )}
    </form>
  )
}
