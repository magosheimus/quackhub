import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'
import { MenuCursor } from '@/components/brand/menu-cursor'
import { SectionTitle } from '@/components/layout/section-title'
import { HintTooltip } from '@/components/feedback/hint-tooltip'
import { IconTablet } from '@/shared/lib/icons'

type SettingsGroupProps = {
  title: string
  children: ReactNode
}

export function SettingsGroup({ title, children }: SettingsGroupProps) {
  return (
    <div className="flex flex-col gap-3">
      <SectionTitle marker={<MenuCursor className="text-accent" />}>
        {title}
      </SectionTitle>
      {children}
    </div>
  )
}

// Linhas "nome  ‹ valor ›" alinhadas em duas colunas
export function SettingsOptionList({ children }: { children: ReactNode }) {
  return (
    <div className="grid w-fit grid-cols-[11rem_auto] items-center gap-x-6 gap-y-1">
      {children}
    </div>
  )
}

// hint: preferência com regra própria (ex.: salva só no aparelho), explicada
// no tooltip do ícone ao lado do nome
export function SettingsOption({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <>
      <span className="flex items-center gap-2 text-sm text-fg">
        {label}
        {hint && (
          <HintTooltip text={hint}>
            <IconTablet size={16} aria-label={hint} className="text-fg-muted" />
          </HintTooltip>
        )}
      </span>
      {children}
    </>
  )
}

type SettingsActionProps = {
  title: string
  description?: string
  tone?: 'default' | 'danger'
  children: ReactNode
}

// Linha de ação: título e descrição à esquerda, controle à direita
const ACTION_TEXT_CLASS = {
  default: { title: 'text-fg', description: 'text-caption' },
  danger: { title: 'text-on-accent', description: 'text-xs text-on-accent/85' },
}

export function SettingsAction({
  title,
  description,
  tone = 'default',
  children,
}: SettingsActionProps) {
  const textClass = ACTION_TEXT_CLASS[tone]
  return (
    <div className="flex items-center justify-between gap-4 not-first:border-t not-first:border-border not-first:pt-3">
      <div className="flex min-w-0 flex-col">
        <span className={cn('text-sm', textClass.title)}>{title}</span>
        {description && (
          <span className={textClass.description}>{description}</span>
        )}
      </div>
      {children}
    </div>
  )
}
