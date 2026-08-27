import type { ComputedRef } from 'vue'
import type { MessageRegistry } from '../utils/messages'
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { defaultMessages } from '../utils/messages'

/**
 * Merges a consumer's app.config.messages override onto the default
 * (English) registry - mirrors useIcons' own app.config.icons merge (see
 * use-icons.ts), just for UI copy instead of icon names. This is where a
 * consuming app wires up real translation: override every key with
 * locale-aware text (or functions, for the interpolated ones), typically
 * computed from whatever i18n library the app itself already uses -
 * this library doesn't ship one itself, just the override surface.
 */
export function useMessages(): ComputedRef<MessageRegistry> {
  const appConfig = useAppConfig() as { messages?: Partial<MessageRegistry> }
  return computed(() => ({ ...defaultMessages, ...appConfig.messages }))
}
