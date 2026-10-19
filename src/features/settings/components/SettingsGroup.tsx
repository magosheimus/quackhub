import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'
import { MenuCursor } from '@/components/brand/menu-cursor'
import { SectionTitle } from '@/components/layout/section-title'

type SettingsGroupProps = {
  title: string
  children: ReactNode
}

export function SettingsGroup({ title, children }: SettingsGroupProps) {
  return (
    <div className="flex flex-col gap-3">
      <SectionTitle
        className="normal-case"
        marker={<MenuCursor className="text-accent" />}
      >
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

export function SettingsOption({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <>
      <span className="text-sm text-fg">{label}</span>
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
