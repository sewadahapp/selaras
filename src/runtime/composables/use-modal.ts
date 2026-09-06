import type { Component, Ref } from 'vue'
import { markRaw, ref } from 'vue'

export interface ModalInstance {
  id: number
  component: Component
  props: Record<string, unknown>
  isOpen: boolean
  title?: string
  description?: string
  dismissible?: boolean
  modal?: boolean
  overlay?: boolean
  transition?: boolean
  resolve: (value: unknown) => void
}

export interface UseModalOpenOptions {
  props?: Record<string, unknown>
  /** Registered with Reka as the dialog's accessible name, visually hidden - the opened component still supplies its own visible header via the content slot. */
  title?: string
  /** Registered with Reka as the dialog's accessible description, visually hidden. */
  description?: string
  dismissible?: boolean
  modal?: boolean
  overlay?: boolean
  transition?: boolean
}

export interface UseModalReturn {
  modals: Ref<ModalInstance[]>
  open: <T = void>(component: Component, options?: UseModalOpenOptions) => Promise<T | undefined>
  close: (id: number, value?: unknown) => void
  remove: (id: number) => void
}

// Module-level singleton, not useState - a modal opened programmatically
// renders an arbitrary Vue component, which isn't SSR-serializable, so it
// can't live in Nuxt's useState. Opening a modal is realistically always a
// client-side action anyway, so a plain shared client ref is enough.
const modals = ref<ModalInstance[]>([])
let counter = 0

// Explicit return type - without it, TS infers a structural type that
// can't be printed in a declaration file without referencing internal
// Vue/Nuxt types (TS2883), breaking `nuxt-module-build`'s real (non-stub)
// build.
export function useModal(): UseModalReturn {
  function open<T = void>(component: Component, options?: UseModalOpenOptions): Promise<T | undefined> {
    return new Promise((resolve) => {
      modals.value.push({
        id: counter++,
        // Vue components are meant to stay an opaque, non-reactive value -
        // without this, pushing one into this reactive array wraps it in
        // a reactive proxy too, which Vue's own dev warning flags as
        // wasted overhead for no benefit.
        component: markRaw(component),
        props: options?.props ?? {},
        isOpen: true,
        title: options?.title,
        description: options?.description,
        dismissible: options?.dismissible,
        modal: options?.modal,
        overlay: options?.overlay,
        transition: options?.transition,
        resolve: resolve as (value: unknown) => void,
      })
    })
  }

  // Only flips `isOpen` and resolves the caller's promise - the instance
  // stays in `modals` so Modal's own exit animation can still play. See
  // `remove` below for the actual cleanup.
  function close(id: number, value?: unknown) {
    const instance = modals.value.find(m => m.id === id)
    if (!instance)
      return
    instance.isOpen = false
    instance.resolve(value)
  }

  // Called once Modal reports its close animation has finished (or
  // immediately, if transition is off) - actually removes the instance.
  function remove(id: number) {
    const index = modals.value.findIndex(m => m.id === id)
    if (index !== -1)
      modals.value.splice(index, 1)
  }

  return { modals, open, close, remove }
}
