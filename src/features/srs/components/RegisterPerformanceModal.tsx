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
import { useRegisterPerformance } from '@/features/srs/hooks/useRegisterPerformance'
import {
  calculateQuality,
  calculateNewEF,
  calculateNextInterval,
} from '@/features/srs/lib/review'
import { addDaysToToday } from '@/shared/lib/date'
import type { Task } from '@/features/tasks/model/task'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { SRS_TEXTS } from '@/features/srs/constants/texts'
import { Panel } from '@/components/layout/panel'

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
  const newEF = calculateNewEF(task.srs?.easeFactor ?? 2.5, quality)
  const newInterval = calculateNextInterval(
    task.srs?.interval ?? null,
    newEF,
    quality,
  )
  const nextReviewDate = addDaysToToday(newInterval)

  function handleConfirm() {
    registerPerformance(
      {
        taskId: task.id,
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
          <DialogTitle>{COMMON_TEXTS.registerPerformance}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="srs-nota" className="text-caption">
              {SRS_TEXTS.score}
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
            <span id="confianca-label" className="text-caption">
              {SRS_TEXTS.confidence}
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
                  variant={confianca === option ? 'selected' : 'outline'}
                  size="sm"
                  onClick={() => setConfianca(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="srs-comment" className="text-caption">
              {SRS_TEXTS.comment}
            </label>
            <Textarea
              id="srs-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={SRS_TEXTS.commentPlaceholder}
            />
          </div>

          <Panel className="p-3 text-caption">
            <p>{SRS_TEXTS.quality(quality.toFixed(2))}</p>
            <p>{SRS_TEXTS.newInterval(newInterval)}</p>
            <p>{SRS_TEXTS.nextReview(nextReviewDate)}</p>
          </Panel>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {COMMON_TEXTS.cancel}
          </Button>
          <Button onClick={handleConfirm} disabled={isPending}>
            {COMMON_TEXTS.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
