import type { ColorRole } from '../utils/color-registry'
import { useToastService } from '../internal/programmatic-services'
import { useProgrammaticThemeSnapshot } from '../utils/programmatic-theme'

export interface ToastOptions {
  title?: string
  description?: string
  duration?: number
  /** Tints the icon and left-edge accent with any registered semantic role. Built-in feedback intents also select a default icon. */
  color?: ColorRole
  /** Overrides the color's own default icon (or shows an icon with no color set at all). */
  icon?: string
}

export interface UseToastReturn {
  add: (toast: ToastOptions) => number
  remove: (id: number) => void
}

export function useToast(): UseToastReturn {
  const service = useToastService()
  const snapshotTheme = useProgrammaticThemeSnapshot()

  function add(toast: ToastOptions) {
    if (import.meta.server)
      throw new Error('[useToast] add() is client-only. Render server-visible status content declaratively.')
    const id = service.nextId()
    service.toasts.value.push({ ...toast, id, _theme: snapshotTheme() })
    return id
  }

  return { add, remove: service.remove }
}
