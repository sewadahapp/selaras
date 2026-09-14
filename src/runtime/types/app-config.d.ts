import type { ThemeConfiguration } from '../theme-config'
import type { IconRegistry } from '../utils/icons'
import type { MessageRegistry } from '../utils/messages'

export interface SelarasRuntimeConfig extends ThemeConfiguration {
  ripple?: boolean
}

// Types app.config.ts's own override surface for the three global
// mechanisms that read from it (useIcons/useMessages/useLocale) - without
// this, `messages`/`icons`/`locale` are untyped `any` in a consumer's own
// app.config.ts, with no autocomplete and no typo detection. Referenced
// into the generated nuxt.d.ts via module.ts's own `prepare:types` hook.
declare module '@nuxt/schema' {
  interface AppConfig {
    selaras?: SelarasRuntimeConfig
    messages?: Partial<MessageRegistry>
    icons?: Partial<IconRegistry>
    locale?: string
  }
}
