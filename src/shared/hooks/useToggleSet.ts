import { useState } from 'react'

// Conjunto de ids abertos/recolhidos/selecionados, com alternância por item
export function useToggleSet<T>() {
  const [items, setItems] = useState<Set<T>>(() => new Set())

  function toggle(item: T) {
    setItems((prev) => {
      const next = new Set(prev)
      if (next.has(item)) {
        next.delete(item)
      } else {
        next.add(item)
      }
      return next
    })
  }

  function has(item: T) {
    return items.has(item)
  }

  return { has, toggle }
}
