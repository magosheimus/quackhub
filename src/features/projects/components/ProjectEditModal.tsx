import { ProjectFormFields } from '@/features/projects/components/ProjectFormFields'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useUpdateProject } from '@/features/projects/hooks/useUpdateProject'
import { useSoftDeleteProject } from '@/features/projects/hooks/useSoftDeleteProject'
import type { Project, ProjectType } from '@/shared/types/entities'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import {
  DEFAULT_PALETTE_COLOR,
  toPaletteColor,
  type PaletteColor,
} from '@/shared/lib/palette'
import { PROJECTS_TEXTS } from '@/features/projects/constants/texts'

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{PROJECTS_TEXTS.editProject}</DialogTitle>
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
  const [prefix, setPrefix] = useState(project.prefix ?? '')
  const [type, setType] = useState<ProjectType>(project.type)
  const [color, setColor] = useState<PaletteColor>(
    toPaletteColor(project.color) ?? DEFAULT_PALETTE_COLOR,
  )

  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject()
  const { mutate: archiveProject, isPending: isArchiving } =
    useSoftDeleteProject()

  function handleSave() {
    if (!name.trim() || !prefix.trim()) return
    updateProject(
      {
        id: project.id,
        data: {
          name: name.trim(),
          type,
          color,
          prefix: prefix.trim().toUpperCase(),
        },
      },
      { onSuccess: onClose },
    )
  }

  const [isConfirmingArchive, setIsConfirmingArchive] = useState(false)

  return (
    <>
      <ProjectFormFields
        idPrefix="project-edit"
        name={name}
        prefix={prefix}
        type={type}
        color={color}
        onNameChange={setName}
        onPrefixChange={setPrefix}
        onTypeChange={setType}
        onColorChange={setColor}
      />

      <DialogFooter className="sm:justify-between">
        <Button
          variant="outline"
          onClick={() => setIsConfirmingArchive(true)}
          disabled={isArchiving}
          className="text-danger border-danger"
        >
          {isArchiving ? PROJECTS_TEXTS.archiving : PROJECTS_TEXTS.archive}
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            {COMMON_TEXTS.cancel}
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim() || !prefix.trim() || isUpdating}
          >
            {isUpdating ? COMMON_TEXTS.saving : COMMON_TEXTS.save}
          </Button>
        </div>
      </DialogFooter>

      <ConfirmDialog
        open={isConfirmingArchive}
        onOpenChange={setIsConfirmingArchive}
        title={PROJECTS_TEXTS.archiveTitle}
        description={PROJECTS_TEXTS.confirmArchive(project.name)}
        confirmLabel={PROJECTS_TEXTS.archive}
        onConfirm={() => archiveProject(project.id, { onSuccess: onClose })}
      />
    </>
  )
}
