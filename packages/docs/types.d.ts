export interface SelarasDocsModuleOptions {
  /**
   * Inject the default unprefixed Tailwind and Selaras stylesheet.
   * Disable this when the consuming app owns a prefixed or complete-theme CSS entry.
   * @default true
   */
  css?: boolean
}

declare module '@nuxt/schema' {
  interface NuxtConfig {
    selarasDocs?: SelarasDocsModuleOptions
  }

  interface NuxtOptions {
    selarasDocs: SelarasDocsModuleOptions
  }
}

declare module 'nuxt/schema' {
  interface NuxtConfig {
    selarasDocs?: SelarasDocsModuleOptions
  }

  interface NuxtOptions {
    selarasDocs: SelarasDocsModuleOptions
  }
}
