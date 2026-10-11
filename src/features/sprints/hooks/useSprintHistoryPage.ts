import { useSprints } from '@/features/sprints/hooks/useSprints'
import { getClosedSprintsByRecency } from '@/features/sprints/lib/sprint'
import { useToggleSet } from '@/shared/hooks/useToggleSet'

export function useSprintHistoryPage() {
  const { data: sprints, isLoading } = useSprints()
  const openSprints = useToggleSet<string>()

  const closedSprints = getClosedSprintsByRecency(sprints ?? [])

  return {
    isLoading,
    closedSprints,
    isSprintOpen: openSprints.has,
    toggleSprint: openSprints.toggle,
  }
}
