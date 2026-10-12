import { useEffect, useRef, useState } from 'react'
import { IconChevronLeft, IconChevronRight } from '@/shared/lib/icons'
import { useSettings } from '@/features/settings/hooks/useSettings'
import { SETTINGS_TEXTS } from '@/features/settings/constants/texts'
import { CartuchoOptions } from '@/features/settings/components/CartuchoOptions'

export function CartuchoPicker() {
  const { settings, updateSettings } = useSettings()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    function handlePointerDown(event: PointerEvent) {
      const container = containerRef.current
      if (
        container &&
        event.target instanceof Node &&
        container.contains(event.target)
      ) {
        return
      }
      setIsOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [isOpen])

  return (
    <div ref={containerRef} className="flex h-24 items-center gap-2">
      {isOpen && (
        <CartuchoOptions
          selected={settings.cartucho}
          onSelect={(cartucho) => updateSettings({ cartucho })}
          className="rounded-md border-2 border-border-strong bg-surface p-2 shadow-[3px_3px_0_0_var(--border-strong)] motion-safe:animate-[cartucho-deck-in_200ms_ease-out]"
        />
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label={
          isOpen ? SETTINGS_TEXTS.closeCartuchos : SETTINGS_TEXTS.openCartuchos
        }
        className="flex size-8 items-center justify-center rounded-md border-2 border-border-strong bg-surface shadow-[2px_2px_0_0_var(--border-strong)] motion-safe:transition-transform motion-safe:hover:-translate-x-0.5"
      >
        {isOpen ? (
          <IconChevronRight size={16} aria-hidden="true" />
        ) : (
          <IconChevronLeft size={16} aria-hidden="true" />
        )}
      </button>
    </div>
  )
}
