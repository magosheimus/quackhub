import { useSearchParams } from 'react-router-dom'
import {
  readBacklogFilters,
  writeBacklogFilters,
  type BacklogUrlFilters,
} from '@/features/backlog/lib/backlog'

export function useBacklogFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  // replace: trocar filtro não cria entrada no histórico
  function update(changes: Partial<BacklogUrlFilters>) {
    setSearchParams(
      (prev) =>
        writeBacklogFilters(prev, { ...readBacklogFilters(prev), ...changes }),
      { replace: true },
    )
  }

  return { filters: readBacklogFilters(searchParams), update }
}
