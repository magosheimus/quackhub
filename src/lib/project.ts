export const PROJECT_COLORS = [
  '#e3a857',
  '#7a9e7e',
  '#5c8ca6',
  '#b6656e',
  '#8a7ca8',
  '#c2b280',
] as const

export type ProjectColor = (typeof PROJECT_COLORS)[number]
export type ProjectType = 'general' | 'study'