import { useState, type KeyboardEvent } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'

type TagInputProps = {
  tags: string[]
  onChange: (tags: string[]) => void
  suggestions: string[]
}

export function TagInput({ tags, onChange, suggestions }: TagInputProps) {
  const [draft, setDraft] = useState('')

  function addTag(tag: string) {
    const trimmed = tag.trim()
    if (!trimmed || tags.includes(trimmed)) return
    onChange([...tags, trimmed])
    setDraft('')
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag))
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(draft)
    }
  }

  const matchingSuggestions = suggestions.filter(
    (s) =>
      draft.trim() &&
      s.toLowerCase().includes(draft.toLowerCase()) &&
      !tags.includes(s),
  )

  return (
    <div className="flex flex-col gap-1.5">
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Remover tag ${tag}`}
              >
                <X size={12} />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Adicionar tag e Enter"
      />
      {matchingSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {matchingSuggestions.slice(0, 5).map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => addTag(suggestion)}
              className="rounded-[--radius-sm] border border-[--border] px-2 py-0.5 text-xs text-[--text-muted]"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
