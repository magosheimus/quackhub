import { hasLoadError, retryFailedQueries } from '@/shared/query/queryState'
import { useSprints } from '@/features/sprints/hooks/useSprints'
import { getClosedSprintsByRecency } from '@/features/sprints/lib/sprint'
import { useToggleSet } from '@/shared/hooks/useToggleSet'

export function useSprintHistoryPage() {
  const sprintsQuery = useSprints()
  const { data: sprints, isLoading } = sprintsQuery
  const openSprints = useToggleSet<string>()

  const closedSprints = getClosedSprintsByRecency(sprints ?? [])

  return {
    isLoading,
    hasError: hasLoadError(sprintsQuery),
    retry: () => retryFailedQueries(sprintsQuery),
    closedSprints,
    isSprintOpen: openSprints.has,
    toggleSprint: openSprints.toggle,
  }
}
