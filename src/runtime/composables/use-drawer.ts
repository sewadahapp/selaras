import type { Component, Ref } from 'vue'
import { ref } from 'vue'

export interface DrawerInstance {
  id: number
  component: Component
  props: Record<string, unknown>
  isOpen: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
  handle?: boolean
  snapPoints?: (number | string)[]
  snapPoint?: number | string | null
  snapToSequentialPoints?: boolean
  dismissible?: boolean
  modal?: boolean | 'trap-focus'
  overlay?: boolean
  transition?: boolean
  resolve: (value: unknown) => void
}

export interface UseDrawerOpenOptions {
  props?: Record<string, unknown>
  side?: 'top' | 'right' | 'bottom' | 'left'
  handle?: boolean
  snapPoints?: (number | string)[]
  snapPoint?: number | string | null
  snapToSequentialPoints?: boolean
  dismissible?: boolean
  modal?: boolean | 'trap-focus'
  overlay?: boolean
  transition?: boolean
}

export interface UseDrawerReturn {
  drawers: Ref<DrawerInstance[]>
  open: <T = void>(component: Component, options?: UseDrawerOpenOptions) => Promise<T | undefined>
  close: (id: number, value?: unknown) => void
  remove: (id: number) => void
}

// Module-level singleton, not useState - see use-modal.ts for why
// (components aren't SSR-serializable, and this is a client-only action).
const drawers = ref<DrawerInstance[]>([])
let counter = 0

// Explicit return type - see use-modal.ts's useModal() for why (TS2883,
// breaks the real non-stub build without it).
export function useDrawer(): UseDrawerReturn {
  function open<T = void>(component: Component, options?: UseDrawerOpenOptions): Promise<T | undefined> {
    return new Promise((resolve) => {
      drawers.value.push({
        id: counter++,
        component,
        props: options?.props ?? {},
        isOpen: true,
        side: options?.side,
        handle: options?.handle,
        snapPoints: options?.snapPoints,
        snapPoint: options?.snapPoint,
        snapToSequentialPoints: options?.snapToSequentialPoints,
        dismissible: options?.dismissible,
        modal: options?.modal,
        overlay: options?.overlay,
        transition: options?.transition,
        resolve: resolve as (value: unknown) => void,
      })
    })
  }

  // Only flips `isOpen` and resolves the caller's promise - the instance
  // stays in `drawers` so Drawer's own exit animation can still play. See
  // `remove` below for the actual cleanup.
  function close(id: number, value?: unknown) {
    const instance = drawers.value.find(d => d.id === id)
    if (!instance)
      return
    instance.isOpen = false
    instance.resolve(value)
  }

  // Called once Drawer reports its close animation has finished (or
  // immediately, if transition is off) - actually removes the instance.
  function remove(id: number) {
    const index = drawers.value.findIndex(d => d.id === id)
    if (index !== -1)
      drawers.value.splice(index, 1)
  }

  return { drawers, open, close, remove }
}
