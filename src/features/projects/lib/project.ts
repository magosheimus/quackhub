import { NEUTRAL_COLOR, resolvePaletteColor } from '@/shared/lib/palette'
import type { Project, ProjectType } from '@/shared/types/entities'

export function isStudyProject(
  project: { type: ProjectType } | null | undefined,
): boolean {
  return project?.type === 'study'
}

export type ProjectLabel = {
  prefix: string
  color: string
}

export type ProjectLabels = Map<string, ProjectLabel>

export function toProjectLabel(
  project: Pick<Project, 'prefix' | 'color'>,
): ProjectLabel {
  return {
    prefix: project.prefix ?? '',
    color: resolvePaletteColor(project.color, NEUTRAL_COLOR),
  }
}

export function buildProjectLabels(
  projects: Pick<Project, 'id' | 'prefix' | 'color'>[],
): ProjectLabels {
  return new Map(
    projects.map((project) => [project.id, toProjectLabel(project)]),
  )
}

export function formatTaskCode(prefix: string, taskNumber: number): string {
  return prefix ? `${prefix}-${taskNumber}` : `#${taskNumber}`
}

export type ProjectOption = {
  id: string
  name: string
  color: string
}

export function buildProjectOptions(
  projects: Pick<Project, 'id' | 'name' | 'color'>[],
): ProjectOption[] {
  return projects.map((project) => ({
    id: project.id,
    name: project.name,
    color: resolvePaletteColor(project.color, NEUTRAL_COLOR),
  }))
}

export function getProjectInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || '?'
}
