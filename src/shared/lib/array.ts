export function moveItem<T>(items: T[], from: number, to: number): T[] {
  const next = [...items]
  const [moved] = next.splice(from, 1)
  if (moved === undefined) {
    return items
  }
  next.splice(to, 0, moved)
  return next
}

export function toggleItem<T>(items: T[], item: T): T[] {
  return items.includes(item)
    ? items.filter((current) => current !== item)
    : [...items, item]
}

export function cycleItem<T>(items: readonly T[], current: T, step: 1 | -1): T {
  const index = items.indexOf(current)
  const next = (index + step + items.length) % items.length
  return items[next] ?? current
}
