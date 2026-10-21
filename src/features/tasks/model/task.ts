import type {
  RecurrenceType,
  TaskOrigin,
  TaskPriority,
  TaskStatus,
} from '@/shared/types/entities'
import type { Importance } from '@/features/tasks/lib/importance'

export type TaskDue = {
  date: string
  time: string | null
}

export type TaskRecurrence =
  | {
      type: 'monthly'
      interval: number
      dayOfMonth: number | null
      endDate: string | null
    }
  | {
      type: Exclude<RecurrenceType, 'monthly'>
      interval: number
      endDate: string | null
    }

export type TaskFlag = {
  note: string | null
}

export type TaskSrs = {
  easeFactor: number
  interval: number
  nextReview: string
}

export type Task = {
  id: string
  number: number | null
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  importance: Importance | null
  origin: TaskOrigin
  projectId: string
  epicId: string | null
  sprintId: string | null
  assigneeId: string | null
  estimatedMinutes: number | null
  due: TaskDue | null
  recurrence: TaskRecurrence | null
  recurrenceParentId: string | null
  flag: TaskFlag | null
  srs: TaskSrs | null
  createdAt: string | null
  updatedAt: string
}

type TaskWritable = Omit<Task, 'id' | 'number' | 'createdAt' | 'updatedAt'>

export type NewTask = Pick<TaskWritable, 'title' | 'projectId'> &
  Partial<TaskWritable>

export type TaskUpdate = Partial<TaskWritable>
