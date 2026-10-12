import { ErrorState } from '@/components/ui/error-state'
import { hasLoadError, retryFailedQueries } from '@/shared/query/queryState'
import { useEffect, useRef, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  IconNotes,
  IconPencil,
  IconStickyNoteSharp,
  IconTrash,
} from '@/shared/lib/icons'
import { useDraftsItems } from '@/features/drafts/hooks/useDraftsItems'
import { useTriageDraft } from '@/features/drafts/hooks/useTriageDraft'
import { useUpdateDraft } from '@/features/drafts/hooks/useUpdateDraft'
import { useToggleDraftChecked } from '@/features/drafts/hooks/useToggleDraftChecked'
import { CardCreateModal } from '@/features/tasks/components/CardCreateModal'
import { LoadingText } from '@/components/ui/loading-text'
import type { DraftsItem } from '@/shared/types/entities'
import { DRAFTS_TEXTS } from '@/features/drafts/constants/texts'
import { EmptyMessage } from '@/components/ui/empty-message'
import { Panel } from '@/components/ui/panel'

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
  const itemsQuery = useDraftsItems()
  const { data: items, isLoading } = itemsQuery
  const { mutate: triage } = useTriageDraft()
  const { mutate: updateDraft } = useUpdateDraft()
  const [creatingCardFor, setCreatingCardFor] = useState<DraftsItem | null>(
    null,
  )
  const [editing, setEditing] = useState<{ id: string; text: string } | null>(
    null,
  )
  const { mutate: toggleChecked } = useToggleDraftChecked()

  function handleDiscard(item: DraftsItem) {
    triage({
      id: item.id,
      decision: { triaged_to: 'discarded', triaged_task_id: null },
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

  if (hasLoadError(itemsQuery)) {
    return <ErrorState onRetry={() => retryFailedQueries(itemsQuery)} />
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-md border border-(--border-card-empty) bg-card-empty px-6 py-8 text-center">
        <IconNotes size={24} aria-hidden="true" className="text-fg-muted" />
        <EmptyMessage>{DRAFTS_TEXTS.empty}</EmptyMessage>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <Panel
          key={item.id}
          className="flex items-center gap-3 text-base hover:bg-card-hover"
        >
          <Checkbox
            checked={item.checked_at !== null}
            onCheckedChange={(checked) =>
              toggleChecked({ id: item.id, checked: checked === true })
            }
            aria-label={DRAFTS_TEXTS.pendingItem}
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
                item.checked_at !== null
                  ? 'min-w-0 flex-1 wrap-break-word text-fg-muted line-through'
                  : 'min-w-0 flex-1 wrap-break-word text-fg'
              }
            >
              {item.content}
            </span>
          )}
          <Button
            type="button"
            title={DRAFTS_TEXTS.edit}
            variant="ghost"
            onClick={() => setEditing({ id: item.id, text: item.content })}
            aria-label={DRAFTS_TEXTS.edit}
            className="size-8 shrink-0 p-0 hover:bg-surface! hover:text-fg!"
          >
            <IconPencil size={16} />
          </Button>
          <Button
            type="button"
            title={DRAFTS_TEXTS.discard}
            variant="ghost"
            onClick={() => handleDiscard(item)}
            aria-label={DRAFTS_TEXTS.discard}
            className="size-8 shrink-0 p-0 hover:bg-surface! hover:text-fg!"
          >
            <IconTrash size={16} />
          </Button>
          <Button
            type="button"
            title={DRAFTS_TEXTS.toCard}
            variant="ghost"
            onClick={() => setCreatingCardFor(item)}
            aria-label={DRAFTS_TEXTS.toCard}
            className="size-8 shrink-0 p-0 hover:bg-surface! hover:text-fg!"
          >
            <IconStickyNoteSharp size={16} />
          </Button>
        </Panel>
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
            decision: { triaged_to: 'task', triaged_task_id: task.id },
          })
        }}
      />
    </div>
  )
}
