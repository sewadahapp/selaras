import type { Component } from 'vue'
import { markRaw } from 'vue'
import { useDrawerService } from '../internal/programmatic-services'
import { useProgrammaticThemeSnapshot } from '../utils/programmatic-theme'

export interface UseDrawerOpenOptions {
  props?: Record<string, unknown>
  /** Registered with Reka as the drawer's accessible name, visually hidden - the opened component still supplies its own visible header via the content slot. */
  title?: string
  /** Registered with Reka as the drawer's accessible description, visually hidden. */
  description?: string
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
  open: <T = void>(component: Component, options?: UseDrawerOpenOptions) => Promise<T | undefined>
}

// Explicit return type - see use-modal.ts's useModal() for why (TS2883,
// breaks the real non-stub build without it).
export function useDrawer(): UseDrawerReturn {
  const service = useDrawerService()
  const snapshotTheme = useProgrammaticThemeSnapshot()

  function open<T = void>(component: Component, options?: UseDrawerOpenOptions): Promise<T | undefined> {
    if (import.meta.server)
      return Promise.reject(new Error('[useDrawer] open() is client-only. Render SDrawer declaratively during SSR.'))

    return new Promise((resolve) => {
      service.instances.value.push({
        id: service.nextId(),
        // Vue components are meant to stay an opaque, non-reactive value -
        // without this, pushing one into this reactive array wraps it in
        // a reactive proxy too, which Vue's own dev warning flags as
        // wasted overhead for no benefit.
        component: markRaw(component),
        props: options?.props ?? {},
        isOpen: true,
        _settled: false,
        title: options?.title,
        description: options?.description,
        side: options?.side,
        handle: options?.handle,
        snapPoints: options?.snapPoints,
        snapPoint: options?.snapPoint,
        snapToSequentialPoints: options?.snapToSequentialPoints,
        dismissible: options?.dismissible,
        modal: options?.modal,
        overlay: options?.overlay,
        transition: options?.transition,
        _theme: snapshotTheme(),
        resolve: resolve as (value: unknown) => void,
      })
    })
  }

  return { open }
}
