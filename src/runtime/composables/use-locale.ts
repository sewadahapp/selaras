import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import { useAppConfig } from '#imports'

/**
 * The app-wide default BCP-47 locale code, overridable via
 * `app.config.locale` - mirrors useIcons()/useMessages()'s own
 * app.config.<key> merge (see use-icons.ts), just for a single string
 * instead of a registry. DatePicker/InputNumber/TimeStepper each read
 * this as their own `locale` prop's fallback instead of hardcoding
 * 'en-US' independently, so a consumer sets the locale once instead of
 * repeating it on every instance - an explicit per-instance `locale`
 * prop still overrides this.
 */
export function useLocale(): ComputedRef<string> {
  const appConfig = useAppConfig() as { locale?: string }
  return computed(() => appConfig.locale ?? 'en-US')
}
