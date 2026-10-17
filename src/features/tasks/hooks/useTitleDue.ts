import { useState } from 'react'
import { useSettings } from '@/features/settings/hooks/useSettings'
import { todayLocal } from '@/shared/lib/date'
import {
  findDueToken,
  formatDue,
  removeDueToken,
} from '@/features/tasks/lib/due'
import { DUE_LABELS, TASKS_TEXTS } from '@/features/tasks/constants/texts'

// Lê um "@amanhã 14h" no título; "Desfazer" mantém o trecho como texto
export function useTitleDue(title: string, enabled: boolean) {
  const { settings } = useSettings()
  const [keptText, setKeptText] = useState<string | null>(null)
  if (keptText && !title.includes(keptText)) {
    setKeptText(null)
  }
  const today = todayLocal()
  const found = enabled
    ? findDueToken(title, new Date(), settings.weekStartsOn)
    : null
  const token = found && found.text !== keptText ? found : null

  return {
    token,
    cleanTitle: token ? removeDueToken(title, token) : title.trim(),
    hint: token
      ? TASKS_TEXTS.dueFromTitle(
          token.dueDate
            ? formatDue(token.dueDate, token.dueTime, today, DUE_LABELS).text
            : TASKS_TEXTS.noDue,
        )
      : null,
    keepInTitle: () => setKeptText(token?.text ?? null),
  }
}
