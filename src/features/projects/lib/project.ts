import type { ProjectType } from '@/shared/types/entities'

export function isStudyProject(
  project: { type: ProjectType } | null | undefined,
): boolean {
  return project?.type === 'study'
}
