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
import { LoadingText } from '@/components/ui/loading-text'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useSoftDeleteEpic } from '@/features/epics/hooks/useSoftDeleteEpic'
import { IconTrash } from '@/shared/lib/icons'
import type { Epic } from '@/shared/types/entities'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { ColorSwatchPicker } from '@/components/ui/color-swatch-picker'
import {
  DEFAULT_PALETTE_COLOR,
  resolvePaletteColor,
  type PaletteColor,
} from '@/shared/lib/palette'
import { EPICS_TEXTS } from '@/features/epics/constants/texts'
import { EmptyMessage } from '@/components/ui/empty-message'

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
  const { data: epics, isLoading } = useEpics(projectId ?? '')
  const [newEpicName, setNewEpicName] = useState('')
  const [color, setColor] = useState<PaletteColor>(DEFAULT_PALETTE_COLOR)
  const { mutate: createEpic, isPending: isCreating } = useCreateEpic()

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
          <DialogTitle>{EPICS_TEXTS.title}</DialogTitle>
        </DialogHeader>

        <Select value={projectId} onValueChange={setProjectId}>
          <SelectTrigger aria-label={EPICS_TEXTS.projectLabel}>
            <SelectValue>
              {projects?.find((p) => p.id === projectId)?.name ??
                EPICS_TEXTS.selectProject}
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

        {projectId && (
          <div className="flex flex-col gap-2">
            {isLoading && <LoadingText />}
            {epics?.length === 0 && !isLoading && (
              <EmptyMessage>{EPICS_TEXTS.empty}</EmptyMessage>
            )}
            {epics?.map((epic) => (
              <EpicRow key={epic.id} epic={epic} />
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2 pt-2 border-t border-border">
          <ColorSwatchPicker
            value={color}
            onChange={setColor}
            aria-label={EPICS_TEXTS.colorLabel}
          />
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
        </div>
      </DialogContent>
    </Dialog>
  )
}

function EpicRow({ epic }: { epic: Epic }) {
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

  return (
    <div className="flex items-center gap-2">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={handleBlur}
        disabled={isPending}
        aria-label={EPICS_TEXTS.rename(epic.name)}
        className="text-sm"
      />
      <span
        className="size-3 shrink-0 rounded-full"
        style={{
          backgroundColor: resolvePaletteColor(epic.color, 'transparent'),
        }}
        aria-hidden="true"
      />
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
