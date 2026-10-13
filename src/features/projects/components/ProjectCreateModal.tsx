import { InlineHint } from '@/components/ui/inline-hint'
import { IconPlus, IconPlusBoxSharp, IconRefresh } from '@/shared/lib/icons'
import { useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
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
import { useCreateProject } from '@/features/projects/hooks/useCreateProject'
import { isStudyProject } from '@/features/projects/lib/project'
import { isProjectType } from '@/shared/lib/enums'
import type { ProjectType } from '@/shared/types/entities'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { ColorSwatchPicker } from '@/components/ui/color-swatch-picker'
import { DEFAULT_PALETTE_COLOR, type PaletteColor } from '@/shared/lib/palette'
import {
  PROJECTS_TEXTS,
  PROJECT_TYPE_LABELS,
} from '@/features/projects/constants/texts'

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
    if (open) nameInputRef.current?.focus()
  }, [open])

  function resetForm() {
    setName('')
    setType('general')
    setColor(DEFAULT_PALETTE_COLOR)
    setPrefix('')
  }

  function handleSubmit() {
    if (!name.trim() || !prefix.trim()) return

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

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_8rem]">
            <div className="flex min-w-0 flex-col gap-1.5">
              <label htmlFor="project-name" className="text-caption">
                {COMMON_TEXTS.name}
              </label>
              <Input
                id="project-name"
                ref={nameInputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={PROJECTS_TEXTS.namePlaceholder}
              />
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
              <label htmlFor="project-prefix" className="text-caption">
                {PROJECTS_TEXTS.prefix}
              </label>
              <Input
                id="project-prefix"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value.toUpperCase())}
                placeholder={PROJECTS_TEXTS.prefixPlaceholder}
                maxLength={6}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 [&_[data-slot=select-trigger]]:w-full">
            <div className="flex min-w-0 flex-col gap-1.5">
              <span id="project-type-label" className="text-caption">
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
                <SelectTrigger aria-labelledby="project-type-label">
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
                  <SelectItem value="study">
                    {PROJECT_TYPE_LABELS.study}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
              <span id="project-color-label" className="text-caption">
                {PROJECTS_TEXTS.color}
              </span>
              <ColorSwatchPicker
                value={color}
                onChange={setColor}
                aria-labelledby="project-color-label"
              />
            </div>
          </div>

          {isStudyProject({ type }) && (
            <InlineHint icon={IconRefresh}>
              {PROJECTS_TEXTS.studyProjectHint}
            </InlineHint>
          )}
        </div>

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
