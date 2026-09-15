import type { ColorRole } from '../utils/color-registry'
import { hasInjectionContext } from 'vue'
import { useState } from '#imports'
import { useThemeScope } from '../utils/ui'

export interface ToastOptions {
  title?: string
  description?: string
  duration?: number
  /** Tints the icon and left-edge accent with any registered semantic role. Built-in feedback intents also select a default icon. */
  color?: ColorRole
  /** Overrides the color's own default icon (or shows an icon with no color set at all). */
  icon?: string
}

export interface ToastItem extends ToastOptions {
  id: number
  /** Opaque STheme marker captured where useToast() was created. @internal */
  _themeScope?: string
}

export function useToast() {
  const toasts = useState<ToastItem[]>('selaras-toasts', () => [])
  const counter = useState('selaras-toast-counter', () => 0)
  const themeScope = hasInjectionContext() ? useThemeScope() : undefined

  function add(toast: ToastOptions) {
    const id = counter.value++
    toasts.value.push({ ...toast, id, _themeScope: themeScope?.value })
    return id
  }

  function remove(id: number) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1)
      toasts.value.splice(index, 1)
  }

  return { toasts, add, remove }
}
