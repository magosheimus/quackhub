import type { ProjectType } from '@/shared/types/entities'

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  general: 'Geral',
  study: 'Estudo',
}

export const PROJECTS_TEXTS = {
  newProject: 'Novo projeto',
  editProject: 'Editar projeto',
  prefix: 'Prefixo',
  type: 'Tipo',
  color: 'Cor',
  namePlaceholder: 'Nome do projeto',
  prefixPlaceholder: 'Ex: QH',
  archive: 'Arquivar',
  archiving: 'Arquivando...',
  confirmArchive: (name: string) => `Arquivar o projeto "${name}"?`,
} as const
