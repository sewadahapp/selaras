import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import { useAppConfig } from '#imports'

/**
 * Whether v-ripple should actually spawn a ripple - mirrors useIcons' own
 * app.config merge (see use-icons.ts), just a single top-level boolean
 * instead of a registry object. Defaults to enabled; app.config.ripple =
 * false turns it off globally for every component that binds v-ripple to
 * this rather than hardcoding it unconditionally on.
 *
 * Deliberately not read inside the directive itself (directives/ripple.ts)
 * - useAppConfig() is a Nuxt composable meant to run in a component's own
 * setup context, not a directive lifecycle hook, so each consuming
 * component reads this itself and passes the result as v-ripple's binding
 * value (`v-ripple="rippleEnabled"`) instead.
 */
export function useRippleEnabled(): ComputedRef<boolean> {
  const appConfig = useAppConfig() as { ripple?: boolean }
  return computed(() => appConfig.ripple ?? true)
}
