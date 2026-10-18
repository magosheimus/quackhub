import type { Settings } from '@/features/settings/lib/settings'

export const TEXTURE_LABELS: Record<Settings['texture'], string> = {
  none: 'Nenhuma',
  grid: 'Grade',
  dots: 'Pontos',
}

export const FONT_LABELS: Record<Settings['fontBody'], string> = {
  jetbrains: 'JetBrains Mono',
  'ibm-plex': 'IBM Plex Mono',
}

export const WEEK_START_LABELS: Record<Settings['weekStartsOn'], string> = {
  0: 'Domingo',
  1: 'Segunda',
}

export const LCD_GHOST_LABELS: Record<Settings['lcdGhost'], string> = {
  off: 'Desligado',
  subtle: 'Sutil',
  glitch: 'Glitch RGB',
}

export const CARTUCHO_LABELS: Record<Settings['cartucho'], string> = {
  sage: 'Sage',
  amber: 'Amber',
  slate: 'Slate',
  earth: 'Earth',
  'sage-dark': 'Sage Dark',
  'amber-dark': 'Amber Dark',
}

export const SETTINGS_TEXTS = {
  title: 'Configurações',
  appearance: 'Aparência',
  intensity: 'Intensidade',
  scanlines: 'Scanlines',
  glow: 'Glow',
  lcdGhost: 'Efeito LCD',
  preferences: 'Preferências',
  bodyFont: 'Fonte do corpo',
  dateFormat: 'Formato de data',
  weekStart: 'Primeiro dia da semana',
  data: 'Dados',
  exportData: 'Exportar dados',
  exportDescription: 'Baixa um .json com todas as suas informações.',
  export: 'Exportar',
  exporting: 'Exportando...',
  exportError: 'Falha ao exportar dados',
  clearCache: 'Limpar cache',
  clearCacheDescription:
    'Remove os dados salvos no navegador e recarrega a página.',
  cartucho: 'Cartucho',
  syncError: 'Não foi possível sincronizar as preferências.',
} as const
