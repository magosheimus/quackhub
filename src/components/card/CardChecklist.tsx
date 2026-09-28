import { useState } from 'react'
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useChecklistItems } from '@/hooks/tasks/checklist/useChecklistItems'
import { useCreateChecklistItem } from '@/hooks/tasks/checklist/useCreateChecklistItem'
import { useUpdateChecklistItem } from '@/hooks/tasks/checklist/useUpdateChecklistItem'
import { useDeleteChecklistItem } from '@/hooks/tasks/checklist/useDeleteChecklistItem'

type CardChecklistProps = {
  taskId: string
}

export function CardChecklist({ taskId }: CardChecklistProps) {
  const { data: items } = useChecklistItems(taskId)
  const { mutate: createItem } = useCreateChecklistItem()
  const { mutate: updateItem } = useUpdateChecklistItem()
  const { mutate: deleteItem } = useDeleteChecklistItem()
  const [draft, setDraft] = useState('')

  function handleAdd() {
    const content = draft.trim()
    if (!content) return
    createItem({ task_id: taskId, content, position: items?.length ?? 0 })
    setDraft('')
  }

  function handleDragEnd(result: DropResult) {
    if (!items || !result.destination) return
    const reordered = Array.from(items)
    const [moved] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, moved)

    reordered.forEach((item, index) => {
      if (item.position !== index) {
        updateItem({ id: item.id, data: { position: index } })
      }
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-[--text-primary]">
        Checklist
      </span>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="checklist">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex flex-col gap-1"
            >
              {items?.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(dragProvided) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Checkbox
                        checked={item.done}
                        onCheckedChange={(checked) =>
                          updateItem({
                            id: item.id,
                            data: { done: checked === true },
                          })
                        }
                        aria-label={`Marcar "${item.content}" como concluído`}
                      />
                      <span
                        className={
                          item.done
                            ? 'flex-1 text-[--text-muted] line-through'
                            : 'flex-1 text-[--text-primary]'
                        }
                      >
                        {item.content}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteItem({ id: item.id, taskId })}
                        aria-label={`Remover "${item.content}"`}
                      >
                        <X size={14} className="text-[--text-muted]" />
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

      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Adicionar item"
          aria-label="Novo item do checklist"
        />
        <Button variant="outline" size="sm" onClick={handleAdd}>
          +
        </Button>
      </div>
    </div>
  )
}
