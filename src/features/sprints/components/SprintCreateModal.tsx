import { IconPlus } from '@/shared/lib/icons'
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
import { useCreateSprint } from '@/features/sprints/hooks/useCreateSprint'
import { useSprints } from '@/features/sprints/hooks/useSprints'
import { shiftDbDate, todayLocal } from '@/shared/lib/date'
import { useSprintDueCandidates } from '@/features/sprints/hooks/useSprintDueCandidates'
import { SprintDueCandidates } from '@/features/sprints/components/SprintDueCandidates'
import { useAddTaskToSprint } from '@/features/tasks/hooks/sprint/useAddTaskToSprint'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { getInitialStatusForType } from '@/features/tasks/lib/taskStatus'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { SPRINTS_TEXTS } from '@/features/sprints/constants/texts'
import { DatePicker } from '@/components/pickers/date-picker'
import { useDatePreferences } from '@/features/settings/hooks/useDatePreferences'

const SPRINT_DURATION_DAYS = 14

export function SprintCreateModal() {
  const datePreferences = useDatePreferences()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState(todayLocal())
  const [endDate, setEndDate] = useState(
    shiftDbDate(todayLocal(), SPRINT_DURATION_DAYS),
  )
  const [goal, setGoal] = useState('')
  const candidates = useSprintDueCandidates(startDate, endDate)
  const { mutate: addTaskToSprint } = useAddTaskToSprint()
  const { data: projects } = useProjects()

  const { data: sprints } = useSprints()
  const { mutate: createSprint, isPending } = useCreateSprint()

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      // RN-SP06 — sugere o próximo número toda vez que abre
      setName(SPRINTS_TEXTS.defaultName((sprints?.length ?? 0) + 1))
    } else {
      setStartDate(todayLocal())
      setEndDate(shiftDbDate(todayLocal(), SPRINT_DURATION_DAYS))
      setGoal('')
      candidates.reset()
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
      {
        onSuccess: (sprint) => {
          addSelectedTasks(sprint.id)
          handleOpenChange(false)
        },
      },
    )
  }

  function addSelectedTasks(sprintId: string) {
    for (const task of candidates.selectedTasks) {
      const project = projects?.find((item) => item.id === task.projectId)
      if (!project) {
        continue
      }
      addTaskToSprint({
        taskId: task.id,
        sprintId,
        status: getInitialStatusForType(project.type),
        projectId: task.projectId,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <IconPlus size={12} aria-hidden="true" />
        {SPRINTS_TEXTS.newSprint}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{SPRINTS_TEXTS.newSprint}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="sprint-name" className="text-caption">
              {COMMON_TEXTS.name}
            </label>
            <Input
              id="sprint-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex flex-1 flex-col gap-1.5">
              <label htmlFor="sprint-start" className="text-caption">
                {SPRINTS_TEXTS.start}
              </label>
              <DatePicker
                id="sprint-start"
                label={SPRINTS_TEXTS.start}
                value={startDate || null}
                onChange={(date) => setStartDate(date ?? '')}
                {...datePreferences}
              />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <label htmlFor="sprint-end" className="text-caption">
                {SPRINTS_TEXTS.end}
              </label>
              <DatePicker
                id="sprint-end"
                label={SPRINTS_TEXTS.end}
                value={endDate || null}
                onChange={(date) => setEndDate(date ?? '')}
                {...datePreferences}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="sprint-goal" className="text-caption">
              {SPRINTS_TEXTS.goal}
            </label>
            <Textarea
              id="sprint-goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder={SPRINTS_TEXTS.goalPlaceholder}
            />
          </div>

          <SprintDueCandidates
            inPeriod={candidates.inPeriod}
            overdue={candidates.overdue}
            isSelected={candidates.isSelected}
            onToggle={candidates.toggle}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            {COMMON_TEXTS.cancel}
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim() || isPending}>
            {isPending ? COMMON_TEXTS.creating : COMMON_TEXTS.create}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
