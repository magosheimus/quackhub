import type { TaskLink } from '@/shared/types/entities'

const URL_SCHEME = /^[a-z][a-z\d+.-]*:\/\//i

export function normalizeLinkUrl(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) {
    return null
  }
  const candidate = URL_SCHEME.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    const url = new URL(candidate)
    const isWeb = url.protocol === 'http:' || url.protocol === 'https:'
    return isWeb && url.hostname.includes('.') ? url.href : null
  } catch {
    return null
  }
}

export function getLinkDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function getLinkLabel(link: Pick<TaskLink, 'url' | 'title'>): string {
  return link.title ?? link.url.replace(URL_SCHEME, '').replace(/\/$/, '')
}
