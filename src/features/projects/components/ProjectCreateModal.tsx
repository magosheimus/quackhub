import { IconPlusBoxSharp } from '@/shared/lib/icons'
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
import {
  PROJECT_COLORS,
  type ProjectColor,
} from '@/features/projects/lib/project'
import { isProjectType } from '@/shared/lib/enums'
import type { ProjectType } from '@/shared/types/entities'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import {
  PROJECTS_TEXTS,
  PROJECT_TYPE_LABELS,
} from '@/features/projects/constants/texts'

export function ProjectCreateModal() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [prefix, setPrefix] = useState('')
  const [type, setType] = useState<ProjectType>('general')
  const [color, setColor] = useState<ProjectColor>(PROJECT_COLORS[0])
  const nameInputRef = useRef<HTMLInputElement>(null)
  const { mutate: createProject, isPending } = useCreateProject()

  useEffect(() => {
    if (open) nameInputRef.current?.focus()
  }, [open])

  function resetForm() {
    setName('')
    setType('general')
    setColor(PROJECT_COLORS[0])
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
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            className="size-7 rounded-md p-0 text-(--text-muted) motion-safe:transition-transform motion-safe:hover:scale-110"
          />
        }
      >
        <IconPlusBoxSharp size={16} aria-hidden="true" />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{PROJECTS_TEXTS.newProject}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="project-name"
              className="text-xs text-(--text-muted)"
            >
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

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="project-prefix"
              className="text-xs text-(--text-muted)"
            >
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

          <div className="flex flex-col gap-1.5">
            <span
              id="project-type-label"
              className="text-xs text-(--text-muted)"
            >
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

          <div className="flex flex-col gap-1.5">
            <span
              id="project-color-label"
              className="text-xs text-(--text-muted)"
            >
              {PROJECTS_TEXTS.color}
            </span>
            <div
              className="flex gap-2"
              role="group"
              aria-labelledby="project-color-label"
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
