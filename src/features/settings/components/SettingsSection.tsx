import type { ReactNode } from 'react'
import { Panel } from '@/components/ui/panel'

type SettingsSectionProps = {
  title?: string
  children: ReactNode
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <Panel className="flex flex-col gap-4 p-5">
      {title && (
        <span className="text-xs font-medium uppercase tracking-wide text-fg">
          {title}
        </span>
      )}
      {children}
    </Panel>
  )
}
