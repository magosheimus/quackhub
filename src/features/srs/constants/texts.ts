export const SRS_TEXTS = {
  score: 'Nota (0–10)',
  confidence: 'Confiança',
  comment: 'Observação (opcional)',
  commentPlaceholder: 'Adicionar observação...',
  quality: (value: string) => `Qualidade calculada: ${value}`,
  newInterval: (days: number) => `Novo intervalo: ${days} dia(s)`,
  nextReview: (date: string) => `Próxima revisão: ${date}`,
} as const
