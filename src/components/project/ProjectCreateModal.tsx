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
import { useCreateProject } from '@/hooks/useCreateProject'
import { PROJECT_COLORS } from '@/lib/projectColors'

type ProjectType = 'general' | 'study'

export function ProjectCreateModal() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState<ProjectType>('general')
  const [color, setColor] = useState<(typeof PROJECT_COLORS)[number]>(
    PROJECT_COLORS[0],
  )
  const nameInputRef = useRef<HTMLInputElement>(null)
  const { mutate: createProject, isPending } = useCreateProject()

  useEffect(() => {
    if (open) nameInputRef.current?.focus()
  }, [open])

  function resetForm() {
    setName('')
    setType('general')
    setColor(PROJECT_COLORS[0])
  }

  function handleSubmit() {
    if (!name.trim()) return

    createProject(
      { name: name.trim(), type, color },
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
      <DialogTrigger render={<Button variant="ghost" size="icon-sm" />}>
        +
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo projeto</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="project-name"
              className="text-xs text-[--text-muted]"
            >
              Nome
            </label>
            <Input
              id="project-name"
              ref={nameInputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do projeto"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span
              id="project-type-label"
              className="text-xs text-[--text-muted]"
            >
              Tipo
            </span>
            <Select
              value={type}
              onValueChange={(v) => setType(v as ProjectType)}
            >
              <SelectTrigger aria-labelledby="project-type-label">
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
              id="project-color-label"
              className="text-xs text-[--text-muted]"
            >
              Cor
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
                  aria-label={`Selecionar cor ${c}`}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim() || isPending}>
            {isPending ? 'Criando...' : 'Criar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
