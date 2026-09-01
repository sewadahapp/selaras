import type { Component } from 'vue'
import { ref } from 'vue'

export interface ModalInstance {
  id: number
  component: Component
  props: Record<string, unknown>
  isOpen: boolean
  dismissible?: boolean
  modal?: boolean
  overlay?: boolean
  transition?: boolean
  resolve: (value: unknown) => void
}

// Module-level singleton, not useState - a modal opened programmatically
// renders an arbitrary Vue component, which isn't SSR-serializable, so it
// can't live in Nuxt's useState. Opening a modal is realistically always a
// client-side action anyway, so a plain shared client ref is enough.
const modals = ref<ModalInstance[]>([])
let counter = 0

export function useModal() {
  function open<T = void>(component: Component, options?: {
    props?: Record<string, unknown>
    dismissible?: boolean
    modal?: boolean
    overlay?: boolean
    transition?: boolean
  }): Promise<T | undefined> {
    return new Promise((resolve) => {
      modals.value.push({
        id: counter++,
        component,
        props: options?.props ?? {},
        isOpen: true,
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
