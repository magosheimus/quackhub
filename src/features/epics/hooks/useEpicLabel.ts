import { useAllEpics } from '@/features/epics/hooks/useAllEpics'
import { findEpicLabel, type EpicLabel } from '@/features/epics/lib/epic'

export function useEpicLabel(epicId: string | null): EpicLabel | null {
  const { data: epics = [] } = useAllEpics()
  return findEpicLabel(epics, epicId)
}
