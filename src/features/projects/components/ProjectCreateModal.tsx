import { ProjectFormFields } from '@/features/projects/components/ProjectFormFields'
import { IconPlus, IconPlusBoxSharp } from '@/shared/lib/icons'
import { useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useCreateProject } from '@/features/projects/hooks/useCreateProject'
import type { ProjectType } from '@/shared/types/entities'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { DEFAULT_PALETTE_COLOR, type PaletteColor } from '@/shared/lib/palette'
import { PROJECTS_TEXTS } from '@/features/projects/constants/texts'

type ProjectCreateModalProps = {
  triggerVariant?: 'icon' | 'button'
}

export function ProjectCreateModal({
  triggerVariant = 'icon',
}: ProjectCreateModalProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [prefix, setPrefix] = useState('')
  const [type, setType] = useState<ProjectType>('general')
  const [color, setColor] = useState<PaletteColor>(DEFAULT_PALETTE_COLOR)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const { mutate: createProject, isPending } = useCreateProject()

  useEffect(() => {
    if (open) {
      nameInputRef.current?.focus()
    }
  }, [open])

  function resetForm() {
    setName('')
    setType('general')
    setColor(DEFAULT_PALETTE_COLOR)
    setPrefix('')
  }

  function handleSubmit() {
    if (!name.trim() || !prefix.trim()) {
      return
    }

    createProject(
      { name: name.trim(), type, color, prefix: prefix.trim().toUpperCase() },
      {
        onSuccess: () => {
          resetForm()
          setOpen(false)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerVariant === 'button' ? (
        <DialogTrigger render={<Button size="sm" />}>
          <IconPlus size={12} aria-hidden="true" />
          {PROJECTS_TEXTS.newProject}
        </DialogTrigger>
      ) : (
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              className="size-7 rounded-md p-0 text-fg-muted motion-safe:transition-transform motion-safe:hover:scale-110"
              aria-label={PROJECTS_TEXTS.newProject}
            />
          }
        >
          <IconPlusBoxSharp size={16} aria-hidden="true" />
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{PROJECTS_TEXTS.newProject}</DialogTitle>
        </DialogHeader>

        <ProjectFormFields
          idPrefix="project"
          name={name}
          prefix={prefix}
          type={type}
          color={color}
          onNameChange={setName}
          onPrefixChange={setPrefix}
          onTypeChange={setType}
          onColorChange={setColor}
          nameInputRef={nameInputRef}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {COMMON_TEXTS.cancel}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || !prefix.trim() || isPending}
          >
            {isPending ? COMMON_TEXTS.creating : COMMON_TEXTS.create}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
