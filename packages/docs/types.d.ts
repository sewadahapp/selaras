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
  /** Per-locale labels for links in the consuming site's navigation. */
  labels?: Record<string, string>
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
  /** Per-locale labels for links in the consuming site's navigation. */
  labels?: Record<string, string>
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

export type SelarasDocsErrorKind = 'notFound' | 'fatal' | 'page' | 'example'

export interface SelarasDocsErrorCopy {
  title?: string
  description?: string
}

/** A locale offered by the docs language switcher. */
export interface SelarasDocsLocaleOption {
  code: string
  /** Label shown in the switcher, written in the locale's own language. */
  name: string
  /** BCP-47 tag used for `html lang` and locale-aware components, e.g. `en-GB`. */
  language?: string
}

export interface SelarasDocsI18n {
  /** Locale served without URL changes and used for content at the content root. @default 'en' */
  defaultLocale?: string
  /** Locales available in the language switcher. @default [{ code: 'en', name: 'English', language: 'en-GB' }] */
  locales?: SelarasDocsLocaleOption[]
}

/**
 * UI copy shipped by the docs layer. Override a locale's copy through
 * `app.config.selarasDocs.messages[locale]` when a site needs different wording.
 */
export interface SelarasDocsMessages {
  skipToContent?: string
  documentationNavigation?: string
  pageActions?: string
  reportIssue?: string
  editPage?: string
  footerNavigation?: string
  sourceRepository?: string
  openNavigation?: string
  mainNavigation?: string
  previewViewport?: string
  tableOfContents?: string
  searchDocumentation?: string
  /** Accessible name for the language switcher; `{language}` is replaced. */
  languageSwitcher?: string
  documentationUnavailable?: string
  untranslatedNotice?: string
  emptyTitle?: string
  emptyDescription?: string
  notFoundTitle?: string
  notFoundDescription?: string
  fatalTitle?: string
  fatalDescription?: string
  pageTitle?: string
  pageDescription?: string
  exampleTitle?: string
  exampleDescription?: string
  retry?: string
  retrying?: string
  reload?: string
  backToDocumentation?: string
  home?: string
}

export interface SelarasDocsAppConfig {
  /** Locales, the default locale, and language-switcher options. */
  i18n?: SelarasDocsI18n
  /** Per-locale overrides for the UI copy shipped by the docs layer. */
  messages?: Partial<Record<string, SelarasDocsMessages>>
  /** Copy shown for an existing Markdown page with no body content. */
  empty?: {
    title?: string
    description?: string
  }
  /** Recovery messages and the destination of error-screen home links. */
  errors?: Partial<Record<SelarasDocsErrorKind, SelarasDocsErrorCopy>> & {
    /** An internal route, resolved under the application's base URL. @default '/' */
    homeTo?: string
    homeLabel?: string
    retryLabel?: string
    reloadLabel?: string
    retryingLabel?: string
  }
  site?: {
    name?: string
    description?: string
    /** Applied to browser titles; `%s` is replaced with the current page title. */
    titleTemplate?: string
    /** Public site origin for canonical and Open Graph URLs. These URL tags are omitted when unset. */
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
    /** Show a page-context issue link. @default true */
    issueLinks?: boolean
    /** Override the new-issue destination, e.g. for a separate issue tracker. */
    issueUrl?: string
  }
  header?: {
    title?: string
    showTitle?: boolean
    search?: boolean
    colorMode?: boolean
    /** Show the consuming site's DocsThemePicker component; the layer default is empty. @default false */
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
    textByLocale?: Record<string, string>
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
