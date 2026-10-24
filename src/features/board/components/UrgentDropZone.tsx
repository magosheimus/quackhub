import { Droppable } from '@hello-pangea/dnd'
import { IconFlag } from '@/shared/lib/icons'
import { toUrgentZoneId, type BoardColumnKey } from '@/features/board/lib/board'
import { COMMON_TEXTS } from '@/shared/constants/texts'

export function UrgentDropZone({ column }: { column: BoardColumnKey }) {
  return (
    <Droppable droppableId={toUrgentZoneId(column)}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          data-over={snapshot.isDraggingOver || undefined}
          className="urgent-drop-zone absolute inset-0 flex items-center justify-center gap-2 rounded-md border-2 border-dashed border-danger text-body-strong text-danger"
        >
          <IconFlag size={16} aria-hidden="true" />
          {COMMON_TEXTS.urgent}
          <div className="hidden">{provided.placeholder}</div>
        </div>
      )}
    </Droppable>
  )
}
