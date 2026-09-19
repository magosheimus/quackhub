import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEpics } from '@/hooks/epics/useEpics'
import { useCreateEpic } from '@/hooks/epics/useCreateEpic'
import { useUpdateEpic } from '@/hooks/epics/useUpdateEpic'
import type { Database } from '@/types/database.types'

type Epic = Database['public']['Tables']['epics']['Row']

type EpicManageModalProps = {
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EpicManageModal({
  projectId,
  open,
  onOpenChange,
}: EpicManageModalProps) {
  const { data: epics, isLoading } = useEpics(projectId)
  const [newEpicName, setNewEpicName] = useState('')
  const { mutate: createEpic, isPending: isCreating } = useCreateEpic()

  function handleCreate() {
    if (!newEpicName.trim()) return
    createEpic(
      { project_id: projectId, name: newEpicName.trim() },
      { onSuccess: () => setNewEpicName('') },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Épicos do projeto</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          {isLoading && (
            <div className="text-sm text-[--text-muted]">
              [ CARREGANDO........ ]
            </div>
          )}
          {epics?.length === 0 && !isLoading && (
            <div className="text-sm text-[--text-muted]">
              — nenhum épico ainda —
            </div>
          )}
          {epics?.map((epic) => (
            <EpicRow key={epic.id} epic={epic} />
          ))}
        </div>

        <div className="flex gap-2 pt-2 border-t border-[--border]">
          <Input
            value={newEpicName}
            onChange={(e) => setNewEpicName(e.target.value)}
            placeholder="Nome do novo épico"
            aria-label="Nome do novo épico"
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <Button
            onClick={handleCreate}
            disabled={!newEpicName.trim() || isCreating}
          >
            Adicionar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function EpicRow({ epic }: { epic: Epic }) {
  const [name, setName] = useState(epic.name)
  const { mutate: updateEpic, isPending } = useUpdateEpic()

  function handleBlur() {
    const trimmed = name.trim()
    if (!trimmed || trimmed === epic.name) {
      setName(epic.name)
      return
    }
    updateEpic({ id: epic.id, data: { name: trimmed } })
  }

  return (
    <Input
      value={name}
      onChange={(e) => setName(e.target.value)}
      onBlur={handleBlur}
      disabled={isPending}
      aria-label={`Renomear épico ${epic.name}`}
      className="text-sm"
    />
  )
}
