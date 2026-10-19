import type { ReactNode } from 'react'
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
    <div className="grid w-fit grid-cols-[auto_auto] items-center gap-x-6 gap-y-1">
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
  children: ReactNode
}

// Linha de ação: título e descrição à esquerda, controle à direita
export function SettingsAction({
  title,
  description,
  children,
}: SettingsActionProps) {
  return (
    <div className="flex items-center justify-between gap-4 not-first:border-t not-first:border-border not-first:pt-3">
      <div className="flex min-w-0 flex-col">
        <span className="text-sm text-fg">{title}</span>
        {description && <span className="text-caption">{description}</span>}
      </div>
      {children}
    </div>
  )
}
