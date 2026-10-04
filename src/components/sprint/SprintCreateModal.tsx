import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useCreateSprint } from '@/hooks/sprints/useCreateSprint'
import { useSprints } from '@/hooks/sprints/useSprints'
import { todayLocal } from '@/lib/srs'

const SPRINT_DURATION_DAYS = 14

function addDays(date: string, days: number): string {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day + days))
    .toISOString()
    .slice(0, 10)
}

export function SprintCreateModal() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState(todayLocal())
  const [endDate, setEndDate] = useState(
    addDays(todayLocal(), SPRINT_DURATION_DAYS),
  )
  const [goal, setGoal] = useState('')

  const { data: sprints } = useSprints()
  const { mutate: createSprint, isPending } = useCreateSprint()

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      // RN-SP06 — sugere o próximo número toda vez que abre
      setName(`Sprint ${(sprints?.length ?? 0) + 1}`)
    } else {
      setStartDate(todayLocal())
      setEndDate(addDays(todayLocal(), SPRINT_DURATION_DAYS))
      setGoal('')
    }
    setOpen(nextOpen)
  }

  function handleSubmit() {
    if (!name.trim()) return

    createSprint(
      {
        name: name.trim(),
        start_date: startDate || null,
        end_date: endDate || null,
        goal: goal.trim() || null,
      },
      { onSuccess: () => handleOpenChange(false) },
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        + Nova Sprint
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Sprint</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="sprint-name"
              className="text-xs text-[--text-muted]"
            >
              Nome
            </label>
            <Input
              id="sprint-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex flex-1 flex-col gap-1.5">
              <label
                htmlFor="sprint-start"
                className="text-xs text-[--text-muted]"
              >
                Início
              </label>
              <Input
                id="sprint-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <label
                htmlFor="sprint-end"
                className="text-xs text-[--text-muted]"
              >
                Fim
              </label>
              <Input
                id="sprint-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="sprint-goal"
              className="text-xs text-[--text-muted]"
            >
              Goal (opcional)
            </label>
            <Textarea
              id="sprint-goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="O que essa sprint quer alcançar..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
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
