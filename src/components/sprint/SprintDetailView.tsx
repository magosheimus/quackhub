import { useParams } from 'react-router-dom'
import { useSprints } from '@/hooks/sprints/useSprints'
import { SprintSummary } from './SprintSummary'
import { LoadingText } from '../ui/loading-text'

export function SprintDetailView() {
  const { id } = useParams<{ id: string }>()
  const { data: sprints, isLoading } = useSprints()

  if (isLoading) {
    return <LoadingText />
  }

  const sprint = sprints?.find((s) => s.id === id)

  if (!sprint) {
    return (
      <div className="text-sm text-[--text-muted]">
        — Sprint não encontrada —
      </div>
    )
  }

  return <SprintSummary sprint={sprint} />
}
