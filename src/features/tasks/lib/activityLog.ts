import { getStatusLabel } from '@/features/tasks/lib/taskStatus'
import { PRIORITY_CONFIG } from '@/features/tasks/lib/taskPriority'
import { TASKS_TEXTS } from '@/features/tasks/constants/texts'
import { EPICS_TEXTS } from '@/features/epics/constants/texts'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { isTaskPriority } from '@/shared/lib/enums'
import type { ActivityEventType, ActivityLog } from '@/shared/types/entities'

type NamedItem = { id: string; name: string }

export type ActivityLookups = {
  sprints: NamedItem[]
  epics: NamedItem[]
  projects: NamedItem[]
}

export type ActivityDescription = {
  label: string
  change: string
}

type ValueFormatter = (value: string | null, lookups: ActivityLookups) => string

function findName(items: NamedItem[], id: string | null, emptyLabel: string) {
  if (!id) {
    return emptyLabel
  }
  return items.find((item) => item.id === id)?.name ?? TASKS_TEXTS.removedItem
}

const EVENT_LABELS: Record<ActivityEventType, string> = {
  status_change: TASKS_TEXTS.statusEvent,
  sprint_change: TASKS_TEXTS.sprintEvent,
  priority_change: TASKS_TEXTS.priorityEvent,
  flag_change: TASKS_TEXTS.flagEvent,
  epic_change: TASKS_TEXTS.epicEvent,
  project_change: TASKS_TEXTS.projectEvent,
}

const VALUE_FORMATTERS: Record<ActivityEventType, ValueFormatter> = {
  status_change: (value) => getStatusLabel(value),
  sprint_change: (value, { sprints }) =>
    findName(sprints, value, COMMON_TEXTS.backlog),
  priority_change: (value) =>
    isTaskPriority(value)
      ? PRIORITY_CONFIG[value].text
      : TASKS_TEXTS.removedItem,
  flag_change: (value) =>
    value === 'true' ? TASKS_TEXTS.flagOn : TASKS_TEXTS.flagOff,
  epic_change: (value, { epics }) => findName(epics, value, EPICS_TEXTS.noEpic),
  project_change: (value, { projects }) =>
    findName(projects, value, TASKS_TEXTS.removedItem),
}

export function describeActivity(
  entry: Pick<ActivityLog, 'event_type' | 'old_value' | 'new_value'>,
  lookups: ActivityLookups,
): ActivityDescription {
  const format = VALUE_FORMATTERS[entry.event_type]
  return {
    label: EVENT_LABELS[entry.event_type],
    change: `${format(entry.old_value, lookups)} → ${format(entry.new_value, lookups)}`,
  }
}
