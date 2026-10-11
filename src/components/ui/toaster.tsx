import { useSyncExternalStore } from 'react'
import { IconClose } from '@/shared/lib/icons'
import { dismissToast, getToasts, subscribeToasts } from '@/shared/lib/toast'
import { COMMON_TEXTS } from '@/shared/constants/texts'

export function Toaster() {
  const toasts = useSyncExternalStore(subscribeToasts, getToasts)

  if (toasts.length === 0) {
    return null
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className="flex items-center gap-3 border border-danger bg-surface p-3 text-sm text-fg"
        >
          <span>{toast.message}</span>
          <button
            type="button"
            aria-label={COMMON_TEXTS.close}
            onClick={() => dismissToast(toast.id)}
            className="text-fg-muted"
          >
            <IconClose size={12} />
          </button>
        </div>
      ))}
    </div>
  )
}
