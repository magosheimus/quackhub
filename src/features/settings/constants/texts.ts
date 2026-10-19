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
  'share-tech': 'Share Tech Mono',
  'space-mono': 'Space Mono',
  'courier-prime': 'Courier Prime',
  pixelify: 'Pixelify Sans',
}

export const DATE_FORMAT_LABELS: Record<Settings['dateFormat'], string> = {
  'dd/MM/yyyy': 'DD/MM/AAAA',
  'MM/dd/yyyy': 'MM/DD/AAAA',
}

export const WEEK_START_LABELS: Record<Settings['weekStartsOn'], string> = {
  0: 'Domingo',
  1: 'Segunda',
}

export const TEXT_SIZE_LABELS: Record<Settings['textSize'], string> = {
  small: 'Pequeno',
  normal: 'Normal',
  large: 'Grande',
  xlarge: 'Muito grande',
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
  intensity: 'Intensidade de fundo',
  scanlines: 'Scanlines',
  glow: 'Glow',
  lcdGhost: 'Efeito LCD',
  background: 'Fundo',
  effects: 'Efeitos',
  typography: 'Tipografia',
  dates: 'Datas',
  bodyFont: 'Fonte do corpo',
  textSize: 'Tamanho do texto',
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
  restoreAppearance: 'Restaurar aparência padrão',
  restoreAppearanceDescription:
    'Volta cartucho, fonte, fundo e efeitos ao padrão. Datas e personas não mudam.',
  restoreAppearanceTitle: 'Restaurar aparência?',
  restoreAppearanceConfirm: 'Restaurar',
} as const
