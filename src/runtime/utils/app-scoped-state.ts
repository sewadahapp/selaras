import { useNuxtApp } from '#imports'

/** Creates non-serializable state owned by one Vue application instance. */
export function createAppScopedState<T>(create: () => T) {
  const states = new WeakMap<object, T>()

  return function useAppScopedState(owner: object = useNuxtApp().vueApp): T {
    const app = owner
    let state = states.get(app)
    if (!state) {
      state = create()
      states.set(app, state)
    }
    return state
  }
}
