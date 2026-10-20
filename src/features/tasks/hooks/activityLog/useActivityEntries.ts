import { useActivityLog } from '@/features/tasks/hooks/activityLog/useActivityLog'
import { useSprints } from '@/features/sprints/hooks/useSprints'
import { useAllEpics } from '@/features/epics/hooks/useAllEpics'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { describeActivity } from '@/features/tasks/lib/activityLog'
import { formatDateTime } from '@/shared/lib/date'
import { useDatePreferences } from '@/features/settings/hooks/useDatePreferences'

export type ActivityEntry = {
  id: string
  dateTime: string
  label: string
  change: string
}

export function useActivityEntries(taskId: string): ActivityEntry[] {
  const { dateFormat } = useDatePreferences()
  const { data: activity } = useActivityLog(taskId)
  const { data: sprints } = useSprints()
  const { data: epics } = useAllEpics()
  const { data: projects } = useProjects()
  const lookups = {
    sprints: sprints ?? [],
    epics: epics ?? [],
    projects: projects ?? [],
  }

  return (activity ?? []).map((entry) => ({
    id: entry.id,
    dateTime: formatDateTime(entry.created_at, dateFormat),
    ...describeActivity(entry, lookups),
  }))
}
