import { AUTH_ERRORS } from '@/features/auth/constants/texts'

const MESSAGE_BY_CODE: Record<string, string> = {
  invalid_credentials: AUTH_ERRORS.invalidCredentials,
  email_not_confirmed: AUTH_ERRORS.emailNotConfirmed,
  signup_disabled: AUTH_ERRORS.signupDisabled,
  access_denied: AUTH_ERRORS.accessDenied,
  over_request_rate_limit: AUTH_ERRORS.rateLimited,
  weak_password: AUTH_ERRORS.weakPassword,
  same_password: AUTH_ERRORS.samePassword,
}

export function getAuthErrorMessage(code: string | null | undefined): string {
  if (!code) {
    return AUTH_ERRORS.generic
  }
  return MESSAGE_BY_CODE[code] ?? AUTH_ERRORS.generic
}

export function readOAuthError(location: {
  search: string
  hash: string
}): string | null {
  const params = [location.search, location.hash.replace(/^#/, '?')].map(
    (part) => new URLSearchParams(part),
  )
  const failed = params.find((p) => p.has('error') || p.has('error_code'))
  if (!failed) {
    return null
  }
  return getAuthErrorMessage(failed.get('error_code') ?? failed.get('error'))
}
