import type { Settings } from '@/features/settings/lib/settings'
import type { SettingsTab } from '@/features/settings/lib/settingsTab'

export const SETTINGS_TAB_LABELS: Record<SettingsTab, string> = {
  appearance: 'Aparência',
  preferences: 'Preferências',
  personas: 'Personas',
  account: 'Conta',
}

export const TEXTURE_LABELS: Record<Settings['texture'], string> = {
  none: 'Sem textura',
  lines: 'Pautado',
  grid: 'Grade',
  graph: 'Milimetrado',
  dots: 'Pontos',
  lcd: 'Malha LCD',
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
  intensity: 'Intensidade',
  scanlines: 'Scanlines',
  glow: 'Glow',
  lcdGhost: 'Efeito LCD',
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
