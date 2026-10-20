import type { Settings } from '@/features/settings/lib/settings'
import type { SettingsTab } from '@/features/settings/lib/settingsTab'
import type { UiScale } from '@/features/settings/lib/uiScale'

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

export const UI_SCALE_LABELS: Record<UiScale, string> = {
  '80': '80%',
  '90': '90%',
  '100': 'Normal',
  '110': '110%',
  '120': '120%',
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
  screen: 'Tela',
  uiScale: 'Escala da interface',
  uiScaleHint: 'Salva só neste aparelho.',
  dates: 'Datas',
  bodyFont: 'Fonte do corpo',
  textSize: 'Tamanho do texto',
  dateFormat: 'Formato de data',
  weekStart: 'Primeiro dia da semana',
  data: 'Dados',
  exportData: 'Exportar dados',
  exportDescription:
    'Baixa um .json com projetos, cards, sprints, revisões, hábitos, rascunhos, personas e preferências. Os arquivos anexados não entram, só a referência a eles.',
  export: 'Exportar',
  exporting: 'Exportando...',
  exportError: 'Falha ao exportar dados',
  clearCache: 'Limpar cache',
  clearCacheDescription:
    'Apaga a cópia dos dados guardada neste navegador e recarrega a página. Nada da conta é perdido: tudo volta do servidor.',
  cartucho: 'Cartucho',
  syncError: 'Não foi possível sincronizar as preferências.',
  dangerZone: 'Zona de risco',
  autoSaved: 'Alterações salvas automaticamente',
  restoreAppearance: 'Restaurar aparência padrão',
  restoreAppearanceDescription:
    'Redefine cartucho, fonte, fundo e efeitos ao padrão. Datas e personas não mudam.',
  restoreAppearanceTitle: 'Restaurar aparência?',
  restoreAppearanceConfirm: 'Restaurar',
} as const
