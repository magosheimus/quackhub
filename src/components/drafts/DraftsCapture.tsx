import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useCaptureDraft } from '@/hooks/drafts/useCaptureDraft'

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
    <div className="flex flex-col gap-2 rounded-md border border-border bg-(--bg-card) p-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit()
        }}
        placeholder="Capturar rapidamente..."
        className="min-h-16 px-2 py-1.5 focus-visible:ring-0"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-(--text-muted)">
          Ctrl + Enter para adicionar
        </span>
        <Button
          type="button"
          size="sm"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          Adicionar
        </Button>
      </div>
    </div>
  )
}
