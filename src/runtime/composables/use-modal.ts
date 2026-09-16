import type { Component } from 'vue'
import { markRaw } from 'vue'
import { useModalService } from '../internal/programmatic-services'
import { useProgrammaticThemeSnapshot } from '../utils/programmatic-theme'

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
  open: <T = void>(component: Component, options?: UseModalOpenOptions) => Promise<T | undefined>
}

// Explicit return type - without it, TS infers a structural type that
// can't be printed in a declaration file without referencing internal
// Vue/Nuxt types (TS2883), breaking `nuxt-module-build`'s real (non-stub)
// build.
export function useModal(): UseModalReturn {
  const service = useModalService()
  const snapshotTheme = useProgrammaticThemeSnapshot()

  function open<T = void>(component: Component, options?: UseModalOpenOptions): Promise<T | undefined> {
    if (import.meta.server)
      return Promise.reject(new Error('[useModal] open() is client-only. Render SModal declaratively during SSR.'))

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
