import { useSyncExternalStore } from 'react'
import { X } from 'lucide-react'
import { dismissToast, getToasts, subscribeToasts } from '@/lib/toast'

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
          className="flex items-center gap-3 border border-(--signal-danger) bg-(--bg-surface) p-3 text-sm text-(--text-primary)"
        >
          <span>{toast.message}</span>
          <button
            type="button"
            aria-label="Fechar"
            onClick={() => dismissToast(toast.id)}
            className="text-(--text-muted)"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
