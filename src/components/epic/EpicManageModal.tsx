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
import { useProjects } from '@/hooks/projects/useProjects'
import { useEpics } from '@/hooks/epics/useEpics'
import { useCreateEpic } from '@/hooks/epics/useCreateEpic'
import { useUpdateEpic } from '@/hooks/epics/useUpdateEpic'
import { PROJECT_COLORS, type ProjectColor } from '@/lib/project'
import type { Database } from '@/types/database.types'
import { LoadingText } from '../ui/loading-text'
import { useSoftDeleteEpic } from '@/hooks/epics/useSoftDeleteEpic'
import { Trash2 } from 'lucide-react'

type Epic = Database['public']['Tables']['epics']['Row']

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
  const [color, setColor] = useState<ProjectColor>(PROJECT_COLORS[0])
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
          <DialogTitle>Épicos</DialogTitle>
        </DialogHeader>

        <Select value={projectId} onValueChange={setProjectId}>
          <SelectTrigger aria-label="Projeto do épico">
            <SelectValue>
              {projects?.find((p) => p.id === projectId)?.name ??
                'Selecione o projeto'}
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
              <div className="text-sm text-(--text-muted)">
                — nenhum épico ainda —
              </div>
            )}
            {epics?.map((epic) => (
              <EpicRow key={epic.id} epic={epic} />
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2 pt-2 border-t border-border">
          <div className="flex gap-2" role="group" aria-label="Cor do épico">
            {PROJECT_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className="size-6 rounded-full transition-transform"
                style={{
                  backgroundColor: c,
                  outline: color === c ? '2px solid var(--accent)' : 'none',
                  outlineOffset: 2,
                }}
                aria-label={`Selecionar cor ${c}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newEpicName}
              onChange={(e) => setNewEpicName(e.target.value)}
              placeholder="Nome do novo épico"
              aria-label="Nome do novo épico"
              disabled={!projectId}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            <Button
              onClick={handleCreate}
              disabled={!projectId || !newEpicName.trim() || isCreating}
            >
              Adicionar
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

  function handleDelete() {
    if (
      !window.confirm(
        `Excluir o épico "${epic.name}"? Os cards vinculados ficam sem épico.`,
      )
    ) {
      return
    }
    softDeleteEpic(epic.id)
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={handleBlur}
        disabled={isPending}
        aria-label={`Renomear épico ${epic.name}`}
        className="text-sm"
      />
      <span
        className="size-3 shrink-0 rounded-full"
        style={{ backgroundColor: epic.color ?? 'transparent' }}
        aria-hidden="true"
      />
      <Button
        variant="outline"
        size="icon-sm"
        onClick={handleDelete}
        disabled={isDeleting}
        aria-label={`Excluir épico ${epic.name}`}
      >
        <Trash2 size={14} />
      </Button>
    </div>
  )
}
