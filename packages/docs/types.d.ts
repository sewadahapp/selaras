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
  rel?: string
  ariaLabel?: string
}

/** A top-level header item rendered by Selaras' NavigationMenu. */
export interface SelarasDocsNavigationItem {
  /** Required so every header control has an accessible name. */
  label: string
  to?: string
  icon?: string
  target?: string
  rel?: string
  ariaLabel?: string
  disabled?: boolean
  children?: SelarasDocsNavigationItem[]
}

export interface SelarasDocsLogo {
  light?: string
  dark?: string
  alt?: string
  /** Tint a monochrome SVG with the active primary theme color. */
  tint?: boolean
}

export interface SelarasDocsAppConfig {
  site?: {
    name?: string
    description?: string
    /** Applied to browser titles; `%s` is replaced with the current page title. */
    titleTemplate?: string
    url?: string
    /** Shown in the header and footer. A `/`-rooted path is served from `public/` under the app's base URL. */
    logo?: string | SelarasDocsLogo
    /** The browser tab icon, e.g. `/favicon.svg`, resolved like `logo`. */
    favicon?: string
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
    /** Show the consuming site's visual preset picker. @default false */
    themePicker?: boolean
    /** Let the header span the viewport instead of the docs shell width. */
    fluid?: boolean
    links?: SelarasDocsNavigationItem[]
  }
  main?: {
    /** Let the content area use the available width. @default false */
    fluid?: boolean
    /** Remove the default content inset. @default false */
    padded?: boolean
  }
  sidebar?: {
    /** Hide the desktop sidebar and its mobile navigation control. @default true */
    enabled?: boolean
    /** Start folder groups collapsed. Folder `.navigation.yml` can override this. @default false */
    collapsed?: boolean
    /** Exact page paths to omit from the sidebar. */
    exclude?: string[]
  }
  toc?: {
    enabled?: boolean
    title?: string
  }
  footer?: {
    text?: string
    links?: SelarasDocsLink[]
    /** Let the footer span the viewport instead of the docs shell width. */
    fluid?: boolean
  }
}

/** Metadata accepted in a content page's `.navigation.yml` folder config. */
export interface SelarasDocsContentNavigationItem {
  title?: string
  icon?: string | false
  order?: number
  collapse?: boolean
  navBadges?: Array<string | { text: string }>
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

/** A viewport offered by DocsViewportPreview. Width is measured in CSS pixels. */
export interface SelarasDocsViewportDevice {
  value: string
  label: string
  width: number
  icon?: string
}
