import type { ReactNode } from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'

type DrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  label: string
  children: ReactNode
}

export function Drawer({ open, onOpenChange, label, children }: DrawerProps) {
  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(nextOpen) => onOpenChange(nextOpen)}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-(--overlay) duration-150 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup
          aria-label={label}
          className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] border-r-2 border-border-strong shadow-[4px_0_0_0_var(--border-strong)] outline-none duration-150 data-open:animate-in data-open:slide-in-from-left data-closed:animate-out data-closed:slide-out-to-left"
        >
          {children}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
