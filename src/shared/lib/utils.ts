import { createCn } from 'cn/config'

// Classes de tipografia próprias contam como tamanho de fonte, não como cor:
// sem isso, cn('text-caption', 'text-fg') descartaria o text-caption
export const TEXT_ROLES = [
  'display',
  'heading-1',
  'heading-2',
  'heading-3',
  'body-strong',
  'body',
  'body-sm',
  'caption',
  'micro',
] as const

export const cn = createCn({
  extend: { classGroups: { 'font-size': [{ text: [...TEXT_ROLES] }] } },
})
