import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { useEpics } from '@/features/epics/hooks/useEpics'
import { useCreateEpic } from '@/features/epics/hooks/useCreateEpic'
import { useUpdateEpic } from '@/features/epics/hooks/useUpdateEpic'
import { LoadingText } from '@/components/feedback/loading-text'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { useSoftDeleteEpic } from '@/features/epics/hooks/useSoftDeleteEpic'
import { IconMenu, IconTrash } from '@/shared/lib/icons'
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DraggableProvided,
  type DraggableProvidedDragHandleProps,
} from '@hello-pangea/dnd'
import { useReorderEpics } from '@/features/epics/hooks/useReorderEpics'
import type { Epic } from '@/shared/types/entities'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { ColorSwatchPicker } from '@/components/pickers/color-swatch-picker'
import {
  DEFAULT_PALETTE_COLOR,
  toPaletteColor,
  type PaletteColor,
} from '@/shared/lib/palette'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ColorDot } from '@/components/pickers/color-dot'
import { toEpicLabel } from '@/features/epics/lib/epic'
import { EPICS_TEXTS } from '@/features/epics/constants/texts'
import { EmptyMessage } from '@/components/feedback/empty-message'

type EpicManageModalProps = {
  initialProjectId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EpicManageModal({
  initialProjectId,
  open,
  onOpenChange,
}: EpicManageModalProps) {
  const { data: projects } = useProjects()
  const [projectId, setProjectId] = useState<string | null>(initialProjectId)
  const isProjectFixed = initialProjectId !== null
  const projectName = projects?.find((p) => p.id === projectId)?.name
  const { data: epics, isLoading } = useEpics(projectId ?? '')
  const [newEpicName, setNewEpicName] = useState('')
  const [color, setColor] = useState<PaletteColor>(DEFAULT_PALETTE_COLOR)
  const { mutate: createEpic, isPending: isCreating } = useCreateEpic()
  const { handleDragEnd } = useReorderEpics(projectId ?? '', epics ?? [])

  function handleCreate() {
    if (!projectId || !newEpicName.trim()) return
    createEpic(
      { project_id: projectId, name: newEpicName.trim(), color },
      { onSuccess: () => setNewEpicName('') },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isProjectFixed && projectName
              ? EPICS_TEXTS.titleFor(projectName)
              : EPICS_TEXTS.title}
          </DialogTitle>
        </DialogHeader>

        {!isProjectFixed && (
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger aria-label={EPICS_TEXTS.projectLabel}>
              <SelectValue>
                {projectName ?? EPICS_TEXTS.selectProject}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {projects?.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {projectId && (
          <div className="flex flex-col gap-2">
            {isLoading && <LoadingText />}
            {epics?.length === 0 && !isLoading && (
              <EmptyMessage>{EPICS_TEXTS.empty}</EmptyMessage>
            )}
            {epics && epics.length > 0 && (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable
                  droppableId="epics"
                  renderClone={(drag, _snapshot, rubric) =>
                    renderDraggableRow(epics[rubric.source.index], drag)
                  }
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex flex-col gap-2"
                    >
                      {epics.map((epic, index) => (
                        <Draggable
                          key={epic.id}
                          draggableId={epic.id}
                          index={index}
                        >
                          {(drag) => renderDraggableRow(epic, drag)}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
        )}

        <div className="flex flex-col gap-4 border-t border-border pt-3">
          <div className="flex gap-2">
            <Input
              value={newEpicName}
              onChange={(e) => setNewEpicName(e.target.value)}
              placeholder={EPICS_TEXTS.namePlaceholder}
              aria-label={EPICS_TEXTS.namePlaceholder}
              disabled={!projectId}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            <Button
              onClick={handleCreate}
              disabled={!projectId || !newEpicName.trim() || isCreating}
            >
              {COMMON_TEXTS.add}
            </Button>
          </div>
          <ColorSwatchPicker
            value={color}
            onChange={setColor}
            aria-label={EPICS_TEXTS.colorLabel}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

function renderDraggableRow(epic: Epic, drag: DraggableProvided) {
  return (
    <div ref={drag.innerRef} {...drag.draggableProps} className="bg-card">
      <EpicRow epic={epic} dragHandleProps={drag.dragHandleProps} />
    </div>
  )
}

type EpicRowProps = {
  epic: Epic
  dragHandleProps: DraggableProvidedDragHandleProps | null
}

function EpicRow({ epic, dragHandleProps }: EpicRowProps) {
  const [name, setName] = useState(epic.name)
  const { mutate: updateEpic, isPending } = useUpdateEpic()
  const { mutate: softDeleteEpic, isPending: isDeleting } = useSoftDeleteEpic()

  function handleBlur() {
    const trimmed = name.trim()
    if (!trimmed || trimmed === epic.name) {
      setName(epic.name)
      return
    }
    updateEpic({ id: epic.id, data: { name: trimmed } })
  }

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const [isPickingColor, setIsPickingColor] = useState(false)

  function changeColor(color: PaletteColor) {
    setIsPickingColor(false)
    if (color !== epic.color) {
      updateEpic({ id: epic.id, data: { color } })
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span
        {...dragHandleProps}
        aria-label={EPICS_TEXTS.reorder(epic.name)}
        title={EPICS_TEXTS.reorder(epic.name)}
        className="flex size-7 shrink-0 cursor-grab items-center justify-center text-fg-muted hover:text-fg active:cursor-grabbing"
      >
        <IconMenu size={14} aria-hidden="true" />
      </span>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={handleBlur}
        disabled={isPending}
        aria-label={EPICS_TEXTS.rename(epic.name)}
        className="text-sm"
      />
      <Popover open={isPickingColor} onOpenChange={setIsPickingColor}>
        <PopoverTrigger
          aria-label={EPICS_TEXTS.changeColor(epic.name)}
          title={EPICS_TEXTS.changeColor(epic.name)}
          className="flex size-7 shrink-0 items-center justify-center rounded-sm hover:bg-hover"
        >
          <ColorDot color={toEpicLabel(epic).color} className="size-3" />
        </PopoverTrigger>
        <PopoverContent align="end" className="p-2">
          <ColorSwatchPicker
            value={toPaletteColor(epic.color)}
            onChange={changeColor}
            aria-label={EPICS_TEXTS.changeColor(epic.name)}
            className="grid grid-cols-4 gap-2"
          />
        </PopoverContent>
      </Popover>
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => setIsConfirmingDelete(true)}
        disabled={isDeleting}
        aria-label={EPICS_TEXTS.delete(epic.name)}
      >
        <IconTrash size={12} />
      </Button>
      <ConfirmDialog
        open={isConfirmingDelete}
        onOpenChange={setIsConfirmingDelete}
        title={EPICS_TEXTS.deleteTitle}
        description={EPICS_TEXTS.confirmDelete(epic.name)}
        confirmLabel={EPICS_TEXTS.deleteConfirm}
        onConfirm={() => softDeleteEpic(epic.id)}
      />
    </div>
  )
}
