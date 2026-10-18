type ShortcutEvent = Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey'>

type EscapeContext = {
  isTyping: boolean
  hasOpenOverlay: boolean
}

export function isSettingsShortcut(event: ShortcutEvent): boolean {
  return event.key === ',' && (event.ctrlKey || event.metaKey)
}

export function isSidebarShortcut(event: ShortcutEvent): boolean {
  return event.key.toLowerCase() === 'b' && (event.ctrlKey || event.metaKey)
}

export function shouldLeaveSettings(
  event: Pick<KeyboardEvent, 'key' | 'defaultPrevented'>,
  { isTyping, hasOpenOverlay }: EscapeContext,
): boolean {
  return (
    event.key === 'Escape' &&
    !event.defaultPrevented &&
    !isTyping &&
    !hasOpenOverlay
  )
}
