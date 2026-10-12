import { AUTH_ERRORS } from '@/features/auth/constants/texts'

export const MIN_PASSWORD_LENGTH = 8

export type PasswordIssue = 'tooShort' | 'needsLetterAndDigit' | 'mismatch'

const ISSUE_MESSAGES: Record<PasswordIssue, string> = {
  tooShort: AUTH_ERRORS.passwordTooShort,
  needsLetterAndDigit: AUTH_ERRORS.passwordNeedsLetterAndDigit,
  mismatch: AUTH_ERRORS.passwordMismatch,
}

export function getPasswordIssue(
  password: string,
  confirmation: string,
): PasswordIssue | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return 'tooShort'
  }
  if (!/[a-z]/i.test(password) || !/\d/.test(password)) {
    return 'needsLetterAndDigit'
  }
  if (password !== confirmation) {
    return 'mismatch'
  }
  return null
}

export function getPasswordIssueMessage(issue: PasswordIssue): string {
  return ISSUE_MESSAGES[issue]
}
