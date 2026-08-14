import { useState } from '#imports'

export interface ToastItem {
  id: number
  title?: string
  description?: string
  duration?: number
}

export function useToast() {
  const toasts = useState<ToastItem[]>('selaras-toasts', () => [])
  const counter = useState('selaras-toast-counter', () => 0)

  function add(toast: Omit<ToastItem, 'id'>) {
    const id = counter.value++
    toasts.value.push({ id, ...toast })
    return id
  }

  function remove(id: number) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1)
      toasts.value.splice(index, 1)
  }

  return { toasts, add, remove }
}
