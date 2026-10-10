export function startOfWeek(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const dayOfWeek = date.getDay()
  date.setDate(date.getDate() - dayOfWeek)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export type QualityLog = {
  session_date: string
  quality: number | null
}

export type AccuracyOverTimeItem = {
  week: string
  averageQuality: number
}

export function groupQualityByWeek(rows: QualityLog[]): AccuracyOverTimeItem[] {
  const buckets = new Map<string, { sum: number; count: number }>()

  for (const row of rows) {
    if (row.quality === null) continue
    const week = startOfWeek(row.session_date)
    const bucket = buckets.get(week) ?? { sum: 0, count: 0 }
    bucket.sum += row.quality
    bucket.count += 1
    buckets.set(week, bucket)
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, { sum, count }]) => ({
      week,
      averageQuality: sum / count,
    }))
}
