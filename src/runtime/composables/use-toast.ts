import { useState } from '#imports'

export interface ToastItem {
  id: number
  title?: string
  description?: string
  duration?: number
  /** Status - tints the icon and adds a matching left-edge accent. Scoped to just these four (not the full color palette Button/Badge/Chip expose) since a toast's color only ever means "what kind of status is this." */
  color?: 'success' | 'danger' | 'warning' | 'info'
  /** Overrides the color's own default icon (or shows an icon with no color set at all). */
  icon?: string
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
