export function calculateQuality(nota: number, confianca: number): number {
  return (nota / 2) * 0.6 + ((confianca - 1) / 4) * 5 * 0.4
}

export function calculateNewEF(ef: number, quality: number): number {
  let newEF = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  if (quality < 2) newEF -= 0.2
  return Math.max(1.3, newEF)
}

export function calculateNextInterval(
  interval: number | null,
  ef: number,
  quality: number,
): number {
  if (quality < 2) return 1
  if (!interval || interval === 0) return 1
  if (interval === 1) return 3
  return Math.round(interval * ef)
}

export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function todayLocal(): string {
  return formatDate(new Date())
}

export function addDaysToToday(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return formatDate(date)
}
