import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useCaptureDraft } from '@/hooks/drafts/useCaptureDraft'

export function DraftsCapture() {
  const [content, setContent] = useState('')
  const { mutate: capture, isPending } = useCaptureDraft()

  function handleSubmit() {
    const trimmed = content.trim()
    if (!trimmed) return
    capture(trimmed, {
      onSuccess: () => setContent(''),
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Capturar rapidamente..."
      />
      <Button
        type="button"
        onClick={handleSubmit}
        disabled={isPending || !content.trim()}
        className="w-fit"
      >
        Adicionar
      </Button>
    </div>
  )
}
