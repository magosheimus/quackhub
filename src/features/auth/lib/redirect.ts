export const HOME_PATH = '/inbox'

// Só caminhos internos: evita redirecionamento aberto para "//site.com"
export function getRedirectTarget(state: unknown): string {
  if (typeof state !== 'object' || state === null || !('from' in state)) {
    return HOME_PATH
  }
  const { from } = state
  if (
    typeof from !== 'string' ||
    !from.startsWith('/') ||
    from.startsWith('//')
  ) {
    return HOME_PATH
  }
  return from
}
