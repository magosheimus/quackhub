import { useEffect, useRef, useState } from 'react'
import { IconChevronLeft, IconChevronRight } from '@/lib/icons'
import {
  applySettings,
  loadSettings,
  saveSettings,
  type Settings,
} from '@/lib/settings'

type CartuchoValue = Settings['cartucho']

const CARTUCHO_OPTIONS: { value: CartuchoValue; label: string }[] = [
  { value: 'sage', label: 'Sage' },
  { value: 'amber', label: 'Amber' },
  { value: 'slate', label: 'Slate' },
  { value: 'earth', label: 'Earth' },
  { value: 'sage-dark', label: 'Sage Dark' },
  { value: 'amber-dark', label: 'Amber Dark' },
]

export function CartuchoPicker() {
  const [cartucho, setCartucho] = useState<CartuchoValue>(
    () => loadSettings().cartucho,
  )
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

  function handleSelect(value: CartuchoValue) {
    const next = saveSettings({ cartucho: value })
    setCartucho(next.cartucho)
    applySettings(next)
  }

  return (
    <div ref={containerRef} className="flex h-24 items-center gap-2">
      {isOpen && (
        <div className="flex gap-2 rounded-md border-2 border-border-strong bg-(--bg-surface) p-2 shadow-[3px_3px_0_0_var(--border-strong)] motion-safe:animate-[cartucho-deck-in_200ms_ease-out]">
          {CARTUCHO_OPTIONS.map((option) => {
            const isActive = option.value === cartucho
            return (
              <button
                key={option.value}
                type="button"
                title={option.label}
                aria-label={`Cartucho ${option.label}`}
                aria-pressed={isActive}
                onClick={() => handleSelect(option.value)}
                className="rounded-sm p-0.5"
              >
                <div
                  className={`cartucho-${option.value} flex h-20 w-14 flex-col justify-between rounded-sm border-2 border-(--lcd-ink) bg-(--lcd-screen) p-1 shadow-[2px_2px_0_0_var(--lcd-ink)] motion-safe:transition-transform motion-safe:hover:-translate-y-1 ${
                    isActive
                      ? 'outline-2 outline-offset-2 outline-(--text-primary) motion-safe:animate-[cartucho-pulse_2s_ease-in-out_infinite]'
                      : ''
                  }`}
                >
                  <span className="mx-auto h-1 w-6 rounded-full bg-(--lcd-ink)/30" />
                  <span className="text-left text-[10px] leading-tight text-(--lcd-ink)">
                    {option.label}
                  </span>
                  <span className="h-1 w-full bg-accent" />
                </div>
              </button>
            )
          })}
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Fechar cartuchos' : 'Abrir cartuchos'}
        className="flex size-8 items-center justify-center rounded-md border-2 border-border-strong bg-(--bg-surface) shadow-[2px_2px_0_0_var(--border-strong)] motion-safe:transition-transform motion-safe:hover:-translate-x-0.5"
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
