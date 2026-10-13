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
  hintPrefix: 'Aparece no código de cada card do projeto, como QH-12.',
  hintType:
    'Geral: tarefas com status de trabalho. Estudo: cards entram na revisão espaçada.',
  namePlaceholder: 'Nome do projeto',
  prefixPlaceholder: 'Ex: QH',
  studyProjectHint: 'Estudo: os cards entram no ciclo de revisão do SM-2.',
  archive: 'Arquivar',
  archiving: 'Arquivando...',
  archiveTitle: 'Arquivar projeto',
  confirmArchive: (name: string) =>
    `O projeto "${name}" some da sidebar e do board. Os cards continuam salvos.`,
} as const
