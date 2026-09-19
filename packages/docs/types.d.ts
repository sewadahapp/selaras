export interface SelarasDocsModuleOptions {
  /**
   * Inject the default unprefixed Tailwind and Selaras stylesheet.
   * Disable this when the consuming app owns a prefixed or complete-theme CSS entry.
   * @default true
   */
  css?: boolean
}

export interface SelarasDocsLink {
  label?: string
  to: string
  icon?: string
  target?: string
  ariaLabel?: string
}

export interface SelarasDocsLogo {
  light?: string
  dark?: string
  alt?: string
}

export interface SelarasDocsAppConfig {
  site?: {
    name?: string
    description?: string
    logo?: string | SelarasDocsLogo
  }
  repository?: {
    url?: string
    branch?: string
    contentDirectory?: string
    editLinks?: boolean
  }
  header?: {
    title?: string
    showTitle?: boolean
    search?: boolean
    colorMode?: boolean
    links?: SelarasDocsLink[]
  }
  toc?: {
    enabled?: boolean
    title?: string
  }
  footer?: {
    text?: string
    links?: SelarasDocsLink[]
  }
}

declare module '@nuxt/schema' {
  interface AppConfig {
    selarasDocs?: SelarasDocsAppConfig
  }

  interface NuxtConfig {
    selarasDocs?: SelarasDocsModuleOptions
  }

  interface NuxtOptions {
    selarasDocs: SelarasDocsModuleOptions
  }
}

declare module 'nuxt/schema' {
  interface AppConfig {
    selarasDocs?: SelarasDocsAppConfig
  }

  interface NuxtConfig {
    selarasDocs?: SelarasDocsModuleOptions
  }

  interface NuxtOptions {
    selarasDocs: SelarasDocsModuleOptions
  }
}
