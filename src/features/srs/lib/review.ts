import type { ProjectType, TaskStatus } from '@/shared/types/entities'

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

const SRS_ELIGIBLE_STATUSES: TaskStatus[] = [
  'studying',
  'to_review',
  'scheduled',
]

export function canRegisterPerformance(
  projectType: ProjectType | null | undefined,
  status: TaskStatus,
): boolean {
  return projectType === 'study' && SRS_ELIGIBLE_STATUSES.includes(status)
}
