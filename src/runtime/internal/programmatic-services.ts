import type { Component, Ref } from 'vue'
import type { ToastOptions } from '../composables/use-toast'
import type { ProgrammaticThemeSnapshot } from '../utils/programmatic-theme'
import { ref } from 'vue'
import { createAppScopedState } from '../utils/app-scoped-state'

interface ProgrammaticOverlayInstance {
  id: number
  isOpen: boolean
  _settled: boolean
  resolve: (value: unknown) => void
}

export interface ModalInstance extends ProgrammaticOverlayInstance {
  component: Component
  props: Record<string, unknown>
  title?: string
  description?: string
  dismissible?: boolean
  modal?: boolean
  overlay?: boolean
  transition?: boolean
  _theme: ProgrammaticThemeSnapshot
}

export interface DrawerInstance extends ProgrammaticOverlayInstance {
  component: Component
  props: Record<string, unknown>
  title?: string
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
  _theme: ProgrammaticThemeSnapshot
}

export interface SlideoverInstance extends ProgrammaticOverlayInstance {
  component: Component
  props: Record<string, unknown>
  title?: string
  description?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  inset?: boolean
  dismissible?: boolean
  modal?: boolean
  overlay?: boolean
  transition?: boolean
  _theme: ProgrammaticThemeSnapshot
}

export interface ToastItem extends ToastOptions {
  id: number
  _theme: ProgrammaticThemeSnapshot
}

export interface ProgrammaticOverlayService<T extends ProgrammaticOverlayInstance> {
  instances: Ref<T[]>
  nextId: () => number
  close: (id: number, value?: unknown) => void
  remove: (id: number) => void
  dispose: () => void
}

export interface ToastService {
  toasts: Ref<ToastItem[]>
  nextId: () => number
  remove: (id: number) => void
  dispose: () => void
}

function createOverlayService<T extends ProgrammaticOverlayInstance>(): () => ProgrammaticOverlayService<T> {
  const useState = createAppScopedState(() => ({
    instances: ref<T[]>([]) as Ref<T[]>,
    counter: 0,
  }))

  return function useOverlayService() {
    const state = useState()

    function nextId() {
      return state.counter++
    }

    function close(id: number, value?: unknown) {
      const instance = state.instances.value.find(item => item.id === id)
      if (!instance)
        return
      instance.isOpen = false
      if (!instance._settled) {
        instance._settled = true
        instance.resolve(value)
      }
    }

    function remove(id: number) {
      const index = state.instances.value.findIndex(item => item.id === id)
      if (index !== -1)
        state.instances.value.splice(index, 1)
    }

    function dispose() {
      for (const instance of state.instances.value) {
        if (!instance._settled) {
          instance._settled = true
          instance.resolve(undefined)
        }
      }
      state.instances.value = []
    }

    return { instances: state.instances, nextId, close, remove, dispose }
  }
}

export const useModalService = createOverlayService<ModalInstance>()
export const useDrawerService = createOverlayService<DrawerInstance>()
export const useSlideoverService = createOverlayService<SlideoverInstance>()

const useToastState = createAppScopedState(() => ({
  toasts: ref<ToastItem[]>([]),
  counter: 0,
}))

export function useToastService(): ToastService {
  const state = useToastState()
  return {
    toasts: state.toasts,
    nextId: () => state.counter++,
    remove(id: number) {
      const index = state.toasts.value.findIndex(toast => toast.id === id)
      if (index !== -1)
        state.toasts.value.splice(index, 1)
    },
    dispose() {
      state.toasts.value = []
    },
  }
}
