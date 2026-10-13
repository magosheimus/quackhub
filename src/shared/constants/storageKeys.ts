export const STORAGE_KEYS = {
  queryCache: 'quackhub-query-cache',
  settings: 'quackhub-settings',
  draftsQueue: 'quackhub-drafts-queue',
  projectView: 'quackhub-project-view',
} as const

// Dados do usuário logado: apagados ao sair. As configurações ficam,
// porque são preferências do dispositivo.
export const USER_DATA_KEYS = [
  STORAGE_KEYS.queryCache,
  STORAGE_KEYS.draftsQueue,
] as const
