import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useRegisterPerformance } from '@/hooks/srs/useRegisterPerformance'
import {
  calculateQuality,
  calculateNewEF,
  calculateNextInterval,
  addDaysToToday,
} from '@/lib/srs'
import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']

const CONFIANCA_OPTIONS = [1, 2, 3, 4, 5]

type RegisterPerformanceModalProps = {
  task: Task
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RegisterPerformanceModal({
  task,
  open,
  onOpenChange,
}: RegisterPerformanceModalProps) {
  const [nota, setNota] = useState(5)
  const [confianca, setConfianca] = useState(3)
  const [comment, setComment] = useState('')
  const { mutate: registerPerformance, isPending } = useRegisterPerformance()

  const quality = calculateQuality(nota, confianca)
  const newEF = calculateNewEF(task.ease_factor ?? 2.5, quality)
  const newInterval = calculateNextInterval(task.interval, newEF, quality)
  const nextReviewDate = addDaysToToday(newInterval)

  function handleConfirm() {
    registerPerformance(
      {
        taskId: task.id,
        projectId: task.project_id,
        sprintId: task.sprint_id,
        nota,
        confianca,
        comment: comment.trim() || undefined,
      },
      {
        onSuccess: () => {
          setNota(5)
          setConfianca(3)
          setComment('')
          onOpenChange(false)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Desempenho</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="srs-nota" className="text-xs text-[--text-muted]">
              Nota (0–10)
            </label>
            <Input
              id="srs-nota"
              type="number"
              min={0}
              max={10}
              step={0.01}
              value={nota}
              onChange={(e) => setNota(Number(e.target.value))}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span id="confianca-label" className="text-xs text-[--text-muted]">
              Confiança
            </span>
            <div
              className="flex gap-1"
              role="group"
              aria-labelledby="confianca-label"
            >
              {CONFIANCA_OPTIONS.map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant={confianca === option ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setConfianca(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="srs-comment"
              className="text-xs text-[--text-muted]"
            >
              Observação (opcional)
            </label>
            <Textarea
              id="srs-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Adicionar observação..."
            />
          </div>

          <div className="rounded-[--radius-md] border border-[--border] bg-[--bg-card] p-3 text-xs text-[--text-muted]">
            <p>Qualidade calculada: {quality.toFixed(2)}</p>
            <p>Novo intervalo: {newInterval} dia(s)</p>
            <p>Próxima revisão: {nextReviewDate}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isPending}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
