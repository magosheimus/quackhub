export const IMPORTANCE_LEVELS = [1, 2, 3, 4, 5] as const

export const IMPORTANCE_LEVELS_DESC = [...IMPORTANCE_LEVELS].reverse()

export type Importance = (typeof IMPORTANCE_LEVELS)[number]

export function toImportance(value: number | null): Importance | null {
  return IMPORTANCE_LEVELS.find((level) => level === value) ?? null
}

export function nextImportance(
  current: Importance | null,
  clicked: Importance,
): Importance | null {
  return current === clicked ? null : clicked
}
