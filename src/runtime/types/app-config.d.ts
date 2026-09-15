import type { ThemeConfiguration } from '../theme-config'
import type { IconRegistry } from '../utils/icons'
import type { MessageRegistry } from '../utils/messages'

export interface SelarasRuntimeConfig extends ThemeConfiguration {
  icons?: Partial<IconRegistry>
  locale?: string
  messages?: Partial<MessageRegistry>
  ripple?: boolean
}

// Keep every Selaras-owned runtime setting under one collision-resistant
// namespace. Referenced into generated nuxt.d.ts by module.ts.
declare module '@nuxt/schema' {
  interface AppConfig {
    selaras?: SelarasRuntimeConfig
  }
}
