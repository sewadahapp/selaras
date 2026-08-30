import type { ComputedRef } from 'vue'
import type { IconRegistry } from '../utils/icons'
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { defaultIcons } from '../utils/icons'

/**
 * Merges a consumer's app.config.icons override onto the default (Hugeicons)
 * registry - mirrors useComponentTheme's app.config.ui.<key> merge (see
 * ../utils/ui.ts), just for icon name strings instead of tv() themes, so a
 * single semantic key (e.g. close) can be overridden once for every
 * component that uses it rather than per component.
 */
export function useIcons(): ComputedRef<IconRegistry> {
  const appConfig = useAppConfig() as { icons?: Partial<IconRegistry> }
  return computed(() => ({ ...defaultIcons, ...appConfig.icons }))
}
