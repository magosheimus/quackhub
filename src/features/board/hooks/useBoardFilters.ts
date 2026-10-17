import { useSearchParams } from 'react-router-dom'
import {
  DEFAULT_BOARD_FILTERS,
  readBoardFilters,
  writeBoardFilters,
  type BoardFilters,
} from '@/features/board/lib/board'

export function useBoardFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = readBoardFilters(searchParams)

  // replace: trocar filtro não cria entrada no histórico
  function updateFilter<K extends keyof BoardFilters>(
    key: K,
    value: BoardFilters[K],
  ) {
    setSearchParams(
      (prev) =>
        writeBoardFilters(prev, { ...readBoardFilters(prev), [key]: value }),
      { replace: true },
    )
  }

  function setFilters(next: BoardFilters) {
    setSearchParams((prev) => writeBoardFilters(prev, next), { replace: true })
  }

  function resetFilters() {
    setSearchParams((prev) => writeBoardFilters(prev, DEFAULT_BOARD_FILTERS), {
      replace: true,
    })
  }

  return { filters, updateFilter, setFilters, resetFilters }
}
