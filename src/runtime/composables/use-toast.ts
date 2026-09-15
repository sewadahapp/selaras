import type { Ref } from 'vue'
import type { ColorRole } from '../utils/color-registry'
import type { ProgrammaticThemeSnapshot } from '../utils/programmatic-theme'
import { ref } from 'vue'
import { createAppScopedState } from '../utils/app-scoped-state'
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

export interface ToastItem extends ToastOptions {
  id: number
  /** @internal */
  _theme: ProgrammaticThemeSnapshot
}

export interface UseToastReturn {
  toasts: Ref<ToastItem[]>
  add: (toast: ToastOptions) => number
  remove: (id: number) => void
}

const useToastState = createAppScopedState(() => ({
  toasts: ref<ToastItem[]>([]),
  counter: 0,
}))

export function useToast(): UseToastReturn {
  const state = useToastState()
  const { toasts } = state
  const snapshotTheme = useProgrammaticThemeSnapshot()

  function add(toast: ToastOptions) {
    if (import.meta.server)
      throw new Error('[useToast] add() is client-only. Render server-visible status content declaratively.')
    const id = state.counter++
    toasts.value.push({ ...toast, id, _theme: snapshotTheme() })
    return id
  }

  function remove(id: number) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1)
      toasts.value.splice(index, 1)
  }

  return { toasts, add, remove }
}
