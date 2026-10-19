import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useCaptureDraft } from '@/features/drafts/hooks/useCaptureDraft'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { DRAFTS_TEXTS } from '@/features/drafts/constants/texts'
import { Panel } from '@/components/layout/panel'

export function DraftsCapture() {
  const [content, setContent] = useState('')
  const { mutate: capture, isPending } = useCaptureDraft()
  const canSubmit = !isPending && content.trim().length > 0

  function handleSubmit() {
    if (!canSubmit) return
    capture(content.trim(), {
      onSuccess: () => setContent(''),
    })
  }

  return (
    <Panel className="flex flex-col gap-2 p-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit()
        }}
        placeholder={DRAFTS_TEXTS.capturePlaceholder}
        className="min-h-16 px-2 py-1.5 focus-visible:ring-0"
      />
      <div className="flex items-center justify-between">
        <span className="text-caption">{DRAFTS_TEXTS.captureHint}</span>
        <Button
          type="button"
          size="sm"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {COMMON_TEXTS.add}
        </Button>
      </div>
    </Panel>
  )
}
