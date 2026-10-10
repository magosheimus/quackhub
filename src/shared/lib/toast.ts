export type Toast = { id: number; message: string }

const TOAST_DURATION_MS = 5000

let toasts: Toast[] = []
let nextId = 0
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

export function subscribeToasts(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getToasts() {
  return toasts
}

export function dismissToast(id: number) {
  toasts = toasts.filter((toast) => toast.id !== id)
  emit()
}

export function showErrorToast(message: string) {
  const id = nextId++
  toasts = [...toasts, { id, message }]
  emit()
  window.setTimeout(() => dismissToast(id), TOAST_DURATION_MS)
}
