import { useState } from 'react'
import { DEFAULT_BOARD_FILTERS, type BoardFilters } from '@/lib/board'

export function useBoardFilters() {
  const [filters, setFilters] = useState<BoardFilters>(DEFAULT_BOARD_FILTERS)

  function updateFilter<K extends keyof BoardFilters>(
    key: K,
    value: BoardFilters[K],
  ) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  function resetFilters() {
    setFilters(DEFAULT_BOARD_FILTERS)
  }

  return { filters, updateFilter, resetFilters }
}
