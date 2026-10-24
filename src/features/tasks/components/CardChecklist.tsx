import { SectionLabel } from '@/components/layout/section-label'
import { IconChecklist, IconClose, IconPlusBoxSharp } from '@/shared/lib/icons'
import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { useChecklistItems } from '@/features/tasks/hooks/checklist/useChecklistItems'
import { useCreateChecklistItem } from '@/features/tasks/hooks/checklist/useCreateChecklistItem'
import { useUpdateChecklistItem } from '@/features/tasks/hooks/checklist/useUpdateChecklistItem'
import { useDeleteChecklistItem } from '@/features/tasks/hooks/checklist/useDeleteChecklistItem'
import { TASKS_TEXTS } from '@/features/tasks/constants/texts'
import { Panel } from '@/components/layout/panel'
import { useReorderList } from '@/shared/hooks/useReorderList'
import { queryKeys } from '@/shared/query/queryKeys'

type CardChecklistProps = {
  taskId: string
}

export function CardChecklist({ taskId }: CardChecklistProps) {
  const { data: items } = useChecklistItems(taskId)
  const { mutate: createItem } = useCreateChecklistItem()
  const { mutate: updateItem } = useUpdateChecklistItem()
  const { mutate: deleteItem } = useDeleteChecklistItem()
  const [draft, setDraft] = useState('')
  const { handleDragEnd } = useReorderList({
    table: 'task_checklist_items',
    items: items ?? [],
    queryKey: queryKeys.checklist.byTask(taskId),
  })

  function handleAdd() {
    const content = draft.trim()
    if (!content) {
      return
    }
    createItem({ task_id: taskId, content, position: items?.length ?? 0 })
    setDraft('')
  }

  return (
    <div className="flex flex-col gap-2">
      <SectionLabel icon={IconChecklist}>{TASKS_TEXTS.checklist}</SectionLabel>

      <Panel className="flex flex-col gap-3 p-3">
        <div className="flex gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder={TASKS_TEXTS.addItem}
            aria-label={TASKS_TEXTS.newChecklistItem}
          />
          <button
            type="button"
            onClick={handleAdd}
            aria-label={TASKS_TEXTS.addItem}
            className="flex size-8 items-center justify-center text-fg-muted hover:text-fg motion-safe:transition-transform motion-safe:hover:scale-110"
          >
            <IconPlusBoxSharp size={16} aria-hidden="true" />
          </button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="checklist">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-col gap-1.5 empty:hidden"
              >
                {items?.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(dragProvided) => (
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                        className="flex items-center gap-2 text-body"
                      >
                        <Checkbox
                          checked={item.done}
                          onCheckedChange={(checked) =>
                            updateItem({
                              id: item.id,
                              data: { done: checked === true },
                            })
                          }
                          aria-label={TASKS_TEXTS.markDone(item.content)}
                        />
                        <span
                          className={
                            item.done
                              ? 'flex-1 text-fg-muted line-through'
                              : 'flex-1 text-fg'
                          }
                        >
                          {item.content}
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteItem({ id: item.id, taskId })}
                          aria-label={TASKS_TEXTS.removeItem(item.content)}
                        >
                          <IconClose size={12} className="text-fg-muted" />
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Panel>
    </div>
  )
}
