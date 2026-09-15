import type { Component, Ref } from 'vue'
import type { ProgrammaticThemeSnapshot } from '../utils/programmatic-theme'
import { markRaw, ref } from 'vue'
import { createAppScopedState } from '../utils/app-scoped-state'
import { useProgrammaticThemeSnapshot } from '../utils/programmatic-theme'

export interface SlideoverInstance {
  id: number
  component: Component
  props: Record<string, unknown>
  isOpen: boolean
  title?: string
  description?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  inset?: boolean
  dismissible?: boolean
  modal?: boolean
  overlay?: boolean
  transition?: boolean
  /** @internal */
  _theme: ProgrammaticThemeSnapshot
  resolve: (value: unknown) => void
}

export interface UseSlideoverOpenOptions {
  props?: Record<string, unknown>
  /** Registered with Reka as the panel's accessible name, visually hidden - the opened component still supplies its own visible header via the content slot. */
  title?: string
  /** Registered with Reka as the panel's accessible description, visually hidden. */
  description?: string
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

const useSlideoverState = createAppScopedState(() => ({
  slideovers: ref<SlideoverInstance[]>([]),
  counter: 0,
}))

// Explicit return type - see use-modal.ts's useModal() for why (TS2883,
// breaks the real non-stub build without it).
export function useSlideover(): UseSlideoverReturn {
  const state = useSlideoverState()
  const { slideovers } = state
  const snapshotTheme = useProgrammaticThemeSnapshot()

  function open<T = void>(component: Component, options?: UseSlideoverOpenOptions): Promise<T | undefined> {
    if (import.meta.server)
      return Promise.reject(new Error('[useSlideover] open() is client-only. Render SSlideover declaratively during SSR.'))

    return new Promise((resolve) => {
      slideovers.value.push({
        id: state.counter++,
        // Vue components are meant to stay an opaque, non-reactive value -
        // without this, pushing one into this reactive array wraps it in
        // a reactive proxy too, which Vue's own dev warning flags as
        // wasted overhead for no benefit.
        component: markRaw(component),
        props: options?.props ?? {},
        isOpen: true,
        title: options?.title,
        description: options?.description,
        side: options?.side,
        inset: options?.inset,
        dismissible: options?.dismissible,
        modal: options?.modal,
        overlay: options?.overlay,
        transition: options?.transition,
        _theme: snapshotTheme(),
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
