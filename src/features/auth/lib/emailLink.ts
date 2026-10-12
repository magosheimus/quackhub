import { createEnumGuard } from '@/shared/lib/enums'

export const EMAIL_LINK_TYPES = ['invite', 'recovery'] as const
export type EmailLinkType = (typeof EMAIL_LINK_TYPES)[number]

const isEmailLinkType = createEnumGuard(EMAIL_LINK_TYPES)

export type EmailLink = {
  tokenHash: string
  type: EmailLinkType
}

export function readEmailLink(search: string): EmailLink | null {
  const params = new URLSearchParams(search)
  const tokenHash = params.get('token_hash')
  const type = params.get('type')
  if (!tokenHash || !isEmailLinkType(type)) {
    return null
  }
  return { tokenHash, type }
}
