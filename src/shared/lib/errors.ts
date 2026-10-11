import { showErrorToast } from '@/shared/lib/toast'

export const ERROR_MESSAGES = {
  generic: 'Algo deu errado. Tente novamente.',
  offline: 'Sem conexão. A operação não foi concluída.',
  loadFailed: 'Não foi possível carregar os dados.',
} as const

// Erro de regra de negócio: a mensagem foi escrita para o usuário e é
// exibida como está. Erros técnicos (Supabase, rede) continuam como Error
// e viram uma mensagem genérica na tela.
export class UserFacingError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UserFacingError'
  }
}

export function getErrorMessage(
  error: unknown,
  fallback: string = ERROR_MESSAGES.generic,
): string {
  if (error instanceof UserFacingError) {
    return error.message
  }
  if (!navigator.onLine) {
    return ERROR_MESSAGES.offline
  }
  return fallback
}

// Ponto único de exibição: detalhe técnico no console, mensagem legível na tela
export function reportError(error: unknown, fallback?: string): void {
  console.error(error)
  showErrorToast(getErrorMessage(error, fallback))
}
