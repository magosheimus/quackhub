import { ErrorState } from '@/components/feedback/error-state'
import { hasLoadError, retryFailedQueries } from '@/shared/query/queryState'
import { useEffect, useRef, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  IconCalendarWeeks,
  IconNotes,
  IconPenSquare,
  IconPencil,
  IconTrash,
} from '@/shared/lib/icons'
import { useDraftsSections } from '@/features/drafts/hooks/useDraftsSections'
import { DraftsArchive } from '@/features/drafts/components/DraftsArchive'
import { useTriageDraft } from '@/features/drafts/hooks/useTriageDraft'
import { useUpdateDraft } from '@/features/drafts/hooks/useUpdateDraft'
import { useToggleDraftChecked } from '@/features/drafts/hooks/useToggleDraftChecked'
import { CardCreateModal } from '@/features/tasks/components/CardCreateModal'
import { LoadingText } from '@/components/feedback/loading-text'
import type { DraftsItem } from '@/shared/types/entities'
import { DRAFTS_TEXTS } from '@/features/drafts/constants/texts'
import { EmptyMessage } from '@/components/feedback/empty-message'
import { Panel } from '@/components/layout/panel'
import { GroupTitle } from '@/components/layout/group-title'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import { useDraftGroups } from '@/features/drafts/hooks/useDraftGroups'
import { useDraftToCard } from '@/features/drafts/hooks/useDraftToCard'
import { DraftNavigator } from '@/features/drafts/components/DraftNavigator'
import { useDraftToHabit } from '@/features/drafts/hooks/useDraftToHabit'
import { HabitCreateDialog } from '@/features/dailyTracker/components/HabitCreateDialog'

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
        if (e.key === 'Enter') {
          onSave()
        }
        if (e.key === 'Escape') {
          onCancel()
        }
      }}
      onBlur={onSave}
    />
  )
}

export function DraftsList() {
  const { itemsQuery, pending, archived } = useDraftsSections()
  const { isLoading } = itemsQuery
  const { mutate: triage } = useTriageDraft()
  const { mutate: updateDraft } = useUpdateDraft()
  const { groups, orderedPending, handleBeforeCapture, handleDragEnd } =
    useDraftGroups(pending)
  const draftToCard = useDraftToCard(orderedPending)
  const draftToHabit = useDraftToHabit()
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
    if (!editing) {
      return
    }
    const trimmed = editing.text.trim()
    if (trimmed) {
      updateDraft({ id: editing.id, content: trimmed })
    }
    setEditing(null)
  }

  if (isLoading) {
    return <LoadingText />
  }

  if (hasLoadError(itemsQuery)) {
    return <ErrorState onRetry={() => retryFailedQueries(itemsQuery)} />
  }

  if (pending.length === 0 && archived.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-md border border-(--border-card-empty) bg-card-empty px-6 py-8 text-center">
        <IconNotes size={24} aria-hidden="true" className="text-fg-muted" />
        <EmptyMessage>{DRAFTS_TEXTS.empty}</EmptyMessage>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {pending.length === 0 && (
        <EmptyMessage>{DRAFTS_TEXTS.allDone}</EmptyMessage>
      )}
      <DragDropContext
        onBeforeCapture={handleBeforeCapture}
        onDragEnd={handleDragEnd}
      >
        {groups.map((group) => (
          <section key={group.droppableId} className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <GroupTitle color={group.color}>{group.label}</GroupTitle>
              <span className="text-caption">{group.items.length}</span>
            </div>
            <Droppable droppableId={group.droppableId}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-col gap-2"
                >
                  {group.items.length === 0 && (
                    <div className="rounded-md border border-dashed border-(--border-card-empty) bg-card-empty px-3 py-2 text-caption">
                      {DRAFTS_TEXTS.dropHere}
                    </div>
                  )}
                  {group.items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                      isDragDisabled={editing?.id === item.id}
                    >
                      {(drag) => (
                        <Panel
                          ref={drag.innerRef}
                          {...drag.draggableProps}
                          {...drag.dragHandleProps}
                          className="flex items-center gap-3 text-body hover:bg-card-hover"
                        >
                          <Checkbox
                            checked={false}
                            onCheckedChange={() =>
                              toggleChecked({ id: item.id, checked: true })
                            }
                            aria-label={DRAFTS_TEXTS.pendingItem}
                          />
                          {editing?.id === item.id ? (
                            <DraftEditInput
                              value={editing.text}
                              onChange={(text) =>
                                setEditing({ id: item.id, text })
                              }
                              onSave={saveEdit}
                              onCancel={() => setEditing(null)}
                            />
                          ) : (
                            <span className="min-w-0 flex-1 wrap-break-word text-fg">
                              {item.content}
                            </span>
                          )}
                          <div className="flex shrink-0 items-center">
                            <Button
                              type="button"
                              title={DRAFTS_TEXTS.edit}
                              variant="ghost"
                              onClick={() =>
                                setEditing({ id: item.id, text: item.content })
                              }
                              aria-label={DRAFTS_TEXTS.edit}
                              className="size-8 shrink-0 p-0 hover:bg-surface! hover:text-fg!"
                            >
                              <IconPencil size={18} />
                            </Button>
                            <Button
                              type="button"
                              title={DRAFTS_TEXTS.discard}
                              variant="ghost"
                              onClick={() => handleDiscard(item)}
                              aria-label={DRAFTS_TEXTS.discard}
                              className="size-8 shrink-0 p-0 hover:bg-surface! hover:text-fg!"
                            >
                              <IconTrash size={18} />
                            </Button>
                            <Button
                              type="button"
                              title={DRAFTS_TEXTS.toCard}
                              variant="ghost"
                              onClick={() => draftToCard.open(item)}
                              aria-label={DRAFTS_TEXTS.toCard}
                              className="size-8 shrink-0 p-0 hover:bg-surface! hover:text-fg!"
                            >
                              <IconPenSquare size={18} />
                            </Button>
                            <Button
                              type="button"
                              title={DRAFTS_TEXTS.toHabit}
                              variant="ghost"
                              onClick={() => draftToHabit.open(item)}
                              aria-label={DRAFTS_TEXTS.toHabit}
                              className="size-8 shrink-0 p-0 hover:bg-surface! hover:text-fg!"
                            >
                              <IconCalendarWeeks size={18} />
                            </Button>
                          </div>
                        </Panel>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </section>
        ))}
      </DragDropContext>

      <DraftsArchive
        items={archived}
        onRestore={(item) => toggleChecked({ id: item.id, checked: false })}
        onDiscard={handleDiscard}
      />

      {draftToHabit.draft && (
        <HabitCreateDialog
          key={draftToHabit.draft.id}
          initialName={draftToHabit.draft.content}
          onCreated={draftToHabit.handleCreated}
          onClose={draftToHabit.close}
        />
      )}

      <CardCreateModal
        open={draftToCard.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            draftToCard.close()
          }
        }}
        prefill={draftToCard.prefill}
        titleSlot={
          draftToCard.position && (
            <DraftNavigator
              current={draftToCard.position.current}
              total={draftToCard.position.total}
              canGoPrevious={draftToCard.canGoPrevious}
              canGoNext={draftToCard.canGoNext}
              onPrevious={draftToCard.goPrevious}
              onNext={draftToCard.goNext}
            />
          )
        }
        hideTrigger
        onCreated={draftToCard.handleCreated}
      />
    </div>
  )
}
