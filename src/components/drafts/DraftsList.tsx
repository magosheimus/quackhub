import { useEffect, useRef, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IconCard, IconNotes, IconPencil, IconTrash } from '@/lib/icons'
import { useDraftsItems } from '@/hooks/drafts/useDraftsItems'
import { useTriageDraft } from '@/hooks/drafts/useTriageDraft'
import { useUpdateDraft } from '@/hooks/drafts/useUpdateDraft'
import { CardCreateModal } from '@/components/card/CardCreateModal'
import type { Database } from '@/types/database.types'
import { LoadingText } from '../ui/loading-text'

type DraftsItem = Database['public']['Tables']['drafts_items']['Row']

const CHECKED_KEY = 'quackhub-drafts-checked'

function loadCheckedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(CHECKED_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveCheckedIds(ids: Set<string>) {
  try {
    localStorage.setItem(CHECKED_KEY, JSON.stringify([...ids]))
  } catch {
    // ignore
  }
}

type DraftEditInputProps = {
  value: string
  onChange: (value: string) => void
  onSave: () => void
  onCancel: () => void
}

function DraftEditInput({
  value,
  onChange,
  onSave,
  onCancel,
}: DraftEditInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <Input
      ref={inputRef}
      className="flex-1"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSave()
        if (e.key === 'Escape') onCancel()
      }}
      onBlur={onSave}
    />
  )
}

export function DraftsList() {
  const { data: items, isLoading } = useDraftsItems()
  const { mutate: triage } = useTriageDraft()
  const { mutate: updateDraft } = useUpdateDraft()
  const [creatingCardFor, setCreatingCardFor] = useState<DraftsItem | null>(
    null,
  )
  const [editing, setEditing] = useState<{ id: string; text: string } | null>(
    null,
  )
  const [checkedIds, setCheckedIds] = useState<Set<string>>(() =>
    loadCheckedIds(),
  )

  function handleDiscard(item: DraftsItem) {
    triage({
      id: item.id,
      decision: { triaged_to: 'discarded', triaged_task_id: null },
    })
  }

  function toggleChecked(id: string) {
    setCheckedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      saveCheckedIds(next)
      return next
    })
  }

  function saveEdit() {
    if (!editing) return
    const trimmed = editing.text.trim()
    if (trimmed) updateDraft({ id: editing.id, content: trimmed })
    setEditing(null)
  }

  if (isLoading) {
    return <LoadingText />
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-md border border-(--bg-surface) bg-(--bg-page) px-6 py-8 text-center">
        <IconNotes
          size={24}
          aria-hidden="true"
          className="text-(--text-muted)"
        />
        <span className="text-sm text-(--text-muted)">
          Nada por aqui. Capture uma ideia acima.
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-3 rounded-md border border-border bg-(--bg-card) p-4 text-base hover:bg-(--bg-card-hover)"
        >
          <Checkbox
            checked={checkedIds.has(item.id)}
            onCheckedChange={() => toggleChecked(item.id)}
            aria-label="Item pendente"
          />
          {editing?.id === item.id ? (
            <DraftEditInput
              value={editing.text}
              onChange={(text) => setEditing({ id: item.id, text })}
              onSave={saveEdit}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <span
              className={
                checkedIds.has(item.id)
                  ? 'flex-1 text-[--text-muted] line-through'
                  : 'flex-1 text-[--text-primary]'
              }
            >
              {item.content}
            </span>
          )}
          <Button
            type="button"
            title="Editar rascunho"
            variant="ghost"
            onClick={() => setEditing({ id: item.id, text: item.content })}
            aria-label="Editar rascunho"
            className="size-8 rounded-full p-0 hover:bg-(--bg-surface)! hover:text-(--text-primary)!"
          >
            <IconPencil size={16} />
          </Button>
          <Button
            type="button"
            title="Descartar"
            variant="ghost"
            onClick={() => handleDiscard(item)}
            aria-label="Descartar"
            className="size-8 rounded-full p-0 hover:bg-(--bg-surface)! hover:text-(--text-primary)!"
          >
            <IconTrash size={16} />
          </Button>
          <Button
            type="button"
            title="Transformar em card"
            variant="ghost"
            onClick={() => setCreatingCardFor(item)}
            aria-label="Transformar em card"
            className="size-8 rounded-full p-0 hover:bg-(--bg-surface)! hover:text-(--text-primary)!"
          >
            <IconCard size={16} />
          </Button>
        </div>
      ))}

      <CardCreateModal
        open={creatingCardFor !== null}
        onOpenChange={(open) => !open && setCreatingCardFor(null)}
        initialTitle={creatingCardFor?.content}
        hideTrigger
        onCreated={(task) => {
          if (!creatingCardFor) return
          triage({
            id: creatingCardFor.id,
            decision: { triaged_to: 'card', triaged_task_id: task.id },
          })
        }}
      />
    </div>
  )
}
