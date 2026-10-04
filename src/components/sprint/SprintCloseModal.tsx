import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useCloseSprint } from '@/hooks/sprints/useCloseSprint'
import type { CarryoverDecision } from '@/lib/sprint'
import type { Database } from '@/types/database.types'
import { useSprints } from '@/hooks/sprints/useSprints'

type Sprint = Database['public']['Tables']['sprints']['Row']
type Task = Database['public']['Tables']['tasks']['Row']

type SprintCloseModalProps = {
  sprint: Sprint
  tasks: Task[]
}

export function SprintCloseModal({ sprint, tasks }: SprintCloseModalProps) {
  const [open, setOpen] = useState(false)
  const [decisions, setDecisions] = useState<Record<string, CarryoverDecision>>(
    {},
  )
  const { data: sprints } = useSprints()
  const { mutate: closeSprint, isPending } = useCloseSprint()

  const nextSprint = sprints?.find((s) => s.status === 'planned')

  const done = tasks.filter((t) => t.status === 'done')
  const toReview = tasks.filter((t) => t.status === 'to_review')
  const pending = tasks.filter(
    (t) => t.status !== 'done' && t.status !== 'to_review',
  )

  function handleDecisionChange(taskId: string, decision: CarryoverDecision) {
    setDecisions((prev) => {
      if (prev[taskId] === decision) {
        return Object.fromEntries(
          Object.entries(prev).filter(([id]) => id !== taskId),
        )
      }
      return { ...prev, [taskId]: decision }
    })
  }

  function handleClose() {
    closeSprint(
      { sprintId: sprint.id, decisions, nextSprintId: nextSprint?.id ?? null },
      { onSuccess: () => setOpen(false) },
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        Encerrar Sprint
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Encerrar {sprint.name}</DialogTitle>
        </DialogHeader>

        <div className="flex max-h-96 flex-col gap-4 overflow-y-auto">
          <div>
            <p className="mb-1 text-xs text-[--text-muted]">
              CONCLUÍDOS ({done.length})
            </p>
            {done.map((task) => (
              <p key={task.id} className="text-sm text-[--text-primary]">
                ✓ {task.title}
              </p>
            ))}
          </div>

          {toReview.length > 0 && (
            <div>
              <p className="mb-1 text-xs text-[--text-muted]">
                A REVISAR — voltam ao Backlog automaticamente ({toReview.length}
                )
              </p>
              {toReview.map((task) => (
                <p key={task.id} className="text-sm text-[--text-primary]">
                  {task.title}
                </p>
              ))}
            </div>
          )}

          {pending.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-[--text-muted]">
                NÃO CONCLUÍDOS — decida cada um ({pending.length})
              </p>
              {pending.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <span className="text-[--text-primary]">{task.title}</span>
                  <div className="flex gap-1">
                    <Button
                      variant={
                        decisions[task.id] === 'backlog'
                          ? 'selected'
                          : 'outline'
                      }
                      size="sm"
                      onClick={() => handleDecisionChange(task.id, 'backlog')}
                    >
                      Backlog
                    </Button>
                    <Button
                      variant={
                        decisions[task.id] === 'next_sprint'
                          ? 'default'
                          : 'outline'
                      }
                      size="sm"
                      disabled={!nextSprint}
                      onClick={() =>
                        handleDecisionChange(task.id, 'next_sprint')
                      }
                    >
                      Próxima Sprint
                    </Button>
                  </div>
                </div>
              ))}
              {!nextSprint && (
                <p className="text-xs text-[--text-muted]">
                  Sem próxima Sprint criada ainda — todos vão pro Backlog por
                  padrão.
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleClose} disabled={isPending}>
            {isPending ? 'Encerrando...' : 'Encerrar Sprint'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
