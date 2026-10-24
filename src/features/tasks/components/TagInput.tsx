import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { IconPlus, IconClose } from '@/shared/lib/icons'
import { TASKS_TEXTS } from '@/features/tasks/constants/texts'

type TagInputProps = {
  tags: string[]
  onChange: (tags: string[]) => void
  suggestions: string[]
}

export function TagInput({ tags, onChange, suggestions }: TagInputProps) {
  const [draft, setDraft] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isAdding) {
      inputRef.current?.focus()
    }
  }, [isAdding])

  function addTag(tag: string) {
    const trimmed = tag.trim()
    if (!trimmed || tags.includes(trimmed)) {
      return
    }
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
    if (e.key === 'Escape') {
      setDraft('')
      setIsAdding(false)
    }
  }

  function handleBlur() {
    if (!draft.trim()) {
      setIsAdding(false)
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
      <div className="flex flex-wrap items-center gap-1">
        {tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={TASKS_TEXTS.removeTag(tag)}
            >
              <IconClose size={12} />
            </button>
          </Badge>
        ))}
        {!isAdding && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setIsAdding(true)}
            aria-label={TASKS_TEXTS.addTag}
          >
            <IconPlus size={12} />
          </Button>
        )}
      </div>

      {isAdding && (
        <Input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={TASKS_TEXTS.tagPlaceholder}
        />
      )}

      {isAdding && matchingSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {matchingSuggestions.slice(0, 5).map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => addTag(suggestion)}
              className="rounded-sm border border-border px-2 py-0.5 text-caption"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
