import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useUpdateProject } from '@/hooks/useUpdateProject'
import { useSoftDeleteProject } from '@/hooks/useSoftDeleteProject'
import { PROJECT_COLORS } from '@/lib/projectColors'
import type { Database } from '@/types/database.types'

type Project = Database['public']['Tables']['projects']['Row']
type ProjectType = 'general' | 'study'

type ProjectEditModalProps = {
  project: Project | null
  onOpenChange: (open: boolean) => void
}

export function ProjectEditModal({
  project,
  onOpenChange,
}: ProjectEditModalProps) {
  return (
    <Dialog open={project !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar projeto</DialogTitle>
        </DialogHeader>

        {project && (
          <ProjectEditForm
            key={project.id}
            project={project}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

type ProjectEditFormProps = {
  project: Project
  onClose: () => void
}

function ProjectEditForm({ project, onClose }: ProjectEditFormProps) {
  const [name, setName] = useState(project.name)
  const [type, setType] = useState<ProjectType>(project.type as ProjectType)
  const [color, setColor] = useState<(typeof PROJECT_COLORS)[number]>(
    (project.color as (typeof PROJECT_COLORS)[number]) ?? PROJECT_COLORS[0],
  )

  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject()
  const { mutate: archiveProject, isPending: isArchiving } =
    useSoftDeleteProject()

  function handleSave() {
    if (!name.trim()) return
    updateProject(
      { id: project.id, data: { name: name.trim(), type, color } },
      { onSuccess: onClose },
    )
  }

  function handleArchive() {
    if (!window.confirm(`Arquivar o projeto "${project.name}"?`)) return
    archiveProject(project.id, { onSuccess: onClose })
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="project-edit-name"
            className="text-xs text-[--text-muted]"
          >
            Nome
          </label>
          <Input
            id="project-edit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span
            id="project-edit-type-label"
            className="text-xs text-[--text-muted]"
          >
            Tipo
          </span>
          <Select value={type} onValueChange={(v) => setType(v as ProjectType)}>
            <SelectTrigger aria-labelledby="project-edit-type-label">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">Geral</SelectItem>
              <SelectItem value="study">Estudo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <span
            id="project-edit-color-label"
            className="text-xs text-[--text-muted]"
          >
            Cor
          </span>
          <div
            className="flex gap-2"
            role="group"
            aria-labelledby="project-edit-color-label"
          >
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
        </div>
      </div>

      <DialogFooter className="sm:justify-between">
        <Button
          variant="outline"
          onClick={handleArchive}
          disabled={isArchiving}
          className="text-[--signal-danger] border-[--signal-danger]"
        >
          {isArchiving ? 'Arquivando...' : 'Arquivar'}
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!name.trim() || isUpdating}>
            {isUpdating ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </DialogFooter>
    </>
  )
}
