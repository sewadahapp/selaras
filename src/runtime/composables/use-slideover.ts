import type { Component, Ref } from 'vue'
import { ref } from 'vue'

export interface SlideoverInstance {
  id: number
  component: Component
  props: Record<string, unknown>
  isOpen: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
  inset?: boolean
  dismissible?: boolean
  modal?: boolean
  overlay?: boolean
  transition?: boolean
  resolve: (value: unknown) => void
}

export interface UseSlideoverOpenOptions {
  props?: Record<string, unknown>
  side?: 'top' | 'right' | 'bottom' | 'left'
  inset?: boolean
  dismissible?: boolean
  modal?: boolean
  overlay?: boolean
  transition?: boolean
}

export interface UseSlideoverReturn {
  slideovers: Ref<SlideoverInstance[]>
  open: <T = void>(component: Component, options?: UseSlideoverOpenOptions) => Promise<T | undefined>
  close: (id: number, value?: unknown) => void
  remove: (id: number) => void
}

// Module-level singleton, not useState - see use-modal.ts for why
// (components aren't SSR-serializable, and this is a client-only action).
const slideovers = ref<SlideoverInstance[]>([])
let counter = 0

// Explicit return type - see use-modal.ts's useModal() for why (TS2883,
// breaks the real non-stub build without it).
export function useSlideover(): UseSlideoverReturn {
  function open<T = void>(component: Component, options?: UseSlideoverOpenOptions): Promise<T | undefined> {
    return new Promise((resolve) => {
      slideovers.value.push({
        id: counter++,
        component,
        props: options?.props ?? {},
        isOpen: true,
        side: options?.side,
        inset: options?.inset,
        dismissible: options?.dismissible,
        modal: options?.modal,
        overlay: options?.overlay,
        transition: options?.transition,
        resolve: resolve as (value: unknown) => void,
      })
    })
  }

  // Only flips `isOpen` and resolves the caller's promise - the instance
  // stays in `slideovers` so Slideover's own exit animation can still
  // play. See `remove` below for the actual cleanup.
  function close(id: number, value?: unknown) {
    const instance = slideovers.value.find(s => s.id === id)
    if (!instance)
      return
    instance.isOpen = false
    instance.resolve(value)
  }

  // Called once Slideover reports its close animation has finished (or
  // immediately, if transition is off) - actually removes the instance.
  function remove(id: number) {
    const index = slideovers.value.findIndex(s => s.id === id)
    if (index !== -1)
      slideovers.value.splice(index, 1)
  }

  return { slideovers, open, close, remove }
}
