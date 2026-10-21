import type { ReactNode } from 'react'
import { Panel } from '@/components/layout/panel'

export function SettingsSection({ children }: { children: ReactNode }) {
  return <Panel className="flex flex-col gap-8 p-5">{children}</Panel>
}
