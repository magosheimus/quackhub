import { ConfirmDialog } from '@/components/ui/confirm-dialog'
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
import { useUpdateProject } from '@/features/projects/hooks/useUpdateProject'
import { useSoftDeleteProject } from '@/features/projects/hooks/useSoftDeleteProject'
import {
  PROJECT_COLORS,
  type ProjectColor,
} from '@/features/projects/lib/project'
import { isProjectType } from '@/shared/lib/enums'
import type { Project, ProjectType } from '@/shared/types/entities'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import {
  PROJECTS_TEXTS,
  PROJECT_TYPE_LABELS,
} from '@/features/projects/constants/texts'

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
  const [color, setColor] = useState<ProjectColor>(
    (project.color as ProjectColor) ?? PROJECT_COLORS[0],
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
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="project-edit-name" className="text-caption">
            {COMMON_TEXTS.name}
          </label>
          <Input
            id="project-edit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="project-edit-prefix" className="text-caption">
            {PROJECTS_TEXTS.prefix}
          </label>
          <Input
            id="project-edit-prefix"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value.toUpperCase())}
            placeholder={PROJECTS_TEXTS.prefixPlaceholder}
            maxLength={6}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span id="project-edit-type-label" className="text-caption">
            {PROJECTS_TEXTS.type}
          </span>
          <Select
            value={type}
            onValueChange={(v) => {
              if (isProjectType(v)) {
                setType(v)
              }
            }}
          >
            <SelectTrigger aria-labelledby="project-edit-type-label">
              <SelectValue>
                {type === 'general'
                  ? PROJECT_TYPE_LABELS.general
                  : PROJECT_TYPE_LABELS.study}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">
                {PROJECT_TYPE_LABELS.general}
              </SelectItem>
              <SelectItem value="study">{PROJECT_TYPE_LABELS.study}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <span id="project-edit-color-label" className="text-caption">
            {PROJECTS_TEXTS.color}
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
                aria-label={COMMON_TEXTS.selectColor(c)}
              />
            ))}
          </div>
        </div>
      </div>

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
